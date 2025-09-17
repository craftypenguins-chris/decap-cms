import { Map } from 'immutable';

export const MIRROR_STATUS_CHANGE = 'MIRROR_STATUS_CHANGE';

export interface MirrorStatusAction {
  type: typeof MIRROR_STATUS_CHANGE;
  payload: {
    status: 'connected' | 'disconnected' | 'error';
    lastSync?: Date;
    error?: string;
  };
}

const defaultState = Map({
  status: 'disconnected',
  lastSync: null,
  error: null,
});

export default function mirrorStatus(
  state = defaultState,
  action: MirrorStatusAction,
) {
  switch (action.type) {
    case MIRROR_STATUS_CHANGE:
      return state.merge(action.payload);
    default:
      return state;
  }
}

export function updateMirrorStatus(
  status: 'connected' | 'disconnected' | 'error',
  lastSync?: Date,
  error?: string,
): MirrorStatusAction {
  return {
    type: MIRROR_STATUS_CHANGE,
    payload: { status, lastSync, error },
  };
}
