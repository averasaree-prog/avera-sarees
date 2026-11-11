import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Feather, ArrowRight, ShieldCheck, Gem } from 'lucide-react';

export default function OurStoryPage() {
  return (
    <div className="bg-[#FAF7F2] text-[#302820] min-h-screen">
      {/* Hero Header */}
      <section className="relative py-20 sm:py-28 bg-[#F4EFE6] border-b border-[#E8D5BC] overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#800020_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-[#800020]/10 border border-[#800020]/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4 text-[#800020]" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#800020] font-bold">
              The AVERA Story
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#302820] font-normal tracking-tight leading-tight">
            Every Woman Has a Story. <br />
            <span className="italic text-[#800020]">Let Yours Shine.</span>
          </h1>

          <div className="w-24 h-0.5 bg-[#800020] mx-auto my-6" />

          <p className="font-serif text-lg sm:text-xl text-gray-700 leading-relaxed font-light italic max-w-2xl mx-auto">
            "Every woman carries a beautiful story within her. A story of dreams, strength, love, traditions, ambitions and countless little moments that make her who she is."
          </p>
        </div>
      </section>

      {/* Main Narrative Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16 sm:space-y-20">
        
        {/* Intro Section */}
        <section className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-[#E8D5BC] relative">
          <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
            <p>
              Some days, she embraces her traditional side. Some days, she chooses to be bold, modern and fearless. Sometimes, she wants to feel graceful and elegant, and sometimes, she simply wants to feel beautiful for herself.
            </p>
            <p className="font-serif text-xl sm:text-2xl text-[#800020] font-medium pt-2 italic">
              We believe every version of her deserves to shine.
            </p>
          </div>
        </section>

        {/* The Beginning of AVERA */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white aspect-[4/5]">
              <img
                src="/images/mockup.jpg"
                alt="The Beginning of AVERA"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-7 space-y-5 order-1 md:order-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#800020] font-bold flex items-center gap-2">
              <Feather className="w-4 h-4" />
              Genesis
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#302820]">
              The Beginning of AVERA
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
              <p>
                AVERA was born from a simple yet beautiful thought: <span className="font-semibold text-[#302820]">Fashion is not just about what you wear; it is about how you feel when you wear it.</span>
              </p>
              <p>
                We wanted to create a space where every woman could find something that reflects her personality, celebrates her individuality and makes her feel confident.
              </p>
              <p>
                A place where timeless Indian traditions meet the beauty of modern fashion.
              </p>
              <p className="font-serif text-lg text-[#800020] italic font-medium">
                And that is how AVERA began.
              </p>
            </div>
          </div>
        </section>

        {/* More Than Just Fashion */}
        <section className="bg-[#F4EFE6] rounded-2xl p-8 sm:p-12 border border-[#E8D5BC] space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#800020] font-bold">
              Beyond The Weave
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#302820]">
              More Than Just Fashion
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-[#E8D5BC] space-y-2">
              <h3 className="font-serif text-lg text-[#800020] font-semibold">The Saree</h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                To us, a saree is not just six yards of fabric. It carries memories, emotions, culture and generations of elegance.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-[#E8D5BC] space-y-2">
              <h3 className="font-serif text-lg text-[#800020] font-semibold">The Suit</h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                A beautifully designed suit is more than an outfit. It represents grace, comfort and confidence.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-[#E8D5BC] space-y-2">
              <h3 className="font-serif text-lg text-[#800020] font-semibold">Western Wear</h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                And a modern western outfit is not simply a fashion statement; it is a reflection of freedom, individuality and self-expression.
              </p>
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto pt-2 space-y-3">
            <p className="text-sm sm:text-base text-gray-800 font-medium">
              At AVERA, we celebrate every style, every mood and every version of a woman.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              From traditional sarees and elegant suits to contemporary western wear, we bring together fashion that allows you to express yourself without limitations.
            </p>
          </div>
        </section>

        {/* Our Philosophy */}
        <section className="space-y-6">
          <div className="border-l-4 border-[#800020] pl-6 space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#800020] font-bold">
              Guiding Beliefs
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#302820]">
              Our Philosophy
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
              <p>
                We believe that beauty has no single definition.
              </p>
              <p>
                It is not about following every trend or looking like someone else. It is about discovering your own style and feeling comfortable in your own skin.
              </p>
              <p>
                We believe that every woman deserves to feel special, whether she is dressing up for a celebration, stepping into an important moment, enjoying a casual day or simply choosing something beautiful for herself.
              </p>
              <p className="font-semibold text-[#800020]">
                Our aim is to make fashion feel personal, meaningful and accessible.
              </p>
            </div>
          </div>
        </section>

        {/* What AVERA Stands For */}
        <section className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-[#E8D5BC] space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.25em] text-[#800020] font-bold">
              Core Pillars
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#302820] mt-1 mb-6">
              What AVERA Stands For
            </h2>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
              {['Elegance', 'Individuality', 'Confidence', 'Timeless Beauty'].map((pillar) => (
                <span
                  key={pillar}
                  className="bg-[#FAF7F2] border border-[#800020]/20 text-[#800020] font-serif text-base sm:text-lg px-4 py-2 rounded-full font-medium shadow-sm"
                >
                  {pillar}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
            <p>
              Every piece we bring to you is chosen with the intention of making your wardrobe more beautiful and your everyday moments more special.
            </p>
            <p>
              We want to be a part of your celebrations, your milestones, your everyday memories and the little moments when you decide to dress up just for yourself.
            </p>
            <p className="font-serif text-lg text-[#800020] font-medium italic pt-2">
              Because you don't need a special occasion to feel special.
            </p>
          </div>
        </section>

        {/* Our Promise */}
        <section className="relative rounded-2xl bg-gradient-to-br from-[#241E18] to-[#302820] text-[#E8D5BC] p-8 sm:p-14 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#800020]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-3xl mx-auto text-center">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C59B27] font-bold">
              Commitment to You
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal">
              Our Promise
            </h2>

            <div className="w-20 h-0.5 bg-[#C59B27] mx-auto my-4" />

            <div className="space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              <p>
                AVERA is more than a clothing destination. It is a celebration of women and the many stories they carry.
              </p>
              <p>
                We are here for the woman who loves her roots but embraces the future. <br />
                For the woman who is traditional yet modern, soft yet strong, graceful yet fearless. <br />
                For the woman who is still discovering herself and for the woman who already knows exactly who she is.
              </p>
              <p className="text-white font-serif text-lg sm:text-xl italic pt-2">
                We hope that every time you wear AVERA, you don't just wear an outfit. <br />
                You wear a feeling. You express a story. You celebrate yourself.
              </p>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col items-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-gray-400">With love,</span>
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-[#E8D5BC]">
                Team AVERA
              </span>
              <p className="font-serif text-sm italic text-[#C59B27] pt-1">
                Because your story deserves to shine.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center pt-6">
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-[#800020] hover:bg-[#66001A] text-[#E8D5BC] text-xs sm:text-sm uppercase tracking-wider font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

      </div>
    </div>
  );
}

