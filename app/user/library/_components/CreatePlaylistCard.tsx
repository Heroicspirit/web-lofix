"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreatePlaylistData } from "@/lib/api/playlist";
import { handleCreatePlaylist } from "@/lib/actions/playlist-action";

export default function CreatePlaylistCard() {
  const [isCreating, setIsCreating] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  const handleCreate = async () => {
    if (!playlistName.trim()) return;
    
    setIsCreating(true);
    try {
      const result = await handleCreatePlaylist({
        name: playlistName,
        isPublic: false,
        coverColor: "from-purple-500 to-pink-500"
      });
      
      console.log("Create playlist result:", result);
      
      if (result.success) {
        setPlaylistName("");
        // Refresh the page to show new playlist
        window.location.reload();
      } else {
        console.error("Failed to create playlist:", result.message);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-zinc-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
      {!isCreating ? (
        <>
          <button 
            onClick={() => setIsCreating(true)}
            className="w-full h-full flex flex-col items-center justify-center gap-4"
          >
            <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-blue-500 group-hover:scale-110 transition-all">
              <Plus size={32} />
            </div>
            <span className="text-sm font-bold text-zinc-500 group-hover:text-zinc-300">Build New Mix</span>
          </button>
        </>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Playlist name..."
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={!playlistName.trim()}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setPlaylistName("");
              }}
              className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}