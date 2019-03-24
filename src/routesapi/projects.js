import express from 'express';
import Projects from '../models/projects';
/* eslint-disable consistent-return */
const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      res.json(await Projects.getFullList());
    } catch (error) {
      return next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const project = new Projects();
      await project.addProject(req.body);
    } catch (error) {
      return next(error);
    }
    try {
      res.json(await Projects.getFullList());
    } catch (error) {
      return next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      await Projects.updateProject(req.body);
    } catch (error) {
      return next(error);
    }
    try {
      res.json(await Projects.getFullList());
    } catch (error) {
      return next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await Projects.deleteProject(req.body);
    } catch (error) {
      return next(error);
    }
    try {
      res.json(await Projects.getFullList());
    } catch (error) {
      return next(error);
    }
  });

export default router;
