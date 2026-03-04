"use client";

import { createContext, useContext, useRef, useState } from "react";

interface Song {
  _id?: string;
  id?: string | number;
  title: string;
  audioUrl: string;
  album?: string;
  artist?: string;
  coverImage?: string;
  sub?: string;
  src?: string;
}

interface PlayerContextType {
  currentSong: Song | null;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  isPlaying: boolean;
  playlist: Song[];
  setPlaylist: (songs: Song[]) => void;
  nextSong: () => void;
  previousSong: () => void;
  currentIndex: number;
}

const PlayerContext = createContext<PlayerContextType | null>(null);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const normalizeAudioUrl = (value: string) => {
  const raw = value.trim().replace(/\\/g, "/");
  if (/^https?:\/\//i.test(raw)) return raw;
  const normalizedPath = raw.startsWith("/") ? raw : `/${raw}`;
  return `${API_BASE_URL.replace(/\/+$/, "")}${encodeURI(normalizedPath)}`;
};

export const PlayerProvider = ({ children }: any) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const playSong = (song: Song) => {
    if (!audioRef.current) return;

    // Find the index of the song in the current playlist
    const songIndex = playlist.findIndex(s => 
      (s._id && song._id && s._id === song._id) || 
      (s.id && song.id && s.id === song.id) ||
      (s.title === song.title && s.audioUrl === song.audioUrl)
    );

    // Update current index if song is found in playlist
    if (songIndex !== -1) {
      setCurrentIndex(songIndex);
    } else {
      setCurrentIndex(playlist.length);
    }

    setCurrentSong(song);
    audioRef.current.src = normalizeAudioUrl(song.audioUrl);
    
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((err: Error) => {
        console.log('PlayerContext play error:', err);
        if (err.name === "NotSupportedError") {
          setIsPlaying(false);
        }
      });
    }
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: Error) => {
          console.log('PlayerContext toggle play error:', err);
          if (err.name === "NotSupportedError") {
            setIsPlaying(false);
          }
        });
      }
    }

    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (playlist.length === 0) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    playSong(playlist[nextIndex]);
  };

  const previousSong = () => {
    if (playlist.length === 0) return;
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    playSong(playlist[prevIndex]);
  };

  return (
    <PlayerContext.Provider
      value={{ 
        currentSong, 
        playSong, 
        togglePlay, 
        isPlaying, 
        playlist, 
        setPlaylist, 
        nextSong, 
        previousSong, 
        currentIndex 
      }}
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
