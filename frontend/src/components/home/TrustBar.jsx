import React from 'react';
import { Truck, HandHeart, ShieldCheck } from 'lucide-react';

export default function TrustBar() {
  return (
    <div className="bg-[#800020] text-[#E8D5BC] py-4 border-t border-b border-[#302820]/30 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          
          <div className="flex items-center justify-center space-x-2.5">
            <Truck className="w-5 h-5 text-white/90" />
            <span className="text-xs sm:text-sm font-medium tracking-wide">
              Free Shipping on orders above ₹3,000
            </span>
          </div>

          <div className="flex items-center justify-center space-x-2.5 border-y md:border-y-0 md:border-x border-white/10 py-2 md:py-0">
            <HandHeart className="w-5 h-5 text-white/90" />
            <span className="text-xs sm:text-sm font-medium tracking-wide">
              Handcrafted by Artisans
            </span>
          </div>

          <div className="flex items-center justify-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-white/90" />
            <span className="text-xs sm:text-sm font-medium tracking-wide">
              Ethical & Sustainable
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
