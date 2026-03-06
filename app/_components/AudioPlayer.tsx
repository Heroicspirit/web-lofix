"use client";

import { useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  title: string;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
    <div className="p-4 bg-black text-white rounded-lg">
      <h3>{title}</h3>

      <audio
        ref={audioRef}
        src={`http://localhost:5000${src}`}
      />

      <button
        onClick={togglePlay}
        className="mt-2 px-4 py-2 bg-green-500 rounded"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}
