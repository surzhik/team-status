import {
  GET_MANAGERS,
  GET_MANAGERS_SUCCESS,
  GET_MANAGERS_FAIL,
  ADD_MANAGER,
  ADD_MANAGER_SUCCESS,
  ADD_MANAGER_FAIL,
  DELETE_MANAGER,
  DELETE_MANAGER_SUCCESS,
  DELETE_MANAGER_FAIL,
  UPDATE_MANAGER,
  UPDATE_MANAGER_SUCCESS,
  UPDATE_MANAGER_FAIL,
} from '../constants';

export default function runtime(
  state = {
    loading: false,
    sending: false,
    deleting: false,
    updating: false,
    data: [],
  },
  action,
) {
  switch (action.type) {
    case GET_MANAGERS:
      return {
        ...state,
        loading: true,
      };
    case GET_MANAGERS_SUCCESS:
    case ADD_MANAGER_SUCCESS:
    case DELETE_MANAGER_SUCCESS:
    case UPDATE_MANAGER_SUCCESS:
      return {
        ...state,
        loading: false,
        sending: false,
        deleting: false,
        updating: false,
        data: action.payload.data,
      };
    case GET_MANAGERS_FAIL:
      return {
        ...state,
        loading: false,
        data: [],
      };

    case ADD_MANAGER:
      return {
        ...state,
        sending: true,
      };

    case ADD_MANAGER_FAIL:
      return {
        ...state,
        sending: false,
      };

    case DELETE_MANAGER:
      return {
        ...state,
        deleting: true,
      };

    case DELETE_MANAGER_FAIL:
      return {
        ...state,
        deleting: false,
      };
    case UPDATE_MANAGER:
      return {
        ...state,
        updating: true,
      };

    case UPDATE_MANAGER_FAIL:
      return {
        ...state,
        updating: false,
      };
    default:
      return state;
  }
}
