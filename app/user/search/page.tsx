"use client";

import React, { useState, useEffect } from "react";
import { Search as SearchIcon, ChevronRight, Play } from "lucide-react";

// Reusing your static data so the search looks populated
const STATIC_ALBUMS = [
  { id: 1, title: "Coffee", sub: "Morning Brew", src: "/images/image2.webp" },
  { id: 2, title: "Beats", sub: "Focus Beats", src: "/images/image3.webp" },
  { id: 3, title: "Nature", sub: "Indie Gems", src: "/images/image4.webp" },
  { id: 4, title: "Chill", sub: "Chill Vibes", src: "/images/image5.jpg" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // Fetching from your actual backend
        const res = await fetch(`http://localhost:5000/api/auth/search?q=${query}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data.songs);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="py-6 space-y-10">
      {/* Search Bar - Styled like your Dashboard Header */}
      <div className="relative max-w-2xl">
        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs, artists, or albums..."
          className="w-full bg-white border border-gray-100 py-4 pl-14 pr-6 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-purple-100 transition-all"
        />
      </div>

      {query.length >= 2 ? (
        <section>
          <h2 className="text-2xl font-bold mb-6">Search Results</h2>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {results.map((song: any) => (
                <AlbumCard key={song._id} title={song.title} sub={song.album} src={song.coverImage} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No real songs found in database yet...</p>
          )}
        </section>
      ) : (
        <>
          {/* Default Content when not searching */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Recent Searches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Synthwave Dreams", "Lofi Girl", "Chill Study Beats"].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl hover:bg-gray-50 cursor-pointer transition">
                  <span className="font-semibold text-gray-700">{item}</span>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {STATIC_ALBUMS.map((album) => (
                <AlbumCard key={album.id} title={album.title} sub={album.sub} src={album.src} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

// Reusable Card Component to match your Dashboard style
function AlbumCard({ title, sub, src }: any) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-square rounded-2xl mb-4 overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300">
        <img src={src} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white p-3 rounded-full text-[#8b5cf6] shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Play size={20} fill="currentColor" />
          </div>
        </div>
      </div>
      <h3 className="font-bold text-gray-900 leading-tight truncate">{title}</h3>
      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{sub}</p>
    </div>
  );
}