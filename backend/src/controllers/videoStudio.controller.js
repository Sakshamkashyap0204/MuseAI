'use strict';

const videoStudioService = require('../services/videoStudio.service');
const { sendSuccess } = require('../utils/apiResponse');

async function generate(req, res, next) {
  try {
    const { tool, inputs } = req.body;
    const result = await videoStudioService.generate(req.user._id, tool, inputs);
    sendSuccess(res, 201, 'Generated successfully', { result });
  } catch (error) {
    next(error);
  }
}

module.exports = { generate };
