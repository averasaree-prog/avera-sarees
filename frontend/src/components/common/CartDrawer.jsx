import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { cart, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeItem, subtotal, totalItems } = useCart();

  if (!isDrawerOpen) return null;

  const freeShippingGoal = 3000;
  const progress = Math.min(100, (subtotal / freeShippingGoal) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingGoal - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F9F6F0] shadow-2xl flex flex-col border-l border-cream-200">
          
          {/* Header */}
          <div className="p-5 border-b border-cream-200 bg-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#800020]" />
              <h2 className="font-serif text-xl font-semibold text-[#302820]">
                Shopping Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-full text-gray-500 hover:text-[#800020] hover:bg-cream-100 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#FAF4ED] px-5 py-3 border-b border-cream-200">
            <div className="flex justify-between text-xs font-medium text-[#302820] mb-1.5">
              <span>
                {remainingForFreeShipping === 0
                  ? '🎉 You unlocked Complimentary Express Shipping!'
                  : `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} more for Free Shipping`}
              </span>
              <span className="font-bold text-[#800020]">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#800020] transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.items && cart.items.length > 0 ? (
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-4 bg-white p-3.5 rounded-lg border border-cream-200 shadow-sm"
                >
                  <img
                    src={item.primaryImage || '/images/hero-three-sarees.jpg'}
                    alt={item.productName}
                    className="w-20 h-24 object-cover object-top rounded bg-cream-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-semibold text-[#302820] line-clamp-1">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-0.5">
                        SKU: {item.sku}
                      </p>
                      <p className="text-xs font-bold text-[#800020] mt-1">
                        ₹{item.unitPrice?.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center border border-cream-300 rounded overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:bg-cream-100 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-medium text-[#302820]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:bg-cream-100 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs font-semibold text-[#302820] ml-auto">
                        ₹{item.subtotal?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="font-serif text-lg text-[#302820] mb-1">Your bag is empty</p>
                <p className="text-xs text-gray-500 mb-5">Discover handwoven silk blend & heritage drapes</p>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/shop');
                  }}
                  className="bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded transition"
                >
                  Explore Collection
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {cart.items && cart.items.length > 0 && (
            <div className="p-5 border-t border-cream-200 bg-white space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-base text-[#302820]">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Taxes, delivery & coupon savings calculated at checkout.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full border border-[#302820] text-[#302820] hover:bg-cream-100 text-xs uppercase tracking-wider font-semibold py-3 rounded transition text-center"
                >
                  View Bag
                </button>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] text-xs uppercase tracking-wider font-semibold py-3 rounded transition flex items-center justify-center space-x-1 shadow-md"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Secure Checkout | COD & Razorpay</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
