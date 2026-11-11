import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, CheckCircle, AlertCircle, RefreshCw, Tag, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/client';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, subtotal, fetchCart } = useCart();

  const [shippingData, setShippingData] = useState({
    recipientName: user?.fullName || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: 'Delhi',
    postalCode: '',
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD'); // Default to COD
  const [couponCode, setCouponCode] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponNotice, setCouponNotice] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  useEffect(() => {
    if (user) {
      api.get('/api/user/addresses').then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setSavedAddresses(res.data);
          const defaultAddr = res.data.find((a) => a.isDefault) || res.data[0];
          setSelectedAddressId(defaultAddr.id);
        }
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    fetchCheckoutSummary();
  }, []);

  const fetchCheckoutSummary = async (codeToUse = couponCode) => {
    try {
      setLoadingSummary(true);
      const res = await api.post('/api/checkout/summary', { couponCode: codeToUse ? codeToUse.trim() : null });
      if (res.success && res.data) {
        setSummary(res.data);
        if (codeToUse) {
          if (res.data.discountAmount > 0) {
            setCouponNotice({ type: 'success', text: res.data.couponMessage || `Coupon ${res.data.appliedCouponCode} applied!` });
          } else if (res.data.couponMessage) {
            setCouponNotice({ type: 'error', text: res.data.couponMessage });
          }
        } else {
          setCouponNotice(null);
        }
      }
    } catch (err) {
      console.error('Summary error:', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const clean = couponInput.trim().toUpperCase();
    setCouponCode(clean);
    fetchCheckoutSummary(clean);
  };

  const handleRemoveCoupon = () => {
    setCouponInput('');
    setCouponCode('');
    setCouponNotice(null);
    fetchCheckoutSummary('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!selectedAddressId) {
      if (!shippingData.recipientName || !shippingData.customerEmail || !shippingData.customerPhone ||
          !shippingData.addressLine1 || !shippingData.city || !shippingData.postalCode) {
        setErrorMessage('Please complete all mandatory delivery address fields.');
        return;
      }
      if (!/^[1-9][0-9]{5}$/.test(shippingData.postalCode.trim())) {
        setErrorMessage('Please provide a valid 6-digit Indian PIN code.');
        return;
      }
    }

    try {
      setPlacingOrder(true);
      const payload = {
        customerEmail: shippingData.customerEmail,
        customerPhone: shippingData.customerPhone,
        paymentMethod: paymentMethod,
        couponCode: couponCode?.trim() ? couponCode.trim() : null,
        addressId: selectedAddressId || null,
        guestAddress: !selectedAddressId ? {
          recipientName: shippingData.recipientName,
          phone: shippingData.customerPhone,
          addressLine1: shippingData.addressLine1,
          addressLine2: shippingData.addressLine2,
          landmark: shippingData.landmark,
          city: shippingData.city,
          state: shippingData.state,
          postalCode: shippingData.postalCode,
          addressType: 'HOME',
          isDefault: false,
        } : null,
      };

      const res = await api.post('/api/orders', payload);

      if (res.success && res.data) {
        const order = res.data;

        // If Razorpay online payment
        if (paymentMethod === 'RAZORPAY') {
          const rzpKey = order.razorpayKeyId || 'rzp_test_TuBfUzNgofP5sI';
          
          if (!window.Razorpay) {
            setErrorMessage('Razorpay payment gateway failed to load. Please check your internet connection.');
            setPlacingOrder(false);
            return;
          }

          const options = {
            key: rzpKey,
            amount: Math.round(Number(order.totalAmount) * 100),
            currency: 'INR',
            name: 'AVERA Sarees',
            description: `Handloom Order #${order.orderNumber}`,
            image: '/images/avera-logo.jpg',
            order_id: order.razorpayOrderId,
            handler: async function (response) {
              try {
                setPlacingOrder(true);
                const verifyRes = await api.post('/api/payments/razorpay/verify', {
                  orderNumber: order.orderNumber,
                  razorpayOrderId: response.razorpay_order_id || order.razorpayOrderId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });
                
                if (verifyRes.success) {
                  fetchCart();
                  navigate(`/order-confirmation/${order.orderNumber}`);
                } else {
                  setErrorMessage(verifyRes.message || 'Payment verification failed.');
                }
              } catch (verifyErr) {
                console.error('Payment verification error:', verifyErr);
                setErrorMessage(verifyErr.message || 'Payment verification failed. Please contact support.');
              } finally {
                setPlacingOrder(false);
              }
            },
            prefill: {
              name: shippingData.recipientName || order.shippingRecipientName,
              email: shippingData.customerEmail || order.customerEmail,
              contact: shippingData.customerPhone || order.customerPhone,
            },
            theme: {
              color: '#800020',
            },
            modal: {
              ondismiss: function () {
                setPlacingOrder(false);
                setErrorMessage('Payment cancelled. Your order has been drafted; you can retry paying.');
              },
            },
          };

          const rzpInstance = new window.Razorpay(options);
          rzpInstance.on('payment.failed', function (failResp) {
            setPlacingOrder(false);
            setErrorMessage(`Payment failed: ${failResp.error.description || 'Transaction declined'}`);
          });
          rzpInstance.open();
          setPlacingOrder(false);
          return;
        }

        // Navigate immediately to confirmation for COD
        navigate(`/order-confirmation/${order.orderNumber}`);
        // Refresh cart in background
        fetchCart();
      } else {
        setErrorMessage(res.message || 'Failed to place order.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Could not place order. Please review your details.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="py-24 text-center bg-[#FAF7F2]">
        <p className="font-serif text-2xl text-[#302820] mb-2">Your shopping bag is empty</p>
        <Link to="/shop" className="text-xs uppercase tracking-wider font-semibold text-[#800020] underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="border-b border-[#E8D5BC] pb-4 mb-8">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#800020] font-bold">Secure Checkout</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#302820] font-normal mt-1">
            Shipping & Payment
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Shipping Details & Payment Options (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Delivery Address Section */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8D5BC] shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-semibold text-[#302820] flex items-center justify-between">
                <span>1. Delivery Address</span>
                <span className="text-xs font-sans text-gray-500 font-normal">Express Air Courier</span>
              </h2>

              {/* Saved Address Selection for Logged-in Users */}
              {savedAddresses.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-gray-700">Choose from Saved Addresses:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                          selectedAddressId === addr.id ? 'border-[#800020] bg-maroon-50/50' : 'border-cream-300 hover:border-gray-400'
                        }`}
                      >
                        <p className="font-bold text-[#302820]">{addr.recipientName}</p>
                        <p className="text-gray-600 line-clamp-2 mt-0.5">{addr.addressLine1}, {addr.city} - {addr.postalCode}</p>
                        <p className="text-gray-500 mt-1">📞 {addr.phone}</p>
                      </div>
                    ))}
                    <div
                      onClick={() => setSelectedAddressId(null)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center justify-center transition ${
                        selectedAddressId === null ? 'border-[#800020] bg-maroon-50/50 text-[#800020] font-bold' : 'border-dashed border-gray-300 text-gray-500'
                      }`}
                    >
                      + Use New Address
                    </div>
                  </div>
                </div>
              )}

              {/* Address Input Form */}
              {(!selectedAddressId || savedAddresses.length === 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingData.recipientName}
                      onChange={(e) => setShippingData({ ...shippingData, recipientName: e.target.value })}
                      placeholder="e.g. Radhika Verma"
                      className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-[#302820] focus:outline-none focus:border-[#800020]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={shippingData.customerPhone}
                      onChange={(e) => setShippingData({ ...shippingData, customerPhone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-[#302820] focus:outline-none focus:border-[#800020]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-gray-700 block mb-1">Email Address for Updates *</label>
                    <input
                      type="email"
                      required
                      value={shippingData.customerEmail}
                      onChange={(e) => setShippingData({ ...shippingData, customerEmail: e.target.value })}
                      placeholder="order-updates@example.com"
                      className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-[#302820] focus:outline-none focus:border-[#800020]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-gray-700 block mb-1">Street Address / House & Floor No. *</label>
                    <input
                      type="text"
                      required
                      value={shippingData.addressLine1}
                      onChange={(e) => setShippingData({ ...shippingData, addressLine1: e.target.value })}
                      placeholder="e.g. Flat 402, Royal Palms Apartment"
                      className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-[#302820] focus:outline-none focus:border-[#800020]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Area / Landmark</label>
                    <input
                      type="text"
                      value={shippingData.landmark}
                      onChange={(e) => setShippingData({ ...shippingData, landmark: e.target.value })}
                      placeholder="Near Lotus Temple"
                      className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-[#302820] focus:outline-none focus:border-[#800020]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      placeholder="New Delhi"
                      className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-[#302820] focus:outline-none focus:border-[#800020]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">State *</label>
                    <select
                      value={shippingData.state}
                      onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                      className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-[#302820] focus:outline-none focus:border-[#800020]"
                    >
                      {indianStates.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Indian PIN Code *</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={shippingData.postalCode}
                      onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 110001"
                      className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-[#302820] focus:outline-none focus:border-[#800020]"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Payment Method Section */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8D5BC] shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-semibold text-[#302820]">
                2. Select Payment Method
              </h2>

              <div className="space-y-3">
                {/* Razorpay Option */}
                <label className={`flex items-start p-4 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'RAZORPAY' ? 'border-[#800020] bg-maroon-50/40' : 'border-[#E8D5BC] hover:bg-cream-50'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RAZORPAY"
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                    className="mt-1 text-[#800020] focus:ring-[#800020]"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#302820] flex items-center space-x-1.5">
                        <CreditCard className="w-4 h-4 text-[#800020]" />
                        <span>Online Payment (UPI, Cards, NetBanking via Razorpay)</span>
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Instant Confirmation
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Pay securely with Google Pay, PhonePe, Paytm, Credit/Debit cards or Net Banking.
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label className={`flex items-start p-4 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'COD' ? 'border-[#800020] bg-maroon-50/40' : 'border-[#E8D5BC] hover:bg-cream-50'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 text-[#800020] focus:ring-[#800020]"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#302820] flex items-center space-x-1.5">
                        <Banknote className="w-4 h-4 text-[#800020]" />
                        <span>Cash on Delivery (COD)</span>
                      </span>
                      <span className="text-[10px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded">
                        Pay on Delivery
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Pay cash upon delivery. Available across all serviceable Indian PIN codes.
                    </p>
                  </div>
                </label>
              </div>

            </div>

          </div>

          {/* Right: Order Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-[#E8D5BC] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#302820] border-b border-cream-200 pb-2">
                Order Review ({cart.items?.length} items)
              </h3>

              {/* Items thumbnail summary */}
              <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                {cart.items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 text-xs">
                    <img
                      src={item.primaryImage || '/images/hero-three-sarees.jpg'}
                      alt={item.productName}
                      className="w-12 h-14 object-cover object-top rounded border border-cream-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-semibold text-[#302820] truncate">{item.productName}</p>
                      <p className="text-gray-500 text-[11px]">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-[#302820]">₹{item.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="border-t border-cream-200 pt-3">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Have a coupon? (Optional)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full pl-8 pr-3 py-1.5 text-xs uppercase tracking-wider border border-[#E8D5BC] rounded bg-white text-[#302820] focus:outline-none focus:ring-1 focus:ring-[#800020]"
                    />
                  </div>
                  {couponCode ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="px-3 py-1.5 text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded font-semibold transition flex items-center space-x-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 py-1.5 text-xs bg-[#800020] hover:bg-[#66001A] text-[#E8D5BC] rounded font-semibold uppercase tracking-wider transition"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {couponNotice && (
                  <p className={`text-[11px] mt-1.5 font-medium ${
                    couponNotice.type === 'success' ? 'text-emerald-700' : 'text-red-600'
                  }`}>
                    {couponNotice.text}
                  </p>
                )}
              </div>

              {/* Bill Details */}
              <div className="border-t border-cream-200 pt-3 space-y-2 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#302820]">
                    ₹{(summary?.subtotal || subtotal).toLocaleString('en-IN')}
                  </span>
                </div>

                {summary?.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Festival Coupon ({summary.appliedCouponCode})</span>
                    <span>-₹{summary.discountAmount?.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span>{summary?.isFreeShipping ? <strong className="text-emerald-700 font-bold uppercase">Free</strong> : '₹150'}</span>
                </div>

                <div className="border-t border-cream-200 pt-3 flex justify-between text-base font-bold text-[#302820]">
                  <span>Total Amount Payable</span>
                  <span className="text-2xl font-serif text-[#800020]">
                    ₹{(summary?.totalAmount || subtotal).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Primary Place Order CTA (#800020) */}
              <button
                type="submit"
                disabled={placingOrder}
                className="w-full bg-[#800020] hover:bg-[#66001A] disabled:bg-gray-400 text-[#E8D5BC] hover:text-white text-xs uppercase tracking-widest font-semibold py-4 rounded shadow-lg transition duration-200 flex items-center justify-center space-x-2"
              >
                {placingOrder ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Confirming Order...</span>
                  </>
                ) : paymentMethod === 'COD' ? (
                  <>
                    <span>Confirm Cash on Delivery Order</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    <span>Confirm Order & Pay Online</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              {paymentMethod === 'COD' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center justify-center gap-1">
                    <span>💵</span>
                    <span>Cash on Delivery Selected</span>
                  </p>
                  <p className="text-[11px] text-gray-600">
                    Pay upon delivery to our courier partner via cash or UPI. No advance payment required.
                  </p>
                </div>
              )}

              <div className="text-center pt-2 space-y-1">
                <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-Bit SSL Encrypted Indian Payment Processing</span>
                </div>
                <p className="text-[10px] text-gray-400">
                  By confirming, you agree to AVERA's terms and authentic handloom policies.
                </p>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
