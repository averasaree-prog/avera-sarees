import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import api from '../api/client';

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('number') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statuses = [
    { key: 'CONFIRMED', label: 'Order Confirmed', desc: 'Payment verified and sent to looms' },
    { key: 'PROCESSING', label: 'Handcrafted Packaging', desc: 'Quality inspection & muslin cloth wrapping' },
    { key: 'SHIPPED', label: 'Dispatched via Express Air', desc: 'Handed to premium courier' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Arriving at your doorstep today' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Package received by patron' },
  ];

  useEffect(() => {
    const num = searchParams.get('number');
    if (num) {
      setOrderNumber(num);
      trackOrder(num);
    }
  }, [searchParams]);

  const trackOrder = async (number) => {
    if (!number.trim()) return;
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/api/orders/track/${number.trim()}`);
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setError('No order found with this order number.');
      }
    } catch (err) {
      setError(err.message || 'Could not find order. Please verify your order number.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    trackOrder(orderNumber);
  };

  const getStatusStepIndex = (currentStatus) => {
    switch (currentStatus) {
      case 'PENDING':
      case 'PAYMENT_PENDING':
      case 'CONFIRMED':
        return 0;
      case 'PROCESSING':
        return 1;
      case 'SHIPPED':
        return 2;
      case 'OUT_FOR_DELIVERY':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 0;
    }
  };

  const activeStep = order ? getStatusStepIndex(order.orderStatus) : 0;

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#800020] font-bold">
            Live Shipment Tracker
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#302820] font-normal mt-1">
            Track Your Saree Shipment
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Enter your order reference number (e.g. SS-123456) sent to your email.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8D5BC] shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter Order Number (e.g. SS-543210)"
              className="flex-1 uppercase bg-cream-50 border border-cream-300 rounded px-4 py-2.5 text-xs font-semibold text-[#302820] focus:outline-none focus:border-[#800020]"
            />
            <button
              type="submit"
              disabled={loading || !orderNumber}
              className="bg-[#800020] hover:bg-[#66001A] text-[#E8D5BC] text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded shadow transition flex items-center space-x-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? 'Searching...' : 'Track'}</span>
            </button>
          </form>

          {error && (
            <p className="text-xs text-red-600 mt-3 flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </p>
          )}
        </div>

        {/* Tracking Timeline */}
        {order && (
          <div className="bg-white rounded-2xl border border-[#E8D5BC] p-6 sm:p-8 shadow-md space-y-8 animate-fade-in">
            
            {/* Header Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cream-200 gap-2">
              <div>
                <p className="text-xs text-gray-500 font-medium">Order Number</p>
                <p className="font-mono font-bold text-lg text-[#800020]">{order.orderNumber}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs text-gray-500 font-medium">Fulfillment Status</p>
                <span className="inline-block bg-[#800020] text-[#E8D5BC] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mt-0.5">
                  {order.orderStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Courier Info if Dispatched */}
            {order.courierName && (
              <div className="bg-cream-50 p-4 rounded-xl border border-cream-200 text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#302820]">Courier Partner: {order.courierName}</p>
                  <p className="text-gray-600">AWB / Airway Bill No: <strong className="font-mono text-[#800020]">{order.trackingNumber}</strong></p>
                </div>
                <Truck className="w-6 h-6 text-[#800020]" />
              </div>
            )}

            {/* Step Timeline */}
            <div className="space-y-6 pt-2">
              {statuses.map((step, idx) => {
                const isPassed = idx <= activeStep;
                const isCurrent = idx === activeStep;

                return (
                  <div key={step.key} className="flex items-start space-x-4 relative">
                    {/* Connecting line */}
                    {idx < statuses.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 -bottom-6 w-0.5 transition-colors ${
                          idx < activeStep ? 'bg-[#800020]' : 'bg-gray-200'
                        }`}
                      />
                    )}

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition flex-shrink-0 z-10 ${
                        isCurrent
                          ? 'bg-[#800020] text-white ring-4 ring-maroon-100 shadow-md'
                          : isPassed
                          ? 'bg-[#800020] text-[#E8D5BC]'
                          : 'bg-gray-100 text-gray-400 border border-gray-300'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-semibold ${isPassed ? 'text-[#302820]' : 'text-gray-400'}`}>
                        {step.label}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Destination Address */}
            <div className="border-t border-cream-200 pt-4 text-xs text-gray-600 flex justify-between">
              <div>
                <p className="font-bold text-[#302820]">Destination:</p>
                <p>{order.shippingRecipientName}, {order.shippingCity} ({order.shippingPostalCode})</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#302820]">Total Amount:</p>
                <p className="text-[#800020] font-bold text-sm">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
