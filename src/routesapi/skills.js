import express from 'express';
import Skills from '../models/skills';
/* eslint-disable consistent-return */
const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      res.json(await Skills.getFullList());
    } catch (error) {
      return next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const skill = new Skills();
      await skill.addSkill(req.body);
    } catch (error) {
      return next(error);
    }
    try {
      res.json(await Skills.getFullList());
    } catch (error) {
      return next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      await Skills.updateSkill(req.body);
    } catch (error) {
      return next(error);
    }
    try {
      res.json(await Skills.getFullList());
    } catch (error) {
      return next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await Skills.deleteSkill(req.body);
    } catch (error) {
      return next(error);
    }
    try {
      res.json(await Skills.getFullList());
    } catch (error) {
      return next(error);
    }
  });

export default router;
