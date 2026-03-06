"use client";

import { createContext, useContext, useRef, useState, useEffect } from "react";

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
  stopPlayer: () => void;
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
  
  // Load state from localStorage on mount
  const [currentSong, setCurrentSong] = useState<Song | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currentSong');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('isPlaying');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  
  const [playlist, setPlaylist] = useState<Song[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('playlist');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currentIndex');
      return saved ? JSON.parse(saved) : 0;
    }
    return 0;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentSong', JSON.stringify(currentSong));
    }
  }, [currentSong]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isPlaying', JSON.stringify(isPlaying));
    }
  }, [isPlaying]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('playlist', JSON.stringify(playlist));
    }
  }, [playlist]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentIndex', JSON.stringify(currentIndex));
    }
  }, [currentIndex]);

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

  const stopPlayer = () => {
    if (!audioRef.current) return;
    
    // Stop the audio
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.src = '';
    
    // Reset all player state
    setCurrentSong(null);
    setIsPlaying(false);
    setPlaylist([]);
    setCurrentIndex(0);
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentSong');
      localStorage.removeItem('isPlaying');
      localStorage.removeItem('playlist');
      localStorage.removeItem('currentIndex');
    }
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
        currentIndex,
        stopPlayer
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
