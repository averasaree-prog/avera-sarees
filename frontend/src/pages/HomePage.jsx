import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Star, Award, Scissors, Compass } from 'lucide-react';
import FestivalBanner from '../components/home/FestivalBanner';
import HeroSection from '../components/home/HeroSection';
import SignatureCollection from '../components/home/SignatureCollection';
import TrustBar from '../components/home/TrustBar';
import ProductCard from '../components/common/ProductCard';
import api from '../api/client';

export default function HomePage() {
  const [featuredSarees, setFeaturedSarees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/products/featured').catch(() => ({ success: false })),
      api.get('/api/categories').catch(() => ({ success: false })),
    ]).then(([prodRes, catRes]) => {
      if (prodRes.success && prodRes.data) {
        setFeaturedSarees(prodRes.data);
      }
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Festive Promo Strip (Matching Mockup) */}
      <FestivalBanner />

      {/* 2. Hero Section (Matching Mockup with AVERA imagery and "TIMELESS ETHNIC") */}
      <HeroSection />

      {/* 3. Signature Silk Blend Collection (Matching Mockup with 3 specific sarees) */}
      <SignatureCollection />

      {/* 4. Trust Guarantee Strip (Matching Mockup bottom bar) */}
      <TrustBar />

      {/* 5. Explore by Weave & Fabric Categories */}
      <section className="py-16 bg-[#FAF7F2] border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#800020] font-bold">
              Heritage Weaving Regions
            </span>
            <h2 className="font-serif text-3xl text-[#302820] font-normal mt-1">
              Curated by Weave & Region
            </h2>
            <p className="text-xs text-gray-500 font-light mt-1">
              Explore authentic weaves originating from master artisanal clusters across India.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="group relative rounded-xl overflow-hidden aspect-[3/4] shadow-sm hover:shadow-xl transition-all border border-[#E8D5BC]"
              >
                <img
                  src={cat.imageUrl || '/images/hero-three-sarees.jpg'}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-center">
                  <h3 className="font-serif text-lg text-white font-medium group-hover:text-[#E8D5BC] transition">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] tracking-widest uppercase text-[#E8D5BC] font-semibold mt-1 opacity-90 group-hover:opacity-100 flex items-center justify-center space-x-1">
                    <span>View Weaves</span>
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Handloom Heritage & Brand Story */}
      <section className="py-16 sm:py-20 bg-[#F4EFE6] border-b border-[#E8D5BC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="/images/mockup.jpg"
                  alt="AVERA Brand Essence"
                  className="w-full h-auto object-cover max-h-[460px]"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs uppercase tracking-[0.25em] text-[#800020] font-bold">
                The AVERA Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#302820] font-normal leading-tight">
                Every Woman Has a Story. <br />
                <span className="italic text-[#800020]">Let Yours Shine.</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                Every woman carries a beautiful story within her — of dreams, strength, love, traditions, ambitions and countless little moments. Some days, she embraces her traditional side; some days, she chooses to be bold, modern and fearless. We believe every version of her deserves to shine.
              </p>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                To us, a saree is not just six yards of fabric; it carries memories, emotions, and generations of elegance. From traditional weaves to contemporary fashion, AVERA creates a space where timeless Indian traditions meet modern self-expression.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-cream-300">
                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-[#800020] mt-0.5" />
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-[#302820]">100% Certified</h4>
                    <p className="text-[11px] text-gray-600">Pure silk & zari authentication</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Scissors className="w-5 h-5 text-[#800020] mt-0.5" />
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-[#302820]">Bespoke Blouse</h4>
                    <p className="text-[11px] text-gray-600">Matching unstitched piece included</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/our-story"
                  className="inline-flex items-center space-x-2 bg-[#800020] hover:bg-[#66001A] text-[#E8D5BC] text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded shadow transition"
                >
                  <span>Read Our Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center space-x-2 border border-[#800020] text-[#800020] hover:bg-[#800020]/10 text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded transition"
                >
                  <span>Explore Masterpieces</span>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 7. New Arrivals Catalog Showcase */}
      {featuredSarees.length > 0 && (
        <section className="py-16 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#800020] font-bold">
                  Just Off The Loom
                </span>
                <h2 className="font-serif text-3xl text-[#302820] font-normal mt-1">
                  New Handloom Arrivals
                </h2>
              </div>
              <Link
                to="/shop"
                className="mt-3 sm:mt-0 text-xs uppercase tracking-widest font-semibold text-[#800020] hover:text-[#66001A] flex items-center space-x-1 border-b border-[#800020] pb-0.5"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {featuredSarees.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
