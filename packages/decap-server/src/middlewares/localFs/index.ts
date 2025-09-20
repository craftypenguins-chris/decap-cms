import path from 'path';

import { defaultSchema, joi } from '../joi';
import { pathTraversal } from '../joi/customValidators';
import { listRepoFiles, deleteFile, writeFile, move, listDirChildren } from '../utils/fs';
import { entriesFromFiles, readMediaFile } from '../utils/entries';

import type {
  EntriesByFolderParams,
  EntriesByFilesParams,
  GetEntryParams,
  PersistEntryParams,
  GetMediaParams,
  GetMediaFileParams,
  PersistMediaParams,
  DeleteFileParams,
  DeleteFilesParams,
  DataFile,
} from '../types';
import type express from 'express';
import type winston from 'winston';

type FsOptions = {
  repoPath: string;
  logger: winston.Logger;
};

export function localFsMiddleware({ repoPath, logger }: FsOptions) {
  return async function (req: express.Request, res: express.Response) {
    try {
      const { body } = req;
      try { logger.debug(`[fs] action=${body.action}`); } catch (_) {}

      switch (body.action) {
        case 'info': {
          res.json({
            repo: path.basename(repoPath),
            publish_modes: ['simple'],
            type: 'local_fs',
          });
          break;
        }
        case 'entriesByFolder': {
          const payload = body.params as EntriesByFolderParams;
          const { folder, extension, depth } = payload;
          const entries = await listRepoFiles(repoPath, folder, extension, depth).then(files =>
            entriesFromFiles(
              repoPath,
              files.map(file => ({ path: file })),
            ),
          );
          res.json(entries);
          break;
        }
        case 'entriesByFiles': {
          const payload = body.params as EntriesByFilesParams;
          const entries = await entriesFromFiles(repoPath, payload.files);
          res.json(entries);
          break;
        }
        case 'getEntry': {
          const payload = body.params as GetEntryParams;
          const [entry] = await entriesFromFiles(repoPath, [{ path: payload.path }]);
          res.json(entry);
          break;
        }
        case 'persistEntry': {
          const {
            entry,
            dataFiles = [entry as DataFile],
            assets,
          } = body.params as PersistEntryParams;
          try {
            logger.info(
              `[fs] persistEntry dataFiles=${dataFiles.length} assets=${assets.length}`,
            );
          } catch (_) {}
          await Promise.all(
            dataFiles.map(dataFile => writeFile(path.join(repoPath, dataFile.path), dataFile.raw)),
          );
          // save assets
          await Promise.all(
            assets.map(a =>
              writeFile(path.join(repoPath, a.path), Buffer.from(a.content, a.encoding)),
            ),
          );
          if (dataFiles.every(dataFile => dataFile.newPath)) {
            dataFiles.forEach(async dataFile => {
              await move(
                path.join(repoPath, dataFile.path),
                path.join(repoPath, dataFile.newPath!),
              );
            });
          }
          try { logger.debug('[fs] persistEntry complete'); } catch (_) {}
          res.json({ message: 'entry persisted' });
          break;
        }
        case 'getMedia': {
          const { mediaFolder, subpath = '' } = body.params as GetMediaParams & { subpath?: string };
          const root = path.join(repoPath, mediaFolder);
          const norm = path.normalize(subpath || '').replace(/^\\+|\/+$/g, '');
          if (norm.includes('..')) {
            return res.status(400).json({ error: 'Invalid subpath' });
          }
          const target = path.join(root, norm);
          if (!target.startsWith(root)) {
            return res.status(400).json({ error: 'Invalid subpath' });
          }
          const relTarget = path.relative(repoPath, target);
          // one-level list of directories and files
          const children = await listDirChildren(repoPath, relTarget);
          const files = children.filter(c => c.type === 'file').map(c => c.path);
          const dirs = children.filter(c => c.type === 'directory');
          const serializedFiles = await Promise.all(files.map(file => readMediaFile(repoPath, file)));
          const dirEntries = dirs.map(d => ({
            id: d.path,
            name: d.name,
            path: d.path,
            type: 'directory',
            content: '',
            encoding: 'base64',
          }));
          try {
            logger.debug(
              `[fs] getMedia mediaFolder=${mediaFolder} subpath=${norm} dirs=${dirs.length} files=${files.length}`,
            );
          } catch (_) {}
          res.json([...dirEntries, ...serializedFiles]);
          break;
        }
        case 'getMediaFile': {
          const { path } = body.params as GetMediaFileParams;
          try { logger.debug(`[fs] getMediaFile path=${path}`); } catch (_) {}
          const mediaFile = await readMediaFile(repoPath, path);
          res.json(mediaFile);
          break;
        }
        case 'persistMedia': {
          const { asset } = body.params as PersistMediaParams;
          try {
            logger.info(
              `[fs] persistMedia path=${asset.path} bytes=${(asset.content && asset.content.length) || 0} encoding=${asset.encoding}`,
            );
          } catch (_) {}
          await writeFile(
            path.join(repoPath, asset.path),
            Buffer.from(asset.content, asset.encoding),
          );
          const file = await readMediaFile(repoPath, asset.path);
          try { logger.debug('[fs] persistMedia complete'); } catch (_) {}
          res.json(file);
          break;
        }
        case 'deleteFile': {
          const { path: filePath } = body.params as DeleteFileParams;
          await deleteFile(repoPath, filePath);
          res.json({ message: `deleted file ${filePath}` });
          break;
        }
        case 'deleteFiles': {
          const { paths } = body.params as DeleteFilesParams;
          await Promise.all(paths.map(filePath => deleteFile(repoPath, filePath)));
          res.json({ message: `deleted files ${paths.join(', ')}` });
          break;
        }
        case 'getDeployPreview': {
          res.json(null);
          break;
        }
        default: {
          const message = `Unknown action ${body.action}`;
          res.status(422).json({ error: message });
          break;
        }
      }
    } catch (e) {
      logger.error(
        `Error handling ${JSON.stringify(req.body)}: ${
          e instanceof Error ? e.message : 'Unknown error'
        }`,
      );
      res.status(500).json({ error: 'Unknown error' });
    }
  };
}

export function getSchema({ repoPath }: { repoPath: string }) {
  const schema = defaultSchema({ path: pathTraversal(repoPath) });
  return schema;
}

type Options = {
  logger: winston.Logger;
};

export async function registerMiddleware(app: express.Express, options: Options) {
  const { logger } = options;
  const repoPath = path.resolve(process.env.GIT_REPO_DIRECTORY || process.cwd());
  app.post('/api/v1', joi(getSchema({ repoPath })));
  app.post('/api/v1', localFsMiddleware({ repoPath, logger }));
  logger.info(`Decap CMS File System Proxy Server configured with ${repoPath}`);
}
