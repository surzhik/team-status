import express from 'express';
import skills from './skills';
import projects from './projects';
import managers from './managers';
import workers from './workers';

const routerAPI = express.Router();
/* eslint-disable consistent-return */
// GET route for reading data
routerAPI.get('/', (req, res) => {
  res.json({ message: 'API Initialized!' });
});

routerAPI.use('/skills', skills);
routerAPI.use('/projects', projects);
routerAPI.use('/managers', managers);
routerAPI.use('/workers', workers);
export default routerAPI;
