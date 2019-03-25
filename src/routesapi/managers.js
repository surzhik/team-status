import express from 'express';
import Managers from '../models/managers';

/* eslint-disable consistent-return */
const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      res.json(await Managers.getFullList({}));
    } catch (error) {
      return next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const manager = new Managers();
      await manager.addManager(req.body);
    } catch (error) {
      return next(error);
    }
    try {
      res.json(await Managers.getFullList({}));
    } catch (error) {
      return next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      await Managers.updateManager(req.body);
    } catch (error) {
      return next(error);
    }
    try {
      res.json(await Managers.getFullList({}));
    } catch (error) {
      return next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await Managers.deleteManager(req.body);
    } catch (error) {
      return next(error);
    }
    try {
      res.json(await Managers.getFullList({}));
    } catch (error) {
      return next(error);
    }
  });

export default router;
