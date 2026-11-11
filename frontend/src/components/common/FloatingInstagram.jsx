import React, { useState } from 'react';
import { Instagram } from 'lucide-react';

const INSTAGRAM_URL = 'https://www.instagram.com/avera.premiumethnic?mdxt=MTBhd3UyeDlwMXM3aQ==';

export default function FloatingInstagram() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      aria-label="Social Links"
      className="fixed bottom-6 right-6 z-40 flex items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Expanding Label on Hover */}
      <div
        className={`hidden sm:flex items-center bg-[#241E18] text-[#E8D5BC] border border-[#C59B27]/40 text-xs px-3 py-1.5 rounded-l-full shadow-xl transition-all duration-300 transform origin-right ${
          isHovered ? 'opacity-100 translate-x-1 mr-1' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        <span className="font-serif tracking-wider font-medium text-[11px] whitespace-nowrap">
          Follow <span className="text-[#C59B27] font-semibold">@avera.premiumethnic</span>
        </span>
      </div>

      {/* Floating Instagram Button */}
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow AVERA on Instagram"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full p-[2.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C59B27] focus:ring-offset-2 focus:ring-offset-[#FAF7F2]"
      >
        {/* Pulsing subtle glow ring */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] opacity-35 blur-sm group-hover:opacity-65 transition duration-500 animate-pulse" />

        {/* Inner Circle */}
        <div className="relative w-full h-full bg-[#241E18] rounded-full flex items-center justify-center transition-colors duration-300 group-hover:bg-[#1a1510]">
          <Instagram className="w-5 h-5 text-white group-hover:text-[#E8D5BC] transition-transform duration-300 group-hover:rotate-6" />
        </div>
      </a>
    </aside>
  );
}
