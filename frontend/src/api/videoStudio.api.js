import api from '../lib/axios';

export const videoStudioApi = {
  generate: (tool, inputs) => api.post('/video-studio/generate', { tool, inputs }),
};
