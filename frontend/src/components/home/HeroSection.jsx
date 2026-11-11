import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-[#F9F6F0] py-8 sm:py-12 lg:py-16 overflow-hidden border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left space-y-6">
            
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#800020] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Heritage Handloom Couture</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-[#302820]">
              TIMELESS <br />
              <span className="font-medium italic">ETHNIC</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-700 font-normal leading-relaxed max-w-md">
              Handcrafted silk blend sarees, woven for the modern connoisseur. Every thread tells a story of heritage, reimagined for today.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/shop"
                className="bg-[#800020] hover:bg-[#66001A] text-[#E8D5BC] hover:text-white text-xs uppercase tracking-widest font-semibold px-7 py-3.5 rounded shadow-md transition duration-200 flex items-center space-x-2"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              
              <Link
                to="/shop?category=banarasi-sarees"
                className="border border-[#302820] text-[#302820] hover:bg-[#302820] hover:text-[#E8D5BC] text-xs uppercase tracking-widest font-semibold px-6 py-3.5 rounded transition duration-200"
              >
                Explore Craft
              </Link>
            </div>

            {/* Brand Heritage Badge */}
            <div className="pt-4 flex items-center space-x-3 text-xs text-gray-500 border-t border-cream-200/80">
              <span className="font-serif italic text-sm text-[#800020]">AVERA</span>
              <span>•</span>
              <span className="tracking-wide">Handwoven from the Heart of Bharat</span>
            </div>

          </div>

          {/* Right Visual Column (7 cols) */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-cream-300/80 group">
              <img
                src="/images/hero-three-sarees.jpg"
                alt="AVERA Heritage Handcrafted Sarees - Handwoven from the Heart of Bharat"
                className="w-full h-full object-cover object-center max-h-[520px] transition-transform duration-700 group-hover:scale-102"
              />
              
              {/* Subtle bottom gradient & overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-between">
                <div>
                  <p className="font-serif text-lg sm:text-xl text-white tracking-widest uppercase font-semibold">
                    AVERA
                  </p>
                  <p className="text-xs text-[#E8D5BC] tracking-wider font-light">
                    Handwoven from the Heart of Bharat
                  </p>
                </div>
                <Link
                  to="/shop"
                  className="bg-white/20 hover:bg-white text-white hover:text-[#800020] backdrop-blur-md text-[11px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded transition"
                >
                  View Lookbook
                </Link>
              </div>
            </div>

            {/* Floating Ornate Circular Seal */}
            <div className="absolute -bottom-5 -left-5 hidden sm:block w-20 h-20 rounded-full bg-[#800020] text-[#E8D5BC] p-1.5 shadow-xl border-2 border-[#E8D5BC] overflow-hidden">
              <img
                src="/images/avera-logo.jpg"
                alt="AVERA Seal"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
