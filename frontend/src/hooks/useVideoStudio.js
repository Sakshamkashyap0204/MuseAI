import { useState } from 'react';
import { videoStudioApi } from '../api/videoStudio.api';
import toast from 'react-hot-toast';

export function useVideoStudio() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const generate = async (tool, inputs) => {
    setIsGenerating(true);
    setResult(null);
    try {
      const { data } = await videoStudioApi.generate(tool, inputs);
      setResult(data.data.result);
      return data.data.result;
    } catch (error) {
      const message = error.response?.data?.message || 'Generation failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => setResult(null);

  return { isGenerating, result, generate, reset };
}
