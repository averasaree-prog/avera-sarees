import React, { useState } from 'react';
import { Megaphone, Check, Copy } from 'lucide-react';

export default function FestivalBanner({ onApplyCoupon }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText('FESTIVE15');
    setCopied(true);
    if (onApplyCoupon) onApplyCoupon('FESTIVE15');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative overflow-hidden bg-festival-gradient text-white border-y border-[#302820]/40 shadow-md">
      
      {/* Traditional Indian Ethnic Jaali Pattern Border at Top */}
      <div className="h-1.5 w-full bg-repeat-x opacity-40" style={{
        backgroundImage: 'radial-gradient(circle, #E8D5BC 1px, transparent 1px)',
        backgroundSize: '8px 8px'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        
        {/* Left: Offer Callout */}
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-white/10 rounded-full text-[#E8D5BC]">
            <Megaphone className="w-4 h-4 animate-bounce" />
          </span>
          <span className="font-serif text-base sm:text-lg font-bold tracking-wider uppercase text-white drop-shadow-sm">
            FESTIVAL OFFER — EXTRA 15% OFF
          </span>
        </div>

        {/* Center: Voucher Coupon Badge */}
        <div className="flex items-center bg-white/95 text-[#302820] rounded-md px-3 py-1 shadow-inner border border-dashed border-[#800020]/40">
          <span className="text-xs uppercase tracking-wider font-medium mr-2">
            Coupon Code: <strong className="font-bold text-[#800020]">FESTIVE15</strong>
          </span>
          <button
            onClick={handleCopy}
            className="bg-[#800020] hover:bg-[#66001A] text-[#E8D5BC] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded transition flex items-center space-x-1"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <span>Apply</span>
            )}
          </button>
        </div>

        {/* Right: Subtext */}
        <div className="text-[11px] tracking-wide text-[#E8D5BC] font-medium">
          Use code at checkout • Valid until 31st Oct • Limited time only
        </div>

      </div>

      {/* Traditional Jaali Pattern Border at Bottom */}
      <div className="h-1.5 w-full bg-repeat-x opacity-40" style={{
        backgroundImage: 'radial-gradient(circle, #E8D5BC 1px, transparent 1px)',
        backgroundSize: '8px 8px'
      }} />

    </div>
  );
}
