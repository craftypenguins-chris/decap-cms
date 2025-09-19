import { Map } from 'immutable';
import { basename, getBlobSHA } from 'decap-cms-lib-util';

import { currentBackend } from '../backend';
import { createAssetProxy } from '../valueObjects/AssetProxy';
import { selectIntegration } from '../reducers';
import {
  selectMediaFilePath,
  selectMediaFilePublicPath,
  selectEditingDraft,
} from '../reducers/entries';
import { selectMediaDisplayURL, selectMediaFiles } from '../reducers/mediaLibrary';
import { getIntegrationProvider } from '../integrations';
import { addAsset, removeAsset } from './media';
import { addDraftEntryMediaFile, removeDraftEntryMediaFile } from './entries';
import { sanitizeSlug } from '../lib/urlHelper';
import { waitUntilWithTimeout } from './waitUntil';
import { addNotification } from './notifications';

import type {
  State,
  MediaFile,
  DisplayURLState,
  MediaLibraryInstance,
  EntryField,
} from '../types/redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type AssetProxy from '../valueObjects/AssetProxy';
import type { ImplementationMediaFile } from 'decap-cms-lib-util';

export const MEDIA_LIBRARY_OPEN = 'MEDIA_LIBRARY_OPEN';
export const MEDIA_LIBRARY_CLOSE = 'MEDIA_LIBRARY_CLOSE';
export const MEDIA_LIBRARY_CREATE = 'MEDIA_LIBRARY_CREATE';
export const MEDIA_INSERT = 'MEDIA_INSERT';
export const MEDIA_REMOVE_INSERTED = 'MEDIA_REMOVE_INSERTED';
export const MEDIA_LOAD_REQUEST = 'MEDIA_LOAD_REQUEST';
export const MEDIA_LOAD_SUCCESS = 'MEDIA_LOAD_SUCCESS';
export const MEDIA_LOAD_FAILURE = 'MEDIA_LOAD_FAILURE';
export const MEDIA_PERSIST_REQUEST = 'MEDIA_PERSIST_REQUEST';
export const MEDIA_PERSIST_SUCCESS = 'MEDIA_PERSIST_SUCCESS';
export const MEDIA_PERSIST_FAILURE = 'MEDIA_PERSIST_FAILURE';
export const MEDIA_DELETE_REQUEST = 'MEDIA_DELETE_REQUEST';
export const MEDIA_DELETE_SUCCESS = 'MEDIA_DELETE_SUCCESS';
export const MEDIA_DELETE_FAILURE = 'MEDIA_DELETE_FAILURE';
export const MEDIA_DISPLAY_URL_REQUEST = 'MEDIA_DISPLAY_URL_REQUEST';
export const MEDIA_DISPLAY_URL_SUCCESS = 'MEDIA_DISPLAY_URL_SUCCESS';
export const MEDIA_DISPLAY_URL_FAILURE = 'MEDIA_DISPLAY_URL_FAILURE';

export function createMediaLibrary(instance: MediaLibraryInstance) {
  const api = {
    show: instance.show || (() => undefined),
    hide: instance.hide || (() => undefined),
    onClearControl: instance.onClearControl || (() => undefined),
    onRemoveControl: instance.onRemoveControl || (() => undefined),
    enableStandalone: instance.enableStandalone || (() => undefined),
  };
  return { type: MEDIA_LIBRARY_CREATE, payload: api } as const;
}

export function clearMediaControl(id: string) {
  return (_dispatch: ThunkDispatch<State, {}, AnyAction>, getState: () => State) => {
    const state = getState();
    const mediaLibrary = state.mediaLibrary.get('externalLibrary');
    if (mediaLibrary) {
      mediaLibrary.onClearControl({ id });
    }
  };
}

export function removeMediaControl(id: string) {
  return (_dispatch: ThunkDispatch<State, {}, AnyAction>, getState: () => State) => {
    const state = getState();
    const mediaLibrary = state.mediaLibrary.get('externalLibrary');
    if (mediaLibrary) {
      mediaLibrary.onRemoveControl({ id });
    }
  };
}

export function openMediaLibrary(
  payload: {
    controlID?: string;
    forImage?: boolean;
    privateUpload?: boolean;
    value?: string;
    allowMultiple?: boolean;
    config?: Map<string, unknown>;
    field?: EntryField;
  } = {},
) {
  return (dispatch: ThunkDispatch<State, {}, AnyAction>, getState: () => State) => {
    const state = getState();
    const mediaLibrary = state.mediaLibrary.get('externalLibrary');
    if (mediaLibrary) {
      const { controlID: id, value, config = Map(), allowMultiple, forImage } = payload;
      mediaLibrary.show({ id, value, config: config.toJS(), allowMultiple, imagesOnly: forImage });
    }
    dispatch(mediaLibraryOpened(payload));
  };
}

export function closeMediaLibrary() {
  return (dispatch: ThunkDispatch<State, {}, AnyAction>, getState: () => State) => {
    const state = getState();
    const mediaLibrary = state.mediaLibrary.get('externalLibrary');
    if (mediaLibrary) {
      mediaLibrary.hide();
    }
    dispatch(mediaLibraryClosed());
  };
}

export function insertMedia(mediaPath: string | string[], field: EntryField | undefined) {
  return (dispatch: ThunkDispatch<State, {}, AnyAction>, getState: () => State) => {
    const state = getState();
    const config = state.config;
    const entry = state.entryDraft.get('entry');
    const collectionName = state.entryDraft.getIn(['entry', 'collection']);
    const collection = state.collections.get(collectionName);
    const source = state.mediaLibrary.get('source') || 'repo';
    async function ensureInRepo(pathOrPaths: string | string[]) {
      if (source !== 'local_preview') {
        return pathOrPaths;
      }
      const mirror = config.get && config.get('local_preview_mirror');
      const mirrorUrl = (mirror && mirror.get && mirror.get('url')) || (config.backend && (config.backend.mirror_proxy_url || (config.backend.get && config.backend.get('mirror_proxy_url'))));
      const mediaFolder = (config.get && config.get('media_folder')) || (config as any).media_folder;
      if (!mirrorUrl || !mediaFolder) {
        return pathOrPaths;
      }
      const backend = currentBackend(config as any);
      const branch = (backend as any).branch || 'master';

      async function copyOne(singlePath: string) {
        try {
          const res = await fetch(mirrorUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({ action: 'getMediaFile', branch, params: { branch, path: singlePath } }),
          });
          const fileJson = await res.json();
          const encoding = fileJson.encoding;
          let byteArray: Uint8Array = new Uint8Array(0);
          if (encoding === 'base64') {
            const decoded = atob(fileJson.content);
            byteArray = new Uint8Array(decoded.length);
            for (let i = 0; i < decoded.length; i++) byteArray[i] = decoded.charCodeAt(i);
          }
          const blob = new Blob([byteArray]);
          const file = new File([blob], fileJson.name || singlePath.split('/').pop());
          let relativeUnderMedia = singlePath;
          const mf = (mediaFolder as string).replace(/^\/+|\/+$/g, '');
          const normalized = singlePath.replace(/^\/+|\/+$/g, '');
          if (normalized.toLowerCase().startsWith(mf.toLowerCase() + '/')) {
            relativeUnderMedia = normalized.slice(mf.length + 1);
          }
          const destPath = selectMediaFilePath(config as any, collection, entry, relativeUnderMedia, field);
          const assetProxy = createAssetProxy({ file, path: destPath, field });
          await backend.persistMedia(config as any, assetProxy);
          return destPath;
        } catch (e) {
          console.error('Failed to copy Local Preview asset to repo', e);
          return singlePath;
        }
      }

      if (Array.isArray(pathOrPaths)) {
        const mapped = await Promise.all(pathOrPaths.map(p => copyOne(p)));
        return mapped;
      } else {
        return await copyOne(pathOrPaths);
      }
    }

    (async () => {
      let pathToInsert = await ensureInRepo(mediaPath);
      if (Array.isArray(pathToInsert)) {
        pathToInsert = pathToInsert.map(path =>
          selectMediaFilePublicPath(config, collection, path, entry, field),
        );
      } else {
        pathToInsert = selectMediaFilePublicPath(config, collection, pathToInsert as string, entry, field);
      }
      dispatch(mediaInserted(pathToInsert));
    })();
  };
}

export function removeInsertedMedia(controlID: string) {
  return { type: MEDIA_REMOVE_INSERTED, payload: { controlID } } as const;
}

export function loadMedia(
  opts: { delay?: number; query?: string; page?: number; privateUpload?: boolean; source?: 'repo' | 'local_preview'; subpath?: string } = {},
) {
  const { delay = 0, query = '', page = 1, privateUpload } = opts;
  return async (dispatch: ThunkDispatch<State, {}, AnyAction>, getState: () => State) => {
    const state = getState();
    const backend = currentBackend(state.config);
    const integration = selectIntegration(state, null, 'assetStore');
    if (integration) {
      const provider = getIntegrationProvider(state.integrations, backend.getToken, integration);
      dispatch(mediaLoading(page));
      try {
        const files = await provider.retrieve(query, page, privateUpload);
        const mediaLoadedOpts = {
          page,
          canPaginate: true,
          dynamicSearch: true,
          dynamicSearchQuery: query,
          privateUpload,
        };
        return dispatch(mediaLoaded(files, mediaLoadedOpts));
      } catch (error) {
        return dispatch(mediaLoadFailed({ privateUpload }));
      }
    }
    dispatch(mediaLoading(page));

    function loadFunction() {
      const source = opts.source || 'repo';
      const subpath = opts.subpath || '';
      // Repo source: use standard backend
      if (source === 'repo') {
        return backend
          .getMedia()
          .then(files => dispatch(mediaLoaded(files)))
          .catch((error: { status?: number }) => {
            console.error(error);
            if (error.status === 404) {
              dispatch(mediaLoaded([]));
            } else {
              dispatch(mediaLoadFailed());
            }
          });
      }
      // Local Preview: use proxy backend against mirror URL with subpath
      try {
        const cfg = state.config;
        const mirror = cfg.get && cfg.get('local_preview_mirror');
        const mirrorUrl = (mirror && mirror.get && mirror.get('url')) || (cfg.backend && (cfg.backend.mirror_proxy_url || cfg.backend.get && cfg.backend.get('mirror_proxy_url')));
        const mediaFolder = (cfg && (cfg.get && cfg.get('media_folder'))) || cfg.media_folder;
        if (!mirrorUrl || !mediaFolder) {
          return dispatch(mediaLoaded([]));
        }
        // lightweight request without instantiating a full backend class
        const body = JSON.stringify({
          branch: backend.branch || 'master',
          action: 'getMedia',
          params: { branch: backend.branch || 'master', mediaFolder, subpath },
        });
        return fetch(mirrorUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body,
        })
          .then(r => r.json())
          .then(json => {
            const files = (json || []).map((f: any) => {
              if (f.type === 'directory') {
                return {
                  id: f.id,
                  name: f.name,
                  path: f.path,
                  type: 'DIR',
                  url: '',
                  displayURL: '',
                } as unknown as ImplementationMediaFile;
              }
              // passthrough serialized media file as returned by decap-server
              return {
                id: f.id,
                name: f.name,
                path: f.path,
                url: f.url,
                displayURL: f.displayURL || f.url,
                size: f.size,
              } as unknown as ImplementationMediaFile;
            });
            dispatch(mediaLoaded(files));
          })
          .catch(() => dispatch(mediaLoadFailed()));
      } catch (e) {
        console.error(e);
        return dispatch(mediaLoadFailed());
      }
    }

    if (delay > 0) {
      return new Promise(resolve => {
        setTimeout(() => resolve(loadFunction()), delay);
      });
    } else {
      return loadFunction();
    }
  };
}

function createMediaFileFromAsset({
  id,
  file,
  assetProxy,
  draft,
}: {
  id: string;
  file: File;
  assetProxy: AssetProxy;
  draft: boolean;
}): ImplementationMediaFile {
  const mediaFile = {
    id,
    name: basename(assetProxy.path),
    displayURL: assetProxy.url,
    draft,
    file,
    size: file.size,
    url: assetProxy.url,
    path: assetProxy.path,
    field: assetProxy.field,
  };
  return mediaFile;
}

export function persistMedia(file: File, opts: MediaOptions = {}) {
  const { privateUpload, field } = opts;
  return async (dispatch: ThunkDispatch<State, {}, AnyAction>, getState: () => State) => {
    const state = getState();
    const backend = currentBackend(state.config);
    const integration = selectIntegration(state, null, 'assetStore');
    const files: MediaFile[] = selectMediaFiles(state, field);
    const fileName = sanitizeSlug(file.name.toLowerCase(), state.config.slug);
    const existingFile = files.find(existingFile => existingFile.name.toLowerCase() === fileName);

    const editingDraft = selectEditingDraft(state.entryDraft);

    /**
     * Check for existing files of the same name before persisting. If no asset
     * store integration is used, files are being stored in Git, so we can
     * expect file names to be unique. If an asset store is in use, file names
     * may not be unique, so we forego this check.
     */
    if (!integration && existingFile) {
      if (!window.confirm(`${existingFile.name} already exists. Do you want to replace it?`)) {
        return;
      } else {
        await dispatch(deleteMedia(existingFile, { privateUpload }));
      }
    }

    if (integration || !editingDraft) {
      dispatch(mediaPersisting());
    }

    try {
      let assetProxy: AssetProxy;
      if (integration) {
        try {
          const provider = getIntegrationProvider(
            state.integrations,
            backend.getToken,
            integration,
          );
          const response = await provider.upload(file, privateUpload);
          assetProxy = createAssetProxy({
            url: response.asset.url,
            path: response.asset.url,
          });
        } catch (error) {
          assetProxy = createAssetProxy({
            file,
            path: fileName,
          });
        }
      } else if (privateUpload) {
        throw new Error('The Private Upload option is only available for Asset Store Integration');
      } else {
        // If Local Preview source is active and breadcrumbs present, preserve subfolders
        const mediaState = state.mediaLibrary;
        const source = mediaState.get('source') || 'repo';
        const breadcrumbs: string[] = mediaState.get('currentFolderPath') || [];
        const entry = state.entryDraft.get('entry');
        const collection = state.collections.get(entry?.get('collection'));
        let relativePath = fileName;
        if (source === 'local_preview' && breadcrumbs.length > 0) {
          relativePath = `${breadcrumbs.join('/')}/${fileName}`;
        }
        const path = selectMediaFilePath(state.config, collection, entry, relativePath, field);
        assetProxy = createAssetProxy({
          file,
          path,
          field,
        });
      }

      dispatch(addAsset(assetProxy));

      let mediaFile: ImplementationMediaFile;
      if (integration) {
        const id = await getBlobSHA(file);
        // integration assets are persisted immediately, thus draft is false
        mediaFile = createMediaFileFromAsset({ id, file, assetProxy, draft: false });
      } else if (editingDraft) {
        const id = await getBlobSHA(file);
        mediaFile = createMediaFileFromAsset({
          id,
          file,
          assetProxy,
          draft: editingDraft,
        });
        return dispatch(addDraftEntryMediaFile(mediaFile));
      } else {
        mediaFile = await backend.persistMedia(state.config, assetProxy);
      }

      return dispatch(mediaPersisted(mediaFile, { privateUpload }));
    } catch (error) {
      console.error(error);
      dispatch(
        addNotification({
          message: `Failed to persist media: ${error}`,
          type: 'error',
          dismissAfter: 8000,
        }),
      );
      return dispatch(mediaPersistFailed({ privateUpload }));
    }
  };
}

export function deleteMedia(file: MediaFile, opts: MediaOptions = {}) {
  const { privateUpload } = opts;
  return async (dispatch: ThunkDispatch<State, {}, AnyAction>, getState: () => State) => {
    const state = getState();
    const backend = currentBackend(state.config);
    const integration = selectIntegration(state, null, 'assetStore');
    if (integration) {
      const provider = getIntegrationProvider(state.integrations, backend.getToken, integration);
      dispatch(mediaDeleting());

      try {
        await provider.delete(file.id);
        return dispatch(mediaDeleted(file, { privateUpload }));
      } catch (error) {
        console.error(error);
        dispatch(
          addNotification({
            message: `Failed to delete media: ${error.message}`,
            type: 'error',
            dismissAfter: 8000,
          }),
        );
        return dispatch(mediaDeleteFailed({ privateUpload }));
      }
    }

    try {
      if (file.draft) {
        dispatch(removeAsset(file.path));
        dispatch(removeDraftEntryMediaFile({ id: file.id }));
      } else {
        const editingDraft = selectEditingDraft(state.entryDraft);

        dispatch(mediaDeleting());
        dispatch(removeAsset(file.path));

        await backend.deleteMedia(state.config, file.path);

        dispatch(mediaDeleted(file));
        if (editingDraft) {
          dispatch(removeDraftEntryMediaFile({ id: file.id }));
        }
      }
    } catch (error) {
      console.error(error);
      dispatch(
        addNotification({
          message: `Failed to delete media: ${error.message}`,
          type: 'error',
          dismissAfter: 8000,
        }),
      );
      return dispatch(mediaDeleteFailed());
    }
  };
}

export async function getMediaFile(state: State, path: string) {
  const backend = currentBackend(state.config);
  const { url } = await backend.getMediaFile(path);
  return { url };
}

export function loadMediaDisplayURL(file: MediaFile) {
  return async (dispatch: ThunkDispatch<State, {}, AnyAction>, getState: () => State) => {
    const { displayURL, id } = file;
    const state = getState();
    const displayURLState: DisplayURLState = selectMediaDisplayURL(state, id);
    if (
      !id ||
      !displayURL ||
      displayURLState.get('url') ||
      displayURLState.get('isFetching') ||
      displayURLState.get('err')
    ) {
      return Promise.resolve();
    }
    if (typeof displayURL === 'string') {
      dispatch(mediaDisplayURLRequest(id));
      dispatch(mediaDisplayURLSuccess(id, displayURL));
      return;
    }
    try {
      const backend = currentBackend(state.config);
      dispatch(mediaDisplayURLRequest(id));
      const newURL = await backend.getMediaDisplayURL(displayURL);
      if (newURL) {
        dispatch(mediaDisplayURLSuccess(id, newURL));
      } else {
        throw new Error('No display URL was returned!');
      }
    } catch (err) {
      console.error(err);
      dispatch(mediaDisplayURLFailure(id, err));
    }
  };
}

function mediaLibraryOpened(payload: {
  controlID?: string;
  forImage?: boolean;
  privateUpload?: boolean;
  value?: string;
  replaceIndex?: number;
  allowMultiple?: boolean;
  config?: Map<string, unknown>;
  field?: EntryField;
}) {
  return { type: MEDIA_LIBRARY_OPEN, payload } as const;
}

function mediaLibraryClosed() {
  return { type: MEDIA_LIBRARY_CLOSE } as const;
}

function mediaInserted(mediaPath: string | string[]) {
  return { type: MEDIA_INSERT, payload: { mediaPath } } as const;
}

export function mediaLoading(page: number) {
  return {
    type: MEDIA_LOAD_REQUEST,
    payload: { page },
  } as const;
}

interface MediaOptions {
  privateUpload?: boolean;
  field?: EntryField;
  page?: number;
  canPaginate?: boolean;
  dynamicSearch?: boolean;
  dynamicSearchQuery?: string;
}

export function mediaLoaded(files: ImplementationMediaFile[], opts: MediaOptions = {}) {
  return {
    type: MEDIA_LOAD_SUCCESS,
    payload: { files, ...opts },
  } as const;
}

export function mediaLoadFailed(opts: MediaOptions = {}) {
  const { privateUpload } = opts;
  return { type: MEDIA_LOAD_FAILURE, payload: { privateUpload } } as const;
}

export function mediaPersisting() {
  return { type: MEDIA_PERSIST_REQUEST } as const;
}

export function mediaPersisted(file: ImplementationMediaFile, opts: MediaOptions = {}) {
  const { privateUpload } = opts;
  return {
    type: MEDIA_PERSIST_SUCCESS,
    payload: { file, privateUpload },
  } as const;
}

export function mediaPersistFailed(opts: MediaOptions = {}) {
  const { privateUpload } = opts;
  return { type: MEDIA_PERSIST_FAILURE, payload: { privateUpload } } as const;
}

export function mediaDeleting() {
  return { type: MEDIA_DELETE_REQUEST } as const;
}

export function mediaDeleted(file: MediaFile, opts: MediaOptions = {}) {
  const { privateUpload } = opts;
  return {
    type: MEDIA_DELETE_SUCCESS,
    payload: { file, privateUpload },
  } as const;
}

export function mediaDeleteFailed(opts: MediaOptions = {}) {
  const { privateUpload } = opts;
  return { type: MEDIA_DELETE_FAILURE, payload: { privateUpload } } as const;
}

export function mediaDisplayURLRequest(key: string) {
  return { type: MEDIA_DISPLAY_URL_REQUEST, payload: { key } } as const;
}

export function mediaDisplayURLSuccess(key: string, url: string) {
  return {
    type: MEDIA_DISPLAY_URL_SUCCESS,
    payload: { key, url },
  } as const;
}

export function mediaDisplayURLFailure(key: string, err: Error) {
  return {
    type: MEDIA_DISPLAY_URL_FAILURE,
    payload: { key, err },
  } as const;
}

export async function waitForMediaLibraryToLoad(
  dispatch: ThunkDispatch<State, {}, AnyAction>,
  state: State,
) {
  if (state.mediaLibrary.get('isLoading') !== false && !state.mediaLibrary.get('externalLibrary')) {
    await waitUntilWithTimeout(dispatch, resolve => ({
      predicate: ({ type }) => type === MEDIA_LOAD_SUCCESS || type === MEDIA_LOAD_FAILURE,
      run: () => resolve(),
    }));
  }
}

export async function getMediaDisplayURL(
  dispatch: ThunkDispatch<State, {}, AnyAction>,
  state: State,
  file: MediaFile,
) {
  const displayURLState: DisplayURLState = selectMediaDisplayURL(state, file.id);

  let url: string | null | undefined;
  if (displayURLState.get('url')) {
    // url was already loaded
    url = displayURLState.get('url');
  } else if (displayURLState.get('err')) {
    // url loading had an error
    url = null;
  } else {
    const key = file.id;
    const promise = waitUntilWithTimeout<string>(dispatch, resolve => ({
      predicate: ({ type, payload }) =>
        (type === MEDIA_DISPLAY_URL_SUCCESS || type === MEDIA_DISPLAY_URL_FAILURE) &&
        payload.key === key,
      run: (_dispatch, _getState, action) => resolve(action.payload.url),
    }));

    if (!displayURLState.get('isFetching')) {
      // load display url
      dispatch(loadMediaDisplayURL(file));
    }

    url = (await promise) ?? null;
  }

  return url;
}

export type MediaLibraryAction = ReturnType<
  | typeof createMediaLibrary
  | typeof mediaLibraryOpened
  | typeof mediaLibraryClosed
  | typeof mediaInserted
  | typeof removeInsertedMedia
  | typeof mediaLoading
  | typeof mediaLoaded
  | typeof mediaLoadFailed
  | typeof mediaPersisting
  | typeof mediaPersisted
  | typeof mediaPersistFailed
  | typeof mediaDeleting
  | typeof mediaDeleted
  | typeof mediaDeleteFailed
  | typeof mediaDisplayURLRequest
  | typeof mediaDisplayURLSuccess
  | typeof mediaDisplayURLFailure
>;
