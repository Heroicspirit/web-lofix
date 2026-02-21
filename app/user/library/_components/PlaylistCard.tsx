"use client";
import { Music2, Play, MoreVertical, Clock, Globe, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Playlist } from "@/lib/api/playlist";
import { handleDeletePlaylist } from "@/lib/actions/playlist-action";

interface PlaylistCardProps {
  id: string;
  name: string;
  songCount: number;
  isPublic: boolean;
  coverColor: string;
  onDelete?: (playlistId: string) => void;
  onAddSongs?: (playlistId: string) => void;
}

export default function PlaylistCard({ id, name, songCount, isPublic, coverColor, onDelete, onAddSongs }: PlaylistCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await handleDeletePlaylist(id);
      if (result.success) {
        onDelete?.(id);
      } else {
        console.error("Failed to delete playlist:", result.message);
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAddSongs = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddSongs?.(id);
  };

  const handleCardClick = () => {
    router.push(`/user/library/${id}/`);
  };

  return (
    <div className="group bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-5 hover:bg-zinc-800/60 transition-all cursor-pointer relative">
      <div onClick={handleCardClick} className="w-full h-full">
        <div className={`aspect-square w-full rounded-[1.8rem] bg-gradient-to-br ${coverColor} mb-5 flex items-center justify-center relative overflow-hidden shadow-2xl`}>
          <Music2 size={48} className="text-white/20 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black shadow-xl">
              <Play fill="black" size={24} className="ml-1" />
            </div>
          </div>
          {isPublic && (
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10 text-white">
              <Globe size={12} />
            </div>
          )}
        </div>
        <div className="flex justify-between items-start px-1">
          <div className="min-w-0">
            <h3 className="font-black text-white text-lg truncate tracking-tight">{name}</h3>
            <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <Clock size={12} />
              {songCount} Songs
            </div>
          </div>
          <div className="relative">
            <button 
              className="text-zinc-500 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(!showDeleteConfirm);
              }}
            >
              <MoreVertical size={20} />
            </button>
            
            <div className={`absolute right-0 top-8 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-10 p-2 min-w-[150px] ${showDeleteConfirm ? 'block' : 'hidden'}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddSongs(e);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
              >
                <Plus size={16} />
                Add Songs
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
              >
                <Trash2 size={16} />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}