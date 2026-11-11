import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, Heart, MapPin, LogOut, Plus, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/common/ProductCard';
import api from '../api/client';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'addresses', 'wishlist'
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [newAddr, setNewAddr] = useState({
    recipientName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: 'Delhi',
    postalCode: '',
    isDefault: false,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    api.get('/api/orders/my-orders')
      .then((res) => {
        if (res.success && res.data) setOrders(res.data);
      })
      .catch(() => {})
      .finally(() => setLoadingOrders(false));

    api.get('/api/user/addresses')
      .then((res) => {
        if (res.success && res.data) setAddresses(res.data);
      })
      .catch(() => {});
  }, [user, navigate]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/user/addresses', newAddr);
      if (res.success && res.data) {
        setAddresses([res.data, ...addresses]);
        setShowAddressModal(false);
        setNewAddr({
          recipientName: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          landmark: '',
          city: '',
          state: 'Delhi',
          postalCode: '',
          isDefault: false,
        });
      }
    } catch (err) {
      alert(err.message || 'Could not save address.');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/api/user/addresses/${id}`);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message || 'Could not remove address.');
    }
  };

  if (!user) return null;

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Banner */}
        <div className="bg-white rounded-2xl border border-[#E8D5BC] p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-[#800020] text-[#E8D5BC] flex items-center justify-center font-serif text-2xl font-bold border-2 border-[#E8D5BC]">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#800020] font-bold">Patron Portal</span>
              <h1 className="font-serif text-2xl font-semibold text-[#302820]">{user.fullName}</h1>
              <p className="text-xs text-gray-500">{user.email} {user.phone && `• ${user.phone}`}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center space-x-1.5 px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-600 hover:text-red-600 hover:border-red-300 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-3 border-b border-[#E8D5BC] mb-8 pb-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-1.5 pb-3 text-xs uppercase tracking-wider font-semibold transition border-b-2 ${
              activeTab === 'orders' ? 'border-[#800020] text-[#800020]' : 'border-transparent text-gray-500 hover:text-[#302820]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center space-x-1.5 pb-3 text-xs uppercase tracking-wider font-semibold transition border-b-2 ${
              activeTab === 'addresses' ? 'border-[#800020] text-[#800020]' : 'border-transparent text-gray-500 hover:text-[#302820]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center space-x-1.5 pb-3 text-xs uppercase tracking-wider font-semibold transition border-b-2 ${
              activeTab === 'wishlist' ? 'border-[#800020] text-[#800020]' : 'border-transparent text-gray-500 hover:text-[#302820]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlist.items?.length || 0})</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loadingOrders ? (
              <p className="text-xs text-gray-500 py-8 text-center">Loading your orders...</p>
            ) : orders.length > 0 ? (
              orders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-xl border border-[#E8D5BC] p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-cream-100 gap-2">
                    <div>
                      <p className="font-mono text-sm font-bold text-[#800020]">{ord.orderNumber}</p>
                      <p className="text-[11px] text-gray-500">
                        Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs bg-[#FAF0F2] text-[#800020] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                        {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                      <Link
                        to={`/order-tracking?number=${ord.orderNumber}`}
                        className="text-xs text-[#800020] hover:underline font-semibold flex items-center space-x-0.5"
                      >
                        <span>Track</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ord.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.imageUrl || '/images/hero-three-sarees.jpg'}
                            alt={item.productName}
                            className="w-10 h-12 object-cover object-top rounded border border-cream-200"
                          />
                          <div>
                            <p className="font-semibold text-[#302820]">{item.productName}</p>
                            <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#302820]">₹{item.subtotal?.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-cream-100 text-xs">
                    <span className="text-gray-500">Payment: {ord.paymentMethod} ({ord.paymentStatus})</span>
                    <span className="font-bold text-sm text-[#800020]">Total: ₹{ord.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center bg-white rounded-xl border border-[#E8D5BC] p-8">
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="font-serif text-lg text-[#302820] mb-1">No orders placed yet</p>
                <p className="text-xs text-gray-500 mb-4">Discover our handwoven silk blend & heritage collections.</p>
                <Link to="/shop" className="bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] text-xs font-semibold px-5 py-2.5 rounded shadow inline-block">
                  Explore Sarees
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg text-[#302820]">Your Saved Shipping Addresses</h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] text-xs font-semibold px-4 py-2 rounded shadow transition flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((a) => (
                  <div key={a.id} className="bg-white p-5 rounded-xl border border-[#E8D5BC] relative space-y-1.5 text-xs">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-[#302820] text-sm">{a.recipientName}</p>
                      <button onClick={() => handleDeleteAddress(a.id)} className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-gray-600">{a.addressLine1}</p>
                    {a.addressLine2 && <p className="text-gray-600">{a.addressLine2}</p>}
                    <p className="text-gray-600">{a.city}, {a.state} - {a.postalCode}</p>
                    <p className="text-gray-500 pt-1">Phone: {a.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-8 text-center">No addresses saved yet.</p>
            )}
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlist.items && wishlist.items.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {wishlist.items.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl border border-[#E8D5BC] overflow-hidden flex flex-col">
                    <Link to={`/product/${item.slug}`} className="aspect-[3/4] block overflow-hidden bg-cream-100">
                      <img src={item.primaryImage || '/images/hero-three-sarees.jpg'} alt={item.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-serif text-sm font-semibold text-[#302820] line-clamp-1">{item.name}</h4>
                      <p className="text-xs font-bold text-[#800020] mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
                      <div className="mt-3 flex gap-2 pt-2 border-t border-cream-100">
                        <button
                          onClick={() => addToCart(item.productId, 1, true)}
                          className="flex-1 bg-[#800020] text-[#E8D5BC] text-[11px] font-semibold py-1.5 rounded"
                        >
                          Add to Bag
                        </button>
                        <button
                          onClick={() => toggleWishlist(item.productId)}
                          className="p-1.5 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-12 text-center">Your wishlist is empty.</p>
            )}
          </div>
        )}

      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E8D5BC] p-6 space-y-4">
            <h3 className="font-serif text-xl font-semibold text-[#302820]">Add Delivery Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Recipient Name"
                value={newAddr.recipientName}
                onChange={(e) => setNewAddr({ ...newAddr, recipientName: e.target.value })}
                className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
              />
              <input
                type="tel"
                required
                placeholder="Phone Number"
                value={newAddr.phone}
                onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
              />
              <input
                type="text"
                required
                placeholder="Address Line 1"
                value={newAddr.addressLine1}
                onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                />
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="PIN Code"
                  value={newAddr.postalCode}
                  onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 text-gray-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#800020] text-[#E8D5BC] font-semibold px-5 py-2 rounded"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
