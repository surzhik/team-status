import {
  GET_SKILLS,
  GET_SKILLS_SUCCESS,
  GET_SKILLS_FAIL,
  ADD_SKILL,
  ADD_SKILL_SUCCESS,
  ADD_SKILL_FAIL,
  DELETE_SKILL,
  DELETE_SKILL_SUCCESS,
  DELETE_SKILL_FAIL,
  UPDATE_SKILL,
  UPDATE_SKILL_SUCCESS,
  UPDATE_SKILL_FAIL,
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
    case GET_SKILLS:
      return {
        ...state,
        loading: true,
      };
    case GET_SKILLS_SUCCESS:
    case ADD_SKILL_SUCCESS:
    case DELETE_SKILL_SUCCESS:
    case UPDATE_SKILL_SUCCESS:
      return {
        ...state,
        loading: false,
        sending: false,
        deleting: false,
        updating: false,
        data: action.payload.data,
      };
    case GET_SKILLS_FAIL:
      return {
        ...state,
        loading: false,
        data: [],
      };

    case ADD_SKILL:
      return {
        ...state,
        sending: true,
      };

    case ADD_SKILL_FAIL:
      return {
        ...state,
        sending: false,
      };

    case DELETE_SKILL:
      return {
        ...state,
        deleting: true,
      };

    case DELETE_SKILL_FAIL:
      return {
        ...state,
        deleting: false,
      };
    case UPDATE_SKILL:
      return {
        ...state,
        updating: true,
      };

    case UPDATE_SKILL_FAIL:
      return {
        ...state,
        updating: false,
      };
    default:
      return state;
  }
}
