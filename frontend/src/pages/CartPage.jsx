import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Tag, Check, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../api/client';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeItem, subtotal, totalItems } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const freeShippingThreshold = 3000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCharge = isFreeShipping || subtotal === 0 ? 0 : 150;
  const total = Math.max(0, subtotal - discountAmount + shippingCharge);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setCouponLoading(true);
      const res = await api.post('/api/checkout/summary', {
        couponCode: couponCode.trim(),
      });

      if (res.success && res.data) {
        if (res.data.appliedCouponCode) {
          setAppliedCoupon(res.data.appliedCouponCode);
          setDiscountAmount(res.data.discountAmount || 0);
          setCouponMessage(res.data.couponMessage || 'Coupon applied successfully!');
        } else {
          setCouponMessage(res.data.couponMessage || 'Invalid coupon code.');
        }
      }
    } catch (err) {
      setCouponMessage(err.message || 'Could not apply coupon.');
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="border-b border-[#E8D5BC] pb-4 mb-8">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#800020] font-bold">Your Bag</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#302820] font-normal mt-1">
            Shopping Bag ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
        </div>

        {cart.items && cart.items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Items Table (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Free Shipping Alert */}
              <div className="bg-white p-4 rounded-xl border border-[#E8D5BC] flex items-center justify-between text-xs">
                <span>
                  {isFreeShipping
                    ? '🎉 You have unlocked complimentary express shipping across India!'
                    : `Add ₹${(freeShippingThreshold - subtotal).toLocaleString('en-IN')} more to unlock Free Express Shipping.`}
                </span>
                <span className="font-bold text-[#800020]">
                  ₹{subtotal.toLocaleString('en-IN')} / ₹{freeShippingThreshold.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-xl border border-[#E8D5BC] overflow-hidden divide-y divide-cream-100">
                {cart.items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div className="flex items-center space-x-4">
                      <Link to={`/product/${item.productSlug}`}>
                        <img
                          src={item.primaryImage || '/images/hero-three-sarees.jpg'}
                          alt={item.productName}
                          className="w-20 h-24 sm:w-24 sm:h-28 object-cover object-top rounded-lg bg-cream-100 border border-cream-200"
                        />
                      </Link>

                      <div>
                        <Link to={`/product/${item.productSlug}`} className="hover:text-[#800020] transition">
                          <h3 className="font-serif text-base sm:text-lg font-semibold text-[#302820] leading-snug">
                            {item.productName}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">SKU: {item.sku}</p>
                        <p className="text-xs text-[#800020] font-bold mt-1">
                          ₹{item.unitPrice?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#302820] rounded bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-[#302820] hover:bg-cream-100 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-[#302820]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-[#302820] hover:bg-cream-100 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <span className="text-sm font-bold text-[#302820]">
                        ₹{item.subtotal?.toLocaleString('en-IN')}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Remove from bag"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link
                  to="/shop"
                  className="text-xs uppercase tracking-wider font-semibold text-[#800020] hover:underline"
                >
                  ← Continue Exploring Sarees
                </Link>
              </div>

            </div>

            {/* Right: Order Summary Breakdown (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Coupon Box */}
              <div className="bg-white p-5 rounded-xl border border-[#E8D5BC] space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#302820] uppercase tracking-wider">
                  <Tag className="w-4 h-4 text-[#800020]" />
                  <span>Apply Promotional Coupon</span>
                </div>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. FESTIVE15 or UTSAV10"
                    className="flex-1 uppercase bg-cream-50 border border-cream-300 rounded px-3 py-2 text-xs font-semibold text-[#302820] focus:outline-none focus:border-[#800020]"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCode}
                    className="bg-[#800020] hover:bg-[#66001A] text-[#E8D5BC] text-xs font-semibold px-4 py-2 rounded transition"
                  >
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </form>

                {couponMessage && (
                  <p className={`text-xs ${appliedCoupon ? 'text-emerald-700 font-semibold' : 'text-red-600'}`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Bill Details */}
              <div className="bg-white p-6 rounded-xl border border-[#E8D5BC] space-y-4 shadow-sm">
                <h3 className="font-serif text-lg font-semibold text-[#302820] border-b border-cream-200 pb-2">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span>Bag Subtotal</span>
                    <span className="font-semibold text-[#302820]">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Coupon Discount ({appliedCoupon})</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Express Shipping</span>
                    <span>{isFreeShipping ? <strong className="text-emerald-700 font-bold uppercase">Free</strong> : `₹${shippingCharge}`}</span>
                  </div>

                  <div className="border-t border-cream-200 pt-3 flex justify-between text-base font-bold text-[#302820]">
                    <span>Grand Total</span>
                    <span className="text-xl text-[#800020]">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#800020] hover:bg-[#66001A] text-[#E8D5BC] hover:text-white text-xs uppercase tracking-widest font-semibold py-3.5 rounded shadow-md transition duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-500 pt-2 border-t border-cream-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Razorpay Verified Gateway | COD Available</span>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-2xl border border-[#E8D5BC] p-8 max-w-lg mx-auto">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="font-serif text-2xl text-[#302820] mb-2">Your Shopping Bag is Empty</h2>
            <p className="text-xs text-gray-500 mb-6">
              Explore our handpicked silk blend, Banarasi and Kanjivaram drapes crafted by master artisans.
            </p>
            <Link
              to="/shop"
              className="bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] text-xs uppercase tracking-wider font-semibold px-8 py-3 rounded shadow transition inline-block"
            >
              Explore Collection
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
