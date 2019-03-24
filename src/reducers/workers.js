import {
  GET_WORKERS,
  GET_WORKERS_SUCCESS,
  GET_WORKERS_FAIL,
  ADD_WORKER,
  ADD_WORKER_SUCCESS,
  ADD_WORKER_FAIL,
  DELETE_WORKER,
  DELETE_WORKER_SUCCESS,
  DELETE_WORKER_FAIL,
  UPDATE_WORKER,
  UPDATE_WORKER_SUCCESS,
  UPDATE_WORKER_FAIL,
} from '../constants';

export default function runtime(
  state = {
    loading: false,
    sending: false,
    deleting: false,
    updating: false,
    data: {
      docs: [],
      limit: null,
      page: null,
      pages: null,
      total: null,
    },
    reference: {
      skills: [],
      managers: [],
      projects: [],
    },
  },
  action,
) {
  switch (action.type) {
    case GET_WORKERS:
      return {
        ...state,
        loading: true,
      };
    case GET_WORKERS_SUCCESS:
    case ADD_WORKER_SUCCESS:
    case DELETE_WORKER_SUCCESS:
    case UPDATE_WORKER_SUCCESS:
      return {
        ...state,
        loading: false,
        sending: false,
        deleting: false,
        updating: false,
        ...action.payload,
      };
    case GET_WORKERS_FAIL:
      return {
        ...state,
        loading: false,
        data: { docs: [], limit: null, page: null, pages: null, total: null },
      };

    case ADD_WORKER:
      return {
        ...state,
        sending: true,
      };

    case ADD_WORKER_FAIL:
      return {
        ...state,
        sending: false,
      };

    case DELETE_WORKER:
      return {
        ...state,
        deleting: true,
      };

    case DELETE_WORKER_FAIL:
      return {
        ...state,
        deleting: false,
      };
    case UPDATE_WORKER:
      return {
        ...state,
        updating: true,
      };

    case UPDATE_WORKER_FAIL:
      return {
        ...state,
        updating: false,
      };
    default:
      return state;
  }
}
