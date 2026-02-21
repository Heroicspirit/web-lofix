"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreatePlaylistCard from "./_components/CreatePlaylistCard";
import PlaylistCard from "./_components/PlaylistCard";
import { handleGetAllPlaylists } from "@/lib/actions/playlist-action";
import { Playlist } from "@/lib/api/playlist";

export default function LibraryPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const result = await handleGetAllPlaylists();
        if (result.success) {
          setPlaylists(result.data || []);
        } else {
          console.error("Failed to fetch playlists:", result.message);
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlaylistDelete = (playlistId: string) => {
    console.log("Library page - Deleting playlist with ID:", playlistId);
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  };

  const handleAddSongs = (playlistId: string) => {
    console.log("Library page - Adding songs to playlist with ID:", playlistId);
    // Navigate to playlist detail page to add songs
    router.push(`/user/library/${playlistId}/`);
  };

  if (loading) {
    return (
      <>
        <h1 className="text-3xl font-bold mb-8">Your Library</h1>
        <p className="text-gray-400">Loading playlists...</p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Your Library</h1>

      {playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-2xl mb-6 flex items-center justify-center text-4xl">
            🎵
          </div>

          <p className="text-gray-500 mb-8 text-lg">
            You haven’t created any playlists yet
          </p>

          <div className="w-64">
            <CreatePlaylistCard />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <CreatePlaylistCard />

          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              id={playlist.id}
              name={playlist.name}
              songCount={playlist.songCount}
              isPublic={playlist.isPublic}
              coverColor={
                playlist.coverColor || "from-blue-500 to-purple-500"
              }
              onDelete={handlePlaylistDelete}
              onAddSongs={handleAddSongs}
            />
          ))}
        </div>
      )}
    </>
  );
}