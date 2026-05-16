import { useState, useEffect, useCallback } from 'react';

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violationCount, setViolationCount] = useState(0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const currentFullscreen = !!document.fullscreenElement;
      setIsFullscreen(currentFullscreen);
      
      if (!currentFullscreen) {
        setViolationCount((prev) => prev + 1);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const enterFullscreen = useCallback(async (element: HTMLElement = document.documentElement) => {
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      }
    } catch (err) {
      console.error('Error attempting to enable fullscreen:', err);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen && document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error attempting to exit fullscreen:', err);
    }
  }, []);

  return { isFullscreen, violationCount, enterFullscreen, exitFullscreen, resetViolations: () => setViolationCount(0) };
}
