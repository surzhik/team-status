/* eslint-disable import/prefer-default-export */
import axios from 'axios';

import { errorClear, errorSet } from './errors';

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

/* eslint-disable import/prefer-default-export */

export const getManagersSuccess = data => ({
  type: GET_MANAGERS_SUCCESS,
  payload: { data },
});

export const getManagersFail = () => ({
  type: GET_MANAGERS_FAIL,
});

export const getManagersLoading = () => ({
  type: GET_MANAGERS,
});

export function getManagersList() {
  return dispatch => {
    dispatch(errorClear());
    dispatch(getManagersLoading());
    return axios({
      url: '/api/managers',
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        dispatch(getManagersSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message:
              'It is unable to load Managers list. Please try again later.',
          }),
        );
        dispatch(getManagersFail());
      });
  };
}

export const addManagerSuccess = data => ({
  type: ADD_MANAGER_SUCCESS,
  payload: { data },
});

export const addManagerFail = () => ({
  type: ADD_MANAGER_FAIL,
});

export const setManagerSending = () => ({
  type: ADD_MANAGER,
});

export function addManager({ firstName, lastName, status }) {
  return dispatch => {
    dispatch(errorClear());
    dispatch(setManagerSending());
    return axios({
      url: '/api/managers',
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        firstName,
        lastName,
        status,
      },
    })
      .then(response => {
        dispatch(addManagerSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message: `It is unable to save new Manager ${firstName} ${lastName}. Please try again later.`,
          }),
        );
        dispatch(addManagerFail());
      });
  };
}

export const updateManagerSuccess = data => ({
  type: UPDATE_MANAGER_SUCCESS,
  payload: { data },
});

export const updateManagerFail = () => ({
  type: UPDATE_MANAGER_FAIL,
});

export const setManagerUpdating = () => ({
  type: UPDATE_MANAGER,
});

export function updateManager({ firstName, lastName, id, status }) {
  return dispatch => {
    dispatch(errorClear());
    dispatch(setManagerUpdating());
    return axios({
      url: '/api/managers',
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        firstName,
        lastName,
        id,
        status,
      },
    })
      .then(response => {
        dispatch(updateManagerSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message: `It is unable to update Manager ${firstName} ${lastName}. Please try again later.`,
          }),
        );
        dispatch(updateManagerFail());
      });
  };
}

export const deleteManagerSuccess = data => ({
  type: DELETE_MANAGER_SUCCESS,
  payload: { data },
});

export const deleteManagerFail = () => ({
  type: DELETE_MANAGER_FAIL,
});

export const setManagerDeleting = () => ({
  type: DELETE_MANAGER,
});

export function deleteManager({ id }) {
  return dispatch => {
    dispatch(errorClear());
    dispatch(setManagerDeleting());
    return axios({
      url: '/api/managers',
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
        dispatch(deleteManagerSuccess(response.data));
      })
      .catch(error => {
        dispatch(
          errorSet({
            error,
            message:
              'It is impossible to delete Manager. Please try again later.',
          }),
        );
        dispatch(deleteManagerFail());
      });
  };
}
