import { useState, useRef, useCallback } from 'react';

export interface VideoRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  recordedBlob: Blob | null;
  duration: number;
  error: string | null;
}

export interface VideoRecorderControls {
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  resetRecording: () => void;
}

export const useVideoRecorder = () => {
  const [state, setState] = useState<VideoRecorderState>({
    isRecording: false,
    isPaused: false,
    recordedBlob: null,
    duration: 0,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateDuration = useCallback(() => {
    if (startTimeRef.current > 0) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setState(prev => ({ ...prev, duration: elapsed }));
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;
      chunksRef.current = [];

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setState(prev => ({
          ...prev,
          recordedBlob: blob,
          isRecording: false,
          isPaused: false
        }));

        // Stop duration tracking
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      // Handle errors
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setState(prev => ({
          ...prev,
          error: 'Recording failed. Please try again.',
          isRecording: false,
          isPaused: false
        }));
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      startTimeRef.current = Date.now();

      setState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        duration: 0
      }));

      // Start duration tracking
      durationIntervalRef.current = setInterval(updateDuration, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to access camera/microphone. Please check permissions.',
        isRecording: false
      }));
    }
  }, [updateDuration]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [state.isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && !state.isPaused) {
      mediaRecorderRef.current.pause();
      setState(prev => ({ ...prev, isPaused: true }));

      // Pause duration tracking
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    }
  }, [state.isRecording, state.isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && state.isPaused) {
      mediaRecorderRef.current.resume();
      setState(prev => ({ ...prev, isPaused: false }));

      // Resume duration tracking
      startTimeRef.current = Date.now() - (state.duration * 1000);
      durationIntervalRef.current = setInterval(updateDuration, 1000);
    }
  }, [state.isRecording, state.isPaused, state.duration, updateDuration]);

  const resetRecording = useCallback(() => {
    // Stop recording if active
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
    }

    // Clear duration tracking
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Reset state
    setState({
      isRecording: false,
      isPaused: false,
      recordedBlob: null,
      duration: 0,
      error: null,
    });

    // Clear refs
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    startTimeRef.current = 0;
  }, [state.isRecording]);

  const controls: VideoRecorderControls = {
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  };

  return { state, controls };
};