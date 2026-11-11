import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#66001A] text-[#FDF0DC] text-xs py-2 px-4 tracking-wider uppercase flex items-center justify-center gap-2 font-medium border-b border-[#C59B27]/40 shadow-sm">
      <Sparkles className="w-3.5 h-3.5 text-[#F3E5BE] animate-pulse shrink-0" />
      <span className="text-center font-medium">
        Complimentary Express Shipping on Orders Above ₹2,999 | Use Code:{' '}
        <span className="bg-[#800020] text-white border border-[#C59B27] px-2 py-0.5 rounded font-bold tracking-widest text-[11px] shadow-sm mx-1">
          UTSAV10
        </span>{' '}
        for 10% Off
      </span>
      <Sparkles className="w-3.5 h-3.5 text-[#F3E5BE] animate-pulse shrink-0 hidden sm:inline-block" />
    </div>
  );
}
