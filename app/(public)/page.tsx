"use client";

import React, { useState } from "react";
import { Play, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const FOR_YOU = [
  { id: 1, title: "Coffee", sub: "Morning Brew", src: "/images/image2.webp" },
  { id: 2, title: "Beats", sub: "Focus Beats", src: "/images/image3.webp" },
  { id: 3, title: "Nature", sub: "Indie Gems", src: "/images/image4.webp" },
  { id: 4, title: "Chill", sub: "Chill Vibes", src: "/images/image5.jpg" },
];

const TOP_ARTISTS = [
  { id: 1, name: "Jax Bloom", sub: "Artist", src: "/images/singer1.webp" },
  { id: 2, name: "Sonu Nigam", sub: "Artist", src: "/images/singer2.webp" },
  { id: 3, name: "The Weeknd", sub: "Artist", src: "/images/singer3.webp" },
  { id: 4, name: "Lofi Girl", sub: "Artist", src: "/images/singer4.webp" },
];

export default function RootLandingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const handlePlayAction = (title: string) => {
    if (!isLoggedIn) {
      alert(`To play "${title}", please log in first.`);
      router.push("/login");
    } else {
      console.log("Playing:", title);
    }
  };

  return (
    <div className="py-6 space-y-12 pb-20">
      <section className="relative h-72 rounded-3xl overflow-hidden bg-gradient-to-r from-[#9d7cfd] to-[#b5a1f4] p-10 text-white flex flex-col justify-center shadow-lg">
        <div className="relative z-10">
          <p className="text-sm font-medium opacity-80 mb-2 flex items-center gap-2">
             <Sparkles size={16} /> Featured Album: Synthwave Dreams
          </p>
          <h1 className="text-5xl font-bold max-w-xl leading-tight mb-6">Discover Your Next Obsession</h1>
          <button 
            onClick={() => handlePlayAction("Featured Album")}
            className="bg-white text-[#8b5cf6] px-8 py-3 rounded-full font-bold text-sm shadow-sm hover:scale-105 transition-transform"
          >
            Start Listening
          </button>
        </div>
        <span className="absolute right-[-20px] bottom-[-20px] text-[180px] font-bold opacity-10 select-none pointer-events-none">Lofix</span>
      </section>


      <MusicRow title="For You" subtitle="Based on your recent activity" items={FOR_YOU} onPlay={handlePlayAction} />


      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Top Artists</h2>
            <p className="text-sm text-gray-400">Your favorite creators</p>
          </div>
          <button className="text-sm font-bold text-[#8b5cf6] hover:underline">View All</button>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar">
          {TOP_ARTISTS.map((artist) => (
            <div key={artist.id} className="min-w-[160px] text-center group cursor-pointer">
              <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all">
                <img src={artist.src} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="bg-white p-3 rounded-full text-[#8b5cf6] shadow-xl"><Play size={20} fill="currentColor" /></div>
                </div>
              </div>
              <h3 className="font-bold text-gray-900">{artist.name}</h3>
              <p className="text-xs text-gray-400 font-medium tracking-tight">{artist.sub}</p>
            </div>
          ))}
        </div>
      </section>


      <MusicRow title="Trending Now" subtitle="Most played this week" items={[...FOR_YOU].reverse()} onPlay={handlePlayAction} />
    </div>
  );
}


function MusicRow({ title, subtitle, items, onPlay }: any) {
  return (
    <section>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        <button className="text-sm font-bold text-[#8b5cf6] hover:underline">View All</button>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
        {items.map((item: any) => (
          <div key={item.id} className="min-w-[200px] group">
            <div 
              onClick={() => onPlay(item.title)}
              className="relative h-48 rounded-2xl mb-4 overflow-hidden cursor-pointer shadow-sm group-hover:shadow-xl transition-all duration-300 bg-gray-100"
            >
              <img src={item.src} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white p-3 rounded-full text-[#8b5cf6] shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <Play size={24} fill="currentColor" />
                </div>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 leading-tight mb-0.5">{item.sub}</h3>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Playlist • Lofix</p>
          </div>
        ))}
      </div>
    </section>
  );
}