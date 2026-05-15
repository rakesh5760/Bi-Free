import { useState, useEffect, useRef } from 'react';

export function useMediaDevices(requireVideo = true, requireAudio = true) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const requestAccess = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: requireVideo,
        audio: requireAudio,
      });
      setStream(mediaStream);
      setIsRecording(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to access media devices. Please allow camera/microphone permissions.');
      setIsRecording(false);
    }
  };

  const stopAccess = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsRecording(false);
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopAccess();
    };
  }, [stream]);

  return { stream, error, isRecording, requestAccess, stopAccess, videoRef };
}
