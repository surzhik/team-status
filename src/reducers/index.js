import { combineReducers } from 'redux';
import skills from './skills';
import projects from './projects';
import managers from './managers';
import workers from './workers';
import runtime from './runtime';
import error from './error';

export default combineReducers({
  skills,
  projects,
  managers,
  workers,
  error,
  runtime,
});
