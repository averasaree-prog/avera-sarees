import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Truck, ShieldCheck, RefreshCw, Scissors, Sparkles, Check, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';
import api from '../api/client';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delivery pincode state
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [checkingPin, setCheckingPin] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, customerName: '', title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Related products
  const [related, setRelated] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    api.get(`/api/products/${slug}`)
      .then((res) => {
        if (res.success && res.data) {
          setProduct(res.data);
          setSelectedImage(0);

          // Fetch reviews and related sarees
          api.get(`/api/reviews/product/${res.data.id}`)
            .then((r) => r.success && setReviews(r.data || []))
            .catch(() => {});

          api.get(`/api/products/${res.data.id}/related`)
            .then((rel) => rel.success && setRelated(rel.data || []))
            .catch(() => {});
        } else {
          setError('Product not found.');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load saree details.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCheckPincode = async (e) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.length !== 6) return;
    try {
      setCheckingPin(true);
      const res = await api.get(`/api/shipping/pincode/${pincode.trim()}`);
      if (res.success && res.data) {
        setPincodeResult(res.data);
      }
    } catch (err) {
      setPincodeResult({ serviceable: false, message: 'Could not verify PIN code. Please try again.' });
    } finally {
      setCheckingPin(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, quantity, true);
    } catch (err) {
      alert(err.message || 'Could not add to bag.');
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, quantity, false);
      navigate('/checkout');
    } catch (err) {
      alert(err.message || 'Could not proceed to checkout.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim() || !newReview.customerName.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await api.post('/api/reviews', {
        productId: product.id,
        customerName: newReview.customerName,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
      });

      if (res.success && res.data) {
        setReviews([res.data, ...reviews]);
        setShowReviewModal(false);
        setReviewSuccess(true);
        setTimeout(() => setReviewSuccess(false), 4000);
      }
    } catch (err) {
      alert(err.message || 'Could not submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center bg-[#FAF7F2]">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#800020] mb-3" />
        <p className="font-serif text-lg text-[#302820]">Unfolding saree details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-24 text-center bg-[#FAF7F2]">
        <p className="font-serif text-2xl text-[#302820] mb-2">{error || 'Saree not found'}</p>
        <Link to="/shop" className="text-xs uppercase tracking-wider font-semibold text-[#800020] underline">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images.map((img) => img.imageUrl)
    : ['/images/hero-three-sarees.jpg'];

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-6 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#800020]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-[#800020]">Sarees</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link to={`/shop?category=${product.category.slug}`} className="hover:text-[#800020]">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#302820] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails (Vertical on sm) */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[560px] pb-2 sm:pb-0">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition flex-shrink-0 bg-cream-100 ${
                    selectedImage === idx ? 'border-[#800020] shadow-md' : 'border-[#E8D5BC] hover:border-gray-400'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-white border border-[#E8D5BC] shadow-lg aspect-[3/4] max-h-[640px]">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover object-top transition duration-500 hover:scale-105"
              />

              {product.discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-[#800020] text-[#E8D5BC] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow-md">
                  {product.discountPercentage}% OFF
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition shadow-md ${
                  isFavorited ? 'bg-[#800020] text-white' : 'bg-white/80 text-[#302820] hover:bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

          </div>

          {/* Right Column: Saree Specs & Purchasing (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#800020] font-bold">
                {product.fabric} • {product.weave || 'Handloom'}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#302820] font-normal leading-snug mt-1">
                {product.name}
              </h1>
              <p className="text-xs text-gray-500 mt-1">SKU: <strong className="text-gray-700">{product.sku}</strong></p>

              {/* Rating Summary */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex text-[#C59B27]">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.averageRating || 5) ? 'fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#302820]">{product.averageRating || 4.8}</span>
                <span className="text-xs text-gray-500">({reviews.length} authentic reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-white rounded-xl border border-[#E8D5BC] flex items-baseline space-x-3">
              <span className="text-3xl font-serif font-bold text-[#800020]">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.originalPrice?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
              <span className="text-[11px] text-gray-500 block w-full mt-1">
                Inclusive of all taxes. Free express shipping applies on this order.
              </span>
            </div>

            {/* Quantity Selector & Action Buttons (#800020) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-[#302820] rounded bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-xs text-[#302820] hover:bg-cream-100 transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-[#302820]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-xs text-[#302820] hover:bg-cream-100 transition"
                  >
                    +
                  </button>
                </div>
                <span className={`text-xs font-medium ${product.inStock ? 'text-emerald-700' : 'text-red-600'}`}>
                  {product.inStock ? `● In Stock (${product.stockQuantity} remaining)` : '● Currently Out of Stock'}
                </span>
              </div>

              {/* Primary Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full bg-[#800020] hover:bg-[#66001A] disabled:bg-gray-400 text-[#E8D5BC] hover:text-white text-xs uppercase tracking-widest font-semibold py-3.5 rounded shadow-md transition duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="w-full border-2 border-[#302820] hover:bg-[#302820] text-[#302820] hover:text-[#E8D5BC] disabled:border-gray-300 disabled:text-gray-400 text-xs uppercase tracking-widest font-semibold py-3.5 rounded transition duration-200 text-center"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Delivery PIN Code Checker */}
            <div className="p-4 bg-white rounded-xl border border-[#E8D5BC] space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#302820] uppercase tracking-wider">
                <Truck className="w-4 h-4 text-[#800020]" />
                <span>Check Delivery & COD Availability</span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Indian PIN code"
                  className="flex-1 bg-cream-50 border border-cream-300 rounded px-3 py-2 text-xs text-[#302820] focus:outline-none focus:border-[#800020]"
                />
                <button
                  type="submit"
                  disabled={checkingPin || pincode.length !== 6}
                  className="bg-[#302820] hover:bg-black text-[#E8D5BC] text-xs font-semibold px-4 py-2 rounded transition"
                >
                  {checkingPin ? 'Checking...' : 'Check'}
                </button>
              </form>

              {pincodeResult && (
                <div className={`p-2.5 rounded text-xs ${pincodeResult.serviceable ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {pincodeResult.serviceable ? (
                    <div className="space-y-0.5">
                      <p className="font-semibold">✓ Serviceable at PIN {pincodeResult.pincode}</p>
                      <p className="text-[11px]">{pincodeResult.message}</p>
                    </div>
                  ) : (
                    <p>{pincodeResult.message}</p>
                  )}
                </div>
              )}
            </div>

            {/* Textile Specification Details */}
            <div className="border-t border-[#E8D5BC] pt-4 space-y-2 text-xs text-[#302820]">
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#302820] mb-2">
                Saree Dimensions & Specifications
              </h4>
              <div className="grid grid-cols-2 gap-2 text-gray-700">
                <p><strong>Fabric:</strong> {product.fabric}</p>
                <p><strong>Weave:</strong> {product.weave || 'Traditional Loom'}</p>
                <p><strong>Saree Length:</strong> {product.sareeLengthMeters || '5.50'} meters</p>
                <p><strong>Blouse Piece:</strong> {product.blousePieceDetails || '0.80m Unstitched'}</p>
                <p><strong>Occasion:</strong> {product.occasion}</p>
                <p><strong>Color:</strong> {product.color}</p>
              </div>
              <p className="text-[11px] text-gray-500 pt-1">
                <strong>Care:</strong> {product.careInstructions || 'Dry clean exclusively to preserve zari sheen.'}
              </p>
            </div>

          </div>

        </div>

        {/* Customer Reviews Section */}
        <section className="mt-20 pt-12 border-t border-[#E8D5BC]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#800020] font-bold">Patron Experiences</span>
              <h2 className="font-serif text-3xl text-[#302820] font-normal mt-1">Customer Reviews ({reviews.length})</h2>
            </div>
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-[#800020] hover:bg-[#66001A] text-[#E8D5BC] text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded shadow transition"
            >
              Write a Review
            </button>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-5 rounded-xl border border-[#E8D5BC] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#C59B27]">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                        ✓ Verified Patron
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif text-base font-semibold text-[#302820]">{rev.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed italic">"{rev.comment}"</p>
                  <p className="text-[11px] text-gray-400 pt-1">— {rev.customerName}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">No reviews yet for this saree. Be the first patron to share your experience!</p>
          )}
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#E8D5BC]">
            <h2 className="font-serif text-2xl text-[#302820] font-normal mb-8">You May Also Admire</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E8D5BC] p-6 space-y-4">
            <h3 className="font-serif text-xl font-semibold text-[#302820]">Review This Saree</h3>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Rating</label>
                <div className="flex space-x-1 text-[#C59B27]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1"
                    >
                      <Star className={`w-6 h-6 ${star <= newReview.rating ? 'fill-current' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={newReview.customerName}
                  onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Headline</label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="e.g. Magnificent silk sheen!"
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Review</label>
                <textarea
                  required
                  rows={3}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share details on drape, zari quality and packaging..."
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-[#302820]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] text-xs font-semibold px-5 py-2 rounded shadow transition"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
