import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, Truck, ArrowRight, Printer, Sparkles } from 'lucide-react';
import api from '../api/client';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/api/orders/track/${orderNumber}`)
      .then((res) => {
        if (res.success && res.data) {
          setOrder(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Celebration Header */}
        <div className="bg-white rounded-2xl border border-[#E8D5BC] p-8 text-center shadow-lg space-y-4">
          
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-100 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#800020] font-bold">
              Order Confirmed
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#302820] font-normal">
              Dhanyawaad for Shopping with AVERA
            </h1>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Your heirloom saree order has been received and our master curators are preparing your drape with artisanal care.
            </p>
          </div>

          {/* Order Reference Box */}
          <div className="bg-[#FAF4ED] p-4 rounded-xl border border-[#E8D5BC] inline-block max-w-md w-full text-left space-y-2">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-[#E8D5BC]/60">
              <span className="text-gray-500 font-medium">Order Reference:</span>
              <span className="font-mono font-bold text-[#800020] text-sm">{orderNumber}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-2 border-b border-[#E8D5BC]/60">
              <span className="text-gray-500 font-medium">Payment Mode:</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider ${
                order?.paymentMethod === 'COD' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {order?.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Online Payment (Razorpay)'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Amount Due:</span>
              <span className="font-bold text-[#800020] text-sm">
                ₹{order?.totalAmount?.toLocaleString('en-IN') || '0'} {order?.paymentMethod === 'COD' ? '(Pay upon Delivery)' : '(Paid)'}
              </span>
            </div>
          </div>

          {/* Order Items Snapshot */}
          {order && (
            <div className="border-t border-cream-200 pt-6 text-left space-y-3">
              <h3 className="font-serif text-base font-semibold text-[#302820]">
                Ordered Sarees Snapshot
              </h3>
              <div className="divide-y divide-cream-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.imageUrl || '/images/hero-three-sarees.jpg'}
                        alt={item.productName}
                        className="w-12 h-14 object-cover object-top rounded border border-cream-200"
                      />
                      <div>
                        <p className="font-semibold text-[#302820]">{item.productName}</p>
                        <p className="text-[11px] text-gray-500">Qty: {item.quantity} | SKU: {item.sku}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#302820]">₹{item.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="border-t border-cream-200 pt-3 text-xs space-y-1 text-right">
                <p className="text-gray-600">Subtotal: ₹{order.subtotal?.toLocaleString('en-IN')}</p>
                {order.discountAmount > 0 && (
                  <p className="text-emerald-700 font-semibold">Discount: -₹{order.discountAmount?.toLocaleString('en-IN')}</p>
                )}
                <p className="text-base font-bold text-[#800020] pt-1">
                  Total Amount: ₹{order.totalAmount?.toLocaleString('en-IN')}
                </p>
              </div>

              {/* Delivery Address */}
              <div className="bg-cream-50 p-4 rounded-xl border border-cream-200 text-xs text-gray-700 mt-4">
                <p className="font-bold text-[#302820] uppercase tracking-wider mb-1">Delivering To:</p>
                <p className="font-semibold">{order.shippingRecipientName}</p>
                <p>{order.shippingAddressLine1}, {order.shippingCity}, {order.shippingState} - {order.shippingPostalCode}</p>
                <p className="text-gray-500 mt-1">Updates sent to: {order.customerEmail} | {order.customerPhone}</p>
              </div>

            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/order-tracking?number=${orderNumber}`}
              className="w-full sm:w-auto bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded shadow transition flex items-center justify-center space-x-1"
            >
              <Truck className="w-4 h-4 mr-1.5" />
              <span>Track Shipment Live</span>
            </Link>

            <Link
              to="/shop"
              className="w-full sm:w-auto border border-[#302820] text-[#302820] hover:bg-cream-100 text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded transition text-center"
            >
              Continue Shopping
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
