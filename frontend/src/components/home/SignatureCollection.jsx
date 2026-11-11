import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function SignatureCollection() {
  const { addToCart } = useCart();

  const signatureSarees = [
    {
      id: 101,
      name: "Noor Maroon Embroidered Saree",
      slug: "noor-maroon-embroidered-saree",
      sku: "AV-SLK-001",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      discount: "30% OFF",
      tag: "SALE",
      originalPrice: 7499,
      price: 5249,
      savings: 2250,
      fabric: "Silk Blend",
    },
    {
      id: 102,
      name: "Raavi Mustard Silk Blend Saree",
      slug: "raavi-mustard-silk-blend-saree",
      sku: "AV-SLK-002",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      discount: "25% OFF",
      tag: "LIMITED OFFER",
      originalPrice: 7999,
      price: 5999,
      savings: 2000,
      fabric: "Silk Blend",
    },
    {
      id: 103,
      name: "Tealari Teal Embroidered Saree",
      slug: "tealari-teal-embroidered-saree",
      sku: "AV-SLK-003",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      discount: "20% OFF",
      tag: "SALE",
      originalPrice: 8299,
      price: 6639,
      savings: 1660,
      fabric: "Silk Blend",
    },
  ];

  const handleAdd = (e, item) => {
    e.preventDefault();
    addToCart(item.id, 1, true);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#F9F6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Ornate Divider Motif */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          
          <div className="flex items-center justify-center space-x-2 text-[#C59B27] mb-2">
            <span className="h-px w-10 bg-[#C59B27]/40" />
            <span className="text-sm">✦ ❖ ✦</span>
            <span className="h-px w-10 bg-[#C59B27]/40" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-4xl text-[#302820] font-normal tracking-tight">
            Signature Silk Blend Collection
          </h2>
          
          <p className="mt-2 text-xs sm:text-sm text-gray-600 font-light tracking-wide">
            Curated embroidered sarees — where tradition meets contemporary design
          </p>
        </div>

        {/* 3 Featured Product Cards matching Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {signatureSarees.map((saree) => (
            <div
              key={saree.id}
              className="group relative bg-[#FFFDF9] rounded-xl overflow-hidden border border-[#E8D5BC] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              
              {/* Image Frame with Ribbon */}
              <div className="relative aspect-[4/3] bg-cream-100 overflow-hidden flex items-center justify-center p-4">
                
                {/* Diagonal Discount Ribbon */}
                <div className="absolute top-3 left-3 bg-[#EAA222] text-[#302820] text-[10px] font-extrabold px-2.5 py-1 rounded shadow-sm z-10">
                  {saree.discount}
                </div>

                {/* Right Badge (SALE / LIMITED OFFER) */}
                <div className="absolute top-3 right-3 bg-[#F4E3C7] text-[#800020] text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border border-[#E8D5BC] z-10">
                  {saree.tag}
                </div>

                {/* Saree Photo */}
                <img
                  src={saree.image}
                  alt={saree.name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Body Details */}
              <div className="p-5 flex flex-col flex-1 text-center">
                
                <h3 className="font-serif text-base sm:text-lg font-medium text-[#302820] group-hover:text-[#800020] transition line-clamp-1">
                  {saree.name}
                </h3>

                {/* Price */}
                <div className="mt-2 flex items-center justify-center space-x-2">
                  <span className="text-xs text-gray-400 line-through">
                    ₹{saree.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-lg font-bold text-[#302820]">
                    ₹{saree.price.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Add to Cart Button (Exact Mockup Button Styling) */}
                <button
                  onClick={(e) => handleAdd(e, saree)}
                  className="mt-4 w-full bg-[#EAA222] hover:bg-[#D4A346] text-[#302820] hover:text-black font-semibold text-xs tracking-wider uppercase py-2.5 px-4 rounded shadow-sm transition duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>

                {/* Savings Pill */}
                <p className="mt-2 text-[11px] text-gray-500 font-medium">
                  You save <strong className="text-emerald-700 font-bold">₹{saree.savings.toLocaleString('en-IN')}</strong>
                </p>

              </div>

            </div>
          ))}
        </div>

        {/* View All Collection Link */}
        <div className="mt-12 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 border-b border-[#800020] pb-1 text-xs uppercase tracking-widest font-semibold text-[#800020] hover:text-[#66001A] transition"
          >
            <span>Explore All 100+ Heritage Sarees</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
