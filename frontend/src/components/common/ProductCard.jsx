import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const primaryImage = product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = product.images?.[1]?.imageUrl || primaryImage;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id, 1, true);
    } catch (err) {
      alert(err.message || 'Could not add to bag');
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWishlist(product.id);
    } catch (err) {
      alert(err.message || 'Please log in to use wishlist');
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-lg overflow-hidden border border-cream-200/80 hover:shadow-xl hover:border-gold-300 transition-all duration-300">
      
      {/* Product Image Frame */}
      <Link to={`/product/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-cream-100 block">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discountPercentage > 0 && (
            <span className="bg-maroon-800 text-gold-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-gold-500 text-charcoal-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              Bestseller
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-800 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition z-10 ${
            isFavorited
              ? 'bg-maroon-800 text-white'
              : 'bg-white/80 text-charcoal-800 hover:bg-white hover:text-maroon-800'
          } shadow-sm`}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay on hover */}
        {product.inStock && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-white text-maroon-900 hover:bg-maroon-900 hover:text-gold-200 text-xs uppercase tracking-wider font-semibold py-2.5 px-4 rounded transition flex items-center justify-center space-x-2 shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </button>
          </div>
        )}
      </Link>

      {/* Saree Details */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* Fabric & Category */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
          <span className="uppercase tracking-wider font-medium text-maroon-800 truncate">
            {product.fabric || product.category?.name}
          </span>
          {product.averageRating && (
            <div className="flex items-center space-x-1 text-gold-600 font-semibold">
              <Star className="w-3 h-3 fill-current text-gold-500" />
              <span>{product.averageRating}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <Link to={`/product/${product.slug}`} className="block flex-1">
          <h3 className="font-serif text-base text-charcoal-900 font-medium group-hover:text-maroon-800 transition line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="mt-3 flex items-baseline space-x-2 pt-2 border-t border-cream-100">
          <span className="text-base font-bold text-maroon-900">
            ₹{product.price?.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
