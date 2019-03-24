/* eslint-disable import/prefer-default-export */
import axios from 'axios';

import { errorClear, errorSet } from './errors';
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

/* eslint-disable import/prefer-default-export */

export const getProjectsSuccess = data => ({
  type: GET_PROJECTS_SUCCESS,
  payload: { data },
});

export const getProjectsFail = () => ({
  type: GET_PROJECTS_FAIL,
});

export const getProjectsLoading = () => ({
  type: GET_PROJECTS,
});

export function getProjectsList() {
  return dispatch => {
    dispatch(errorClear());
    dispatch(getProjectsLoading());
    return axios({
      url: '/api/projects',
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        dispatch(getProjectsSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message:
              'It is unable to load Projects list. Please try again later.',
          }),
        );
        dispatch(getProjectsFail());
      });
  };
}

export const addProjectSuccess = data => ({
  type: ADD_PROJECT_SUCCESS,
  payload: { data },
});

export const addProjectFail = () => ({
  type: ADD_PROJECT_FAIL,
});

export const setProjectSending = () => ({
  type: ADD_PROJECT,
});

export function addProject({ name, status }) {
  return dispatch => {
    dispatch(errorClear());
    dispatch(setProjectSending());
    return axios({
      url: '/api/projects',
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        name,
        status,
      },
    })
      .then(response => {
        dispatch(addProjectSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message: `It is unable to save new Project ${name}. Please try again later.`,
          }),
        );
        dispatch(addProjectFail());
      });
  };
}

export const updateProjectSuccess = data => ({
  type: UPDATE_PROJECT_SUCCESS,
  payload: { data },
});

export const updateProjectFail = () => ({
  type: UPDATE_PROJECT_FAIL,
});

export const setProjectUpdating = () => ({
  type: UPDATE_PROJECT,
});

export function updateProject({ name, id, status }) {
  return dispatch => {
    dispatch(errorClear());
    dispatch(setProjectUpdating());
    return axios({
      url: '/api/projects',
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        name,
        id,
        status,
      },
    })
      .then(response => {
        dispatch(updateProjectSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message: `It is unable to update Project ${name}. Please try again later.`,
          }),
        );
        dispatch(updateProjectFail());
      });
  };
}

export const deleteProjectSuccess = data => ({
  type: DELETE_PROJECT_SUCCESS,
  payload: { data },
});

export const deleteProjectFail = () => ({
  type: DELETE_PROJECT_FAIL,
});

export const setProjectDeleting = () => ({
  type: DELETE_PROJECT,
});

export function deleteProject({ id }) {
  return dispatch => {
    dispatch(errorClear());
    dispatch(setProjectDeleting());
    return axios({
      url: '/api/projects',
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
        dispatch(deleteProjectSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message:
              'It is impossible to delete Project. Please try again later.',
          }),
        );
        dispatch(deleteProjectFail());
      });
  };
}
