"use client";
import React, { createContext, useContext, useState, useRef } from "react";

const PlayerContext = createContext<any>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = `http://localhost:5000${track.audioUrl}`;
      audioRef.current.play();
    }
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, playTrack, setIsPlaying }}>
      {children}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);