'use strict';

const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { generationLimiter } = require('../middlewares/rateLimiter');
const videoStudioController = require('../controllers/videoStudio.controller');

const VALID_TOOLS = ['video_prompt', 'script', 'story_idea', 'scene', 'shot_plan', 'character', 'enhance_prompt'];

const generateRules = [
  body('tool').notEmpty().isIn(VALID_TOOLS).withMessage('Invalid tool'),
  body('inputs').notEmpty().isObject().withMessage('Inputs must be an object'),
  body('inputs.idea').optional().trim().isLength({ min: 3, max: 2000 }),
  body('inputs.prompt').optional().trim().isLength({ min: 3, max: 2000 }),
  body('inputs.scene').optional().trim().isLength({ min: 3, max: 2000 }),
  body('inputs.story').optional().trim().isLength({ min: 3, max: 2000 }),
  body('inputs.description').optional().trim().isLength({ min: 3, max: 2000 }),
];

router.use(authenticate);
router.post('/generate', generationLimiter, ...generateRules, validate, videoStudioController.generate);

module.exports = router;
