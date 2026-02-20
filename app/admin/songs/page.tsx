"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";

export default function AdminSongsPage() {
  const router = useRouter();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get('/api/songs');
      setSongs(response.data.data?.songs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteSong = async (songId: string) => {
    try {
      await axios.delete(`/api/songs/${songId}`);
      await fetchSongs(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete song');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Song Management</h1>
          <button
            onClick={() => router.push('/admin/songs/create')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Add New Song
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-red-600 hover:text-red-800 text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Songs ({songs.length})</h2>
            <div className="space-y-4">
              {songs.map((song: any) => (
                <div key={song._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{song.title}</h3>
                      <p className="text-sm text-gray-600">by {song.artist?.name || 'Unknown Artist'}</p>
                      {song.audioUrl && (
                        <audio controls className="w-full mt-2">
                          <source src={`http://localhost:5000${song.audioUrl}`} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </div>
                    {song.coverImage && (
                      <img 
                        src={`http://localhost:5000${song.coverImage}`} 
                        alt={song.title} 
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => router.push(`/admin/songs/${song._id}/edit`)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSong(song._id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {songs.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No songs found. Upload your first songs to get started!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
