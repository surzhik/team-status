/* eslint-disable import/prefer-default-export */
import axios from 'axios';

import { errorClear, errorSet } from './errors';
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

/* eslint-disable import/prefer-default-export */

export const getSkillsSuccess = data => ({
  type: GET_SKILLS_SUCCESS,
  payload: { data },
});

export const getSkillsFail = () => ({
  type: GET_SKILLS_FAIL,
});

export const getSkillsLoading = () => ({
  type: GET_SKILLS,
});

export function getSkillsList() {
  return dispatch => {
    dispatch(errorClear());
    dispatch(getSkillsLoading());
    return axios({
      url: '/api/skills',
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        dispatch(getSkillsSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message:
              'It is unable to load Skills list. Please try again later.',
          }),
        );
        dispatch(getSkillsFail());
      });
  };
}

export const addSkillSuccess = data => ({
  type: ADD_SKILL_SUCCESS,
  payload: { data },
});

export const addSkillFail = () => ({
  type: ADD_SKILL_FAIL,
});

export const setSkillSending = () => ({
  type: ADD_SKILL,
});

export function addSkill({ name }) {
  return dispatch => {
    dispatch(errorClear());
    dispatch(setSkillSending());
    return axios({
      url: '/api/skills',
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        name,
      },
    })
      .then(response => {
        dispatch(addSkillSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message: `It is unable to save new Skill ${name}. Please try again later.`,
          }),
        );
        dispatch(addSkillFail());
      });
  };
}

export const updateSkillSuccess = data => ({
  type: UPDATE_SKILL_SUCCESS,
  payload: { data },
});

export const updateSkillFail = () => ({
  type: UPDATE_SKILL_FAIL,
});

export const setSkillUpdating = () => ({
  type: UPDATE_SKILL,
});

export function updateSkill({ name, id }) {
  return dispatch => {
    dispatch(errorClear());
    dispatch(setSkillUpdating());
    return axios({
      url: '/api/skills',
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        name,
        id,
      },
    })
      .then(response => {
        dispatch(updateSkillSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message: `It is unable to update Skill ${name}. Please try again later.`,
          }),
        );
        dispatch(updateSkillFail());
      });
  };
}

export const deleteSkillSuccess = data => ({
  type: DELETE_SKILL_SUCCESS,
  payload: { data },
});

export const deleteSkillFail = () => ({
  type: DELETE_SKILL_FAIL,
});

export const setSkillDeleting = () => ({
  type: DELETE_SKILL,
});

export function deleteSkill({ id }) {
  return dispatch => {
    dispatch(errorClear());
    dispatch(setSkillDeleting());
    return axios({
      url: '/api/skills',
      method: 'delete',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        id,
      },
    })
      .then(response => {
        dispatch(deleteSkillSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message:
              'It is impossible to delete Skill. Please try again later.',
          }),
        );
        dispatch(deleteSkillFail());
      });
  };
}
