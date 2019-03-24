import {
  GET_PROJECTS,
  GET_PROJECTS_SUCCESS,
  GET_PROJECTS_FAIL,
  ADD_PROJECT,
  ADD_PROJECT_SUCCESS,
  ADD_PROJECT_FAIL,
  DELETE_PROJECT,
  DELETE_PROJECT_SUCCESS,
  DELETE_PROJECT_FAIL,
  UPDATE_PROJECT,
  UPDATE_PROJECT_SUCCESS,
  UPDATE_PROJECT_FAIL,
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
    case GET_PROJECTS:
      return {
        ...state,
        loading: true,
      };
    case GET_PROJECTS_SUCCESS:
    case ADD_PROJECT_SUCCESS:
    case DELETE_PROJECT_SUCCESS:
    case UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        sending: false,
        deleting: false,
        updating: false,
        data: action.payload.data,
      };
    case GET_PROJECTS_FAIL:
      return {
        ...state,
        loading: false,
        data: [],
      };

    case ADD_PROJECT:
      return {
        ...state,
        sending: true,
      };

    case ADD_PROJECT_FAIL:
      return {
        ...state,
        sending: false,
      };

    case DELETE_PROJECT:
      return {
        ...state,
        deleting: true,
      };

    case DELETE_PROJECT_FAIL:
      return {
        ...state,
        deleting: false,
      };
    case UPDATE_PROJECT:
      return {
        ...state,
        updating: true,
      };

    case UPDATE_PROJECT_FAIL:
      return {
        ...state,
        updating: false,
      };
    default:
      return state;
  }
}
