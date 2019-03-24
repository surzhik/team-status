/* eslint-disable import/prefer-default-export */
import axios from 'axios';

import { errorClear, errorSet } from './errors';
import { getSkillsList } from './skills';
import { getManagersList } from './managers';
import { getProjectsList } from './projects';

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
  CHECK_WORKER_SUCCESS,
  CHECK_WORKER_FAIL,
} from '../constants';

/* eslint-disable import/prefer-default-export */

export const getWorkersSuccess = data => ({
  type: GET_WORKERS_SUCCESS,
  payload: data,
});

export const getWorkersFail = () => ({
  type: GET_WORKERS_FAIL,
});

export const getWorkersLoading = () => ({
  type: GET_WORKERS,
});

export function getWorkersList(data) {
  return dispatch => {
    dispatch(errorClear());
    dispatch(getWorkersLoading());
    let getArgs = '';
    if (data) {
      Object.keys(data).forEach(key => {
        getArgs = `${getArgs}${getArgs ? '&' : '?'}${key}=${data[key]}`;
      });
    }
    console.log('getArgs', getArgs);
    return axios({
      url: `/api/workers${getArgs}`,
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log(response.data);
        dispatch(getWorkersSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message:
              'It is unable to load Members list. Please try again later.',
          }),
        );
        dispatch(getWorkersFail());
      });
  };
}

export const addWorkerSuccess = data => ({
  type: ADD_WORKER_SUCCESS,
  payload: { data },
});

export const addWorkerFail = () => ({
  type: ADD_WORKER_FAIL,
});

export const setWorkerSending = () => ({
  type: ADD_WORKER,
});

export function addWorker(data) {
  return dispatch => {
    dispatch(errorClear());
    dispatch(setWorkerSending());
    return axios({
      url: '/api/workers',
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data,
    })
      .then(response => {
        dispatch(addWorkerSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message: `It is unable to save new Member ${data.firstName} ${
              data.lastName
            }. Please try again later.`,
          }),
        );
        dispatch(addWorkerFail());
      });
  };
}

export const updateWorkerSuccess = data => ({
  type: UPDATE_WORKER_SUCCESS,
  payload: { data },
});

export const updateWorkerFail = () => ({
  type: UPDATE_WORKER_FAIL,
});

export const setWorkerUpdating = () => ({
  type: UPDATE_WORKER,
});

export function updateWorker(data) {
  return dispatch => {
    dispatch(errorClear());
    dispatch(setWorkerUpdating());
    return axios({
      url: '/api/workers',
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data,
    })
      .then(response => {
        dispatch(updateWorkerSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message: `It is unable to update Member ${data.firstName} ${
              data.lastName
            }. Please try again later.`,
          }),
        );
        dispatch(updateWorkerFail());
      });
  };
}

export const deleteWorkerSuccess = data => ({
  type: DELETE_WORKER_SUCCESS,
  payload: { data },
});

export const deleteWorkerFail = () => ({
  type: DELETE_WORKER_FAIL,
});

export const setWorkerDeleting = () => ({
  type: DELETE_WORKER,
});

export function deleteWorker({ id }) {
  return dispatch => {
    dispatch(errorClear());
    dispatch(setWorkerDeleting());
    return axios({
      url: '/api/workers',
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
        dispatch(deleteWorkerSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message:
              'It is impossible to delete Member. Please try again later.',
          }),
        );
        dispatch(deleteWorkerFail());
      });
  };
}

export const checkWorkerSuccess = data => ({
  type: CHECK_WORKER_SUCCESS,
  payload: { data },
});

export const checkWorkerFail = () => ({
  type: CHECK_WORKER_FAIL,
});

export function checkWorker(data) {
  return dispatch => {
    dispatch(errorClear());
    return axios({
      url: '/api/workers/check',
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data,
    })
      .then(response => {
        console.log(response.data);
        dispatch(checkWorkerSuccess(response.data));
        return response.data;
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message:
              'It is impossible to check Member Name. Please try again later.',
          }),
        );
        dispatch(checkWorkerFail());
      });
  };
}
