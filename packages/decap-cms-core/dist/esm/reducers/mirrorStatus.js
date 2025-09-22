import { Map } from 'immutable';
export const MIRROR_STATUS_CHANGE = 'MIRROR_STATUS_CHANGE';
const defaultState = Map({
  status: 'disconnected',
  lastSync: null,
  error: null
});
export default function mirrorStatus(state = defaultState, action) {
  switch (action.type) {
    case MIRROR_STATUS_CHANGE:
      return state.merge(action.payload);
    default:
      return state;
  }
}
export function updateMirrorStatus(status, lastSync, error) {
  return {
    type: MIRROR_STATUS_CHANGE,
    payload: {
      status,
      lastSync,
      error
    }
  };
}