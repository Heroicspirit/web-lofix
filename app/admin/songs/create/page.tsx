"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";

export default function CreateSongPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: ''
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // File size limits (in bytes)
  const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 5MB

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_AUDIO_SIZE) {
        setError(`Audio file is too large. Maximum size is ${(MAX_AUDIO_SIZE / 1024 / 1024).toFixed(0)}MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
        e.target.value = ''; // Clear the input
        setAudioFile(null);
        return;
      }
      setError(null);
      setAudioFile(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_IMAGE_SIZE) {
        setError(`Cover image is too large. Maximum size is ${(MAX_IMAGE_SIZE / 1024 / 1024).toFixed(0)}MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
        e.target.value = ''; // Clear the input
        setCoverImage(null);
        return;
      }
      setError(null);
      setCoverImage(file);
    }
  };
  
  // Helper function to extract error message from HTML response
  const extractErrorMessage = (error: any): string => {
    // Try to get JSON error message first
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    
    // If response is HTML (like the MulterError), try to parse it
    if (typeof error.response?.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
      const htmlContent = error.response.data;
      // Try to extract error from HTML <pre> tag (using [\s\S] instead of . with s flag for ES2017 compatibility)
      const preMatch = htmlContent.match(/<pre>([\s\S]*?)<\/pre>/);
      if (preMatch) {
        const preContent = preMatch[1];
        // Extract MulterError message
        const multerMatch = preContent.match(/MulterError:\s*(.+?)(?:<br|$)/i);
        if (multerMatch) {
          return multerMatch[1].trim();
        }
        // Extract any error message
        const errorMatch = preContent.match(/(?:Error|error):\s*(.+?)(?:<br|$)/i);
        if (errorMatch) {
          return errorMatch[1].trim();
        }
        // Return cleaned pre content
        return preContent.replace(/<br\s*\/?>/gi, '\n').replace(/&nbsp;/g, ' ').trim();
      }
    }
    
    // Fallback to generic error message
    if (error.message) {
      return error.message;
    }
    
    return 'An error occurred while uploading the song';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('artist', formData.artist);
      formDataToSend.append('album', formData.album || 'Single');
      formDataToSend.append('genre', formData.genre);
      formDataToSend.append('duration', '180');
      
      if (audioFile) {
        formDataToSend.append('audioFile', audioFile);
      }
      
      if (coverImage) {
        formDataToSend.append('coverImage', coverImage);
      }

      // Validate file sizes before upload
      if (audioFile && audioFile.size > MAX_AUDIO_SIZE) {
        setError(`Audio file is too large. Maximum size is ${(MAX_AUDIO_SIZE / 1024 / 1024).toFixed(0)}MB.`);
        setLoading(false);
        return;
      }
      
      if (coverImage && coverImage.size > MAX_IMAGE_SIZE) {
        setError(`Cover image is too large. Maximum size is ${(MAX_IMAGE_SIZE / 1024 / 1024).toFixed(0)}MB.`);
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/songs/upload', formDataToSend);

      router.push('/admin/songs');
    } catch (err: any) {
      // Extract detailed error message from response
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
      console.error('Upload error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload New Song</h1>
          <p className="text-gray-600 mt-2">Upload a new song with cover image and artist information</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Song Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter song title"
            />
          </div>

          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-2">
              Artist Name *
            </label>
            <input
              type="text"
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter artist name"
            />
          </div>

          <div>
            <label htmlFor="album" className="block text-sm font-medium text-gray-700 mb-2">
              Album
            </label>
            <input
              type="text"
              id="album"
              name="album"
              value={formData.album}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter album name (optional)"
            />
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Pop, Rock, Jazz (comma separated)"
            />
          </div>

          <div>
            <label htmlFor="audioFile" className="block text-sm font-medium text-gray-700 mb-2">
              Audio File * <span className="text-gray-500 font-normal">(Max {(MAX_AUDIO_SIZE / 1024 / 1024).toFixed(0)}MB)</span>
            </label>
            <input
              type="file"
              id="audioFile"
              name="audioFile"
              onChange={handleAudioChange}
              accept="audio/*"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {audioFile && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                {audioFile.size > MAX_AUDIO_SIZE && (
                  <span className="text-red-600 ml-2">⚠ File exceeds maximum size</span>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image * <span className="text-gray-500 font-normal">(Max {(MAX_IMAGE_SIZE / 1024 / 1024).toFixed(0)}MB)</span>
            </label>
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={handleImageChange}
              accept="image/*"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {coverImage && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(coverImage)}
                  alt="Cover preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {coverImage.name} ({(coverImage.size / 1024 / 1024).toFixed(2)} MB)
                  {coverImage.size > MAX_IMAGE_SIZE && (
                    <span className="text-red-600 ml-2">⚠ File exceeds maximum size</span>
                  )}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !audioFile}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Song'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/songs')}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
