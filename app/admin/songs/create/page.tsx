"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { 
  CloudUpload, Music, Image as ImageIcon, 
  X, CheckCircle2, AlertCircle, ArrowLeft,
  ChevronRight, Mic2, Disc
} from "lucide-react";

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
  
  const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5MB (Corrected to 5MB for images)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_AUDIO_SIZE) {
        setError(`Audio too large. Limit: 50MB`);
        return;
      }
      setError(null);
      setAudioFile(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_IMAGE_SIZE) {
        setError(`Image too large. Limit: 5MB`);
        return;
      }
      setError(null);
      setCoverImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => data.append(key, val));
      data.append('duration', '180'); 
      if (audioFile) data.append('audioFile', audioFile);
      if (coverImage) data.append('coverImage', coverImage);

      await axios.post('/api/songs', data);
      router.push('/admin/songs');
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed. Please check file formats.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => router.push('/admin/songs')}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm"
          >
            <div className="p-2 rounded-xl bg-white border border-slate-100 group-hover:bg-slate-50 shadow-sm">
              <ArrowLeft size={18} />
            </div>
            Back to Library
          </button>
          
          <div className="text-right">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Studio <span className="text-cyan-600">Upload</span></h1>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Release Management</p>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-4">
            <AlertCircle size={20} />
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Metadata Bento */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg"><Mic2 size={18}/></div>
                <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs">Track Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Song Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-cyan-500/5 focus:border-cyan-500 outline-none transition-all font-bold placeholder:text-slate-300"
                    placeholder="e.g. Moonlight Sonata"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Artist Name</label>
                  <input
                    name="artist"
                    value={formData.artist}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-cyan-500/5 focus:border-cyan-500 outline-none transition-all font-bold placeholder:text-slate-300"
                    placeholder="Creator Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Album</label>
                  <input
                    name="album"
                    value={formData.album}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-cyan-500/5 focus:border-cyan-500 outline-none transition-all font-bold placeholder:text-slate-300"
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Genre</label>
                  <input
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-cyan-500/5 focus:border-cyan-500 outline-none transition-all font-bold placeholder:text-slate-300"
                    placeholder="Lofi, Jazz, Hip Hop"
                  />
                </div>
              </div>
            </div>

            {/* Audio Upload Box */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-300 overflow-hidden relative group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/10 rounded-lg text-cyan-400"><Music size={18}/></div>
                  <h2 className="font-black uppercase tracking-widest text-xs">Audio Master</h2>
                </div>
                
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-10 hover:border-cyan-500/50 hover:bg-white/5 transition-all cursor-pointer group/label">
                  <input type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" />
                  {audioFile ? (
                    <div className="flex items-center gap-4 bg-cyan-500 px-6 py-3 rounded-2xl shadow-lg shadow-cyan-500/20">
                      <CheckCircle2 size={24} />
                      <div className="text-left">
                        <p className="font-bold text-sm truncate max-w-[200px]">{audioFile.name}</p>
                        <p className="text-[10px] opacity-80 uppercase font-black">Ready for Processing</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <CloudUpload size={48} className="text-slate-600 mb-4 group-hover/label:text-cyan-400 transition-colors" />
                      <p className="font-black text-lg">Drop audio here</p>
                      <p className="text-slate-500 text-xs mt-1 uppercase font-bold">WAV, MP3 up to 50MB</p>
                    </>
                  )}
                </label>
              </div>
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all" />
            </div>
          </div>

          {/* Right Column: Visuals & Submission */}
          <div className="lg:col-span-5 space-y-6">
            {/* Image Upload Box */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center">
              <div className="w-full flex items-center gap-3 mb-8">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><ImageIcon size={18}/></div>
                <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs">Cover Artwork</h2>
              </div>

              <div className="relative group w-full aspect-square max-w-[280px]">
                <label className="absolute inset-0 z-10 cursor-pointer flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] group-hover:bg-slate-100 group-hover:border-cyan-500 transition-all overflow-hidden">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  {coverImage ? (
                    <img src={URL.createObjectURL(coverImage)} className="w-full h-full object-cover animate-in fade-in duration-500" />
                  ) : (
                    <div className="text-center p-6">
                      <Disc size={40} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Select Image</p>
                    </div>
                  )}
                  {coverImage && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-bold text-sm">
                      Change Artwork
                    </div>
                  )}
                </label>
              </div>
              <p className="mt-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">High Resolution Recommended</p>
            </div>

            {/* Submit Button Area */}
            <div className="bg-cyan-600 p-2 rounded-[2.2rem] shadow-2xl shadow-cyan-200">
              <button
                type="submit"
                disabled={loading || !audioFile || !coverImage}
                className="w-full bg-white text-cyan-600 py-6 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Finalize Release
                    <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <footer className="mt-12 flex justify-between items-center px-4">
          <div className="flex gap-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            <span>Secured Connection</span>
            <span>Metadata AES-256</span>
          </div>
        </footer>
      </div>
    </div>
  );
}