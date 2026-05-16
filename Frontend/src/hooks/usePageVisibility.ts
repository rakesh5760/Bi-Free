import { useState, useEffect } from 'react';

export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const [violationCount, setViolationCount] = useState(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isCurrentlyVisible = document.visibilityState === 'visible';
      setIsVisible(isCurrentlyVisible);
      
      if (!isCurrentlyVisible) {
        setViolationCount((prev) => prev + 1);
        // Additional side effects like logging to backend can go here
      }
    };

    const handleWindowBlur = () => {
      setIsVisible(false);
      setViolationCount((prev) => prev + 1);
    };

    const handleWindowFocus = () => {
      setIsVisible(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  return { isVisible, violationCount, resetViolations: () => setViolationCount(0) };
}
