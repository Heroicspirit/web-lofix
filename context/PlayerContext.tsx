"use client";

import { createContext, useContext, useRef, useState } from "react";

interface Song {
  title: string;
  audioUrl: string;
}

interface PlayerContextType {
  currentSong: Song | null;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  isPlaying: boolean;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: any) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = (song: Song) => {
    if (!audioRef.current) return;

    setCurrentSong(song);
    audioRef.current.src = `http://localhost:5000${song.audioUrl}`;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <PlayerContext.Provider
      value={{ currentSong, playSong, togglePlay, isPlaying }}
    >
      {children}
      <audio ref={audioRef} />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be inside PlayerProvider");
  return context;
};
