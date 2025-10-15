import React, { createContext, useContext, useState, useReducer } from 'react';

const TimelineContext = createContext();

const initialState = {
  tracks: [
    { id: 'video-main', type: 'video', name: 'Main Video', clips: [] },
    { id: 'video-overlay', type: 'video', name: 'Video Overlay', clips: [] },
    { id: 'audio-main', type: 'audio', name: 'Main Audio', clips: [] },
    { id: 'audio-voice', type: 'audio', name: 'Voice Over', clips: [] },
    { id: 'text', type: 'text', name: 'Text/Captions', clips: [] },
    { id: 'vfx', type: 'vfx', name: 'Visual Effects', clips: [] },
  ],
  currentTime: 0,
  duration: 0,
  selectedClipId: null,
  isPlaying: false,
  activeAudioUrl: null,
};

function timelineReducer(state, action) {
  switch (action.type) {
    case 'ADD_CLIP':
      return {
        ...state,
        tracks: state.tracks.map(track => 
          track.id === action.trackId
            ? { ...track, clips: [...track.clips, action.clip] }
            : track
        ),
      };
    
    case 'REMOVE_CLIP':
      return {
        ...state,
        tracks: state.tracks.map(track => ({
          ...track,
          clips: track.clips.filter(clip => clip.id !== action.clipId)
        })),
      };
    
    case 'UPDATE_CLIP':
      return {
        ...state,
        tracks: state.tracks.map(track => ({
          ...track,
          clips: track.clips.map(clip => 
            clip.id === action.clipId ? { ...clip, ...action.updates } : clip
          )
        })),
      };

    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.time };

    case 'SET_DURATION':
      return { ...state, duration: action.duration };

    case 'SET_PLAYING':
      return { ...state, isPlaying: action.isPlaying };

    case 'SELECT_CLIP':
      return { ...state, selectedClipId: action.clipId };

    default:
      return state;
  }
}

export function TimelineProvider({ children }) {
  const [state, dispatch] = useReducer(timelineReducer, initialState);

  const addClip = (trackId, clip) => {
    dispatch({ type: 'ADD_CLIP', trackId, clip });
  };

  const removeClip = (clipId) => {
    dispatch({ type: 'REMOVE_CLIP', clipId });
  };

  const updateClip = (clipId, updates) => {
    dispatch({ type: 'UPDATE_CLIP', clipId, updates });
  };

  const setCurrentTime = (time) => {
    dispatch({ type: 'SET_CURRENT_TIME', time });
  };

  const setDuration = (duration) => {
    dispatch({ type: 'SET_DURATION', duration });
  };

  const setPlaying = (isPlaying) => {
    dispatch({ type: 'SET_PLAYING', isPlaying });
  };

  const selectClip = (clipId) => {
    dispatch({ type: 'SELECT_CLIP', clipId });
  };

  const value = {
    ...state,
    addClip,
    removeClip,
    updateClip,
    setCurrentTime,
    setDuration,
    setPlaying,
    selectClip,
  };

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
}

export const useTimeline = () => useContext(TimelineContext);