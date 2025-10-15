import React, { createContext, useContext, useState, useRef } from "react";

const VideoEditorContext = createContext(undefined);

export const useVideoEditor = () => {
  const context = useContext(VideoEditorContext);
  if (!context) {
    throw new Error("useVideoEditor must be used within VideoEditorProvider");
  }
  return context;
};

export const VideoEditorProvider = ({ children }) => {
  const [clips, setClips] = useState([]);
  const [textOverlays, setTextOverlays] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [selectedClipId, setSelectedClipId] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    blur: 0,
  });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const videoRef = useRef(null);

  const saveToHistory = (newClips) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newClips)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const addClip = async (file) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = url;

    await new Promise((resolve) => {
      video.onloadedmetadata = resolve;
    });

    const duration = video.duration;
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 90;
    const ctx = canvas.getContext("2d");
    video.currentTime = duration / 2;

    await new Promise((resolve) => {
      video.onseeked = resolve;
    });

    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const thumbnail = canvas.toDataURL();

    const newClip = {
      id: `clip-${Date.now()}`,
      file,
      url,
      duration,
      startTime: clips.length > 0 ? clips[clips.length - 1].endTime : 0,
      endTime: (clips.length > 0 ? clips[clips.length - 1].endTime : 0) + duration,
      trimStart: 0,
      trimEnd: duration,
      thumbnail,
      speed: 1,
      rotation: 0,
      flipH: false,
      flipV: false,
    };

    const newClips = [...clips, newClip];
    setClips(newClips);
    saveToHistory(newClips);
  };

  const removeClip = (id) => {
    const newClips = clips.filter((clip) => clip.id !== id);
    setClips(newClips);
    saveToHistory(newClips);
  };

  const splitClip = (id, time) => {
    const clipIndex = clips.findIndex((c) => c.id === id);
    if (clipIndex === -1) return;

    const clip = clips[clipIndex];
    const relativeTime = time - clip.startTime;

    const firstClip = {
      ...clip,
      id: `clip-${Date.now()}-1`,
      endTime: clip.startTime + relativeTime,
      trimEnd: clip.trimStart + relativeTime,
    };

    const secondClip = {
      ...clip,
      id: `clip-${Date.now()}-2`,
      startTime: clip.startTime + relativeTime,
      trimStart: clip.trimStart + relativeTime,
    };

    const newClips = [...clips];
    newClips.splice(clipIndex, 1, firstClip, secondClip);
    setClips(newClips);
    saveToHistory(newClips);
  };

  const updateClipTrim = (id, trimStart, trimEnd) => {
    const newClips = clips.map((clip) =>
      clip.id === id ? { ...clip, trimStart, trimEnd } : clip
    );
    setClips(newClips);
    saveToHistory(newClips);
  };

  const updateClipSpeed = (id, speed) => {
    const newClips = clips.map((clip) =>
      clip.id === id ? { ...clip, speed } : clip
    );
    setClips(newClips);
    saveToHistory(newClips);
  };

  const updateClipRotation = (id, rotation) => {
    const newClips = clips.map((clip) =>
      clip.id === id ? { ...clip, rotation } : clip
    );
    setClips(newClips);
    saveToHistory(newClips);
  };

  const updateClipFlip = (id, flipH, flipV) => {
    const newClips = clips.map((clip) =>
      clip.id === id ? { ...clip, flipH, flipV } : clip
    );
    setClips(newClips);
    saveToHistory(newClips);
  };

  const reorderClips = (startIndex, endIndex) => {
    const result = Array.from(clips);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    // Recalculate start and end times
    let currentTime = 0;
    const reorderedClips = result.map(clip => {
      const duration = clip.trimEnd - clip.trimStart;
      const updated = {
        ...clip,
        startTime: currentTime,
        endTime: currentTime + duration
      };
      currentTime += duration;
      return updated;
    });
    
    setClips(reorderedClips);
    saveToHistory(reorderedClips);
  };

  const addTextOverlay = (text) => {
    setTextOverlays([...textOverlays, text]);
  };

  const removeTextOverlay = (id) => {
    setTextOverlays(textOverlays.filter((t) => t.id !== id));
  };

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const getTotalDuration = () => {
    if (clips.length === 0) return 0;
    return clips[clips.length - 1].endTime;
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setClips(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setClips(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  const exportVideo = () => {
    // Simple download of the first clip for now
    // Full implementation would require video encoding
    if (clips.length > 0) {
      const link = document.createElement("a");
      link.href = clips[0].url;
      link.download = `edited-video-${Date.now()}.mp4`;
      link.click();
    }
  };

  return (
    <VideoEditorContext.Provider
      value={{
        clips,
        textOverlays,
        currentTime,
        isPlaying,
        volume,
        selectedClipId,
        zoom,
        filters,
        history,
        historyIndex,
        videoRef,
        addClip,
        removeClip,
        splitClip,
        updateClipTrim,
        updateClipSpeed,
        updateClipRotation,
        updateClipFlip,
        reorderClips,
        addTextOverlay,
        removeTextOverlay,
        setCurrentTime,
        setIsPlaying,
        setVolume,
        setSelectedClipId,
        setZoom,
        updateFilters,
        exportVideo,
        getTotalDuration,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
      }}
    >
      {children}
    </VideoEditorContext.Provider>
  );
};
