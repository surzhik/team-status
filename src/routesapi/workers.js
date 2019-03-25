import express from 'express';
import Workers from '../models/workers';
import Skills from '../models/skills';
import Managers from '../models/managers';
import Projects from '../models/projects';

/* eslint-disable consistent-return */
const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    if (req.query.initial) {
      let skills = null;
      let managers = null;
      let projects = null;
      try {
        skills = await Skills.getFullList({ sort: 'name' });
      } catch (error) {
        return next(error);
      }
      try {
        managers = await Managers.getFullList({ sort: 'fullName' });
      } catch (error) {
        return next(error);
      }
      try {
        projects = await Projects.getFullList({ sort: 'name' });
      } catch (error) {
        return next(error);
      }

      try {
        const workers = await Workers.getFullList({});
        res.json({ data: workers, reference: { skills, managers, projects } });
      } catch (error) {
        return next(error);
      }
    } else {
      try {
        const workers = await Workers.getFullList(req.query);
        res.json({ data: workers });
      } catch (error) {
        return next(error);
      }
    }
  })
  .post(async (req, res, next) => {
    try {
      const worker = new Workers();
      await worker.addWorker(req.body);
    } catch (error) {
      return next(error);
    }
    try {
      res.json(await Workers.getFullList(req.body.pagination));
    } catch (error) {
      return next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      await Workers.updateWorker(req.body);
    } catch (error) {
      return next(error);
    }
    try {
      res.json(await Workers.getFullList(req.body.pagination));
    } catch (error) {
      return next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await Workers.deleteWorker(req.body);
    } catch (error) {
      return next(error);
    }
    try {
      res.json(await Workers.getFullList(req.body.pagination));
    } catch (error) {
      return next(error);
    }
  });

router.route('/check').post(async (req, res, next) => {
  try {
    res.json(!!(await Workers.checkWorker(req.body)));
  } catch (error) {
    return next(error);
  }
});

export default router;
