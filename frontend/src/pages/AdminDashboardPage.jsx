import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, TrendingUp, ShoppingBag, Package, Users, Plus, Check, X, RefreshCw, Truck, Edit, Trash2, Eye, AlertTriangle, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('overview'); // overview, orders, products, categories, coupons, reviews

  // Image Uploading State
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleDeviceImageUpload = async (file, target, isEdit = false) => {
    if (!file) return;
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/api/admin/upload', formData);
      if (res.success && res.data?.url) {
        if (target === 'category') {
          if (isEdit) {
            setEditingCategory(prev => ({ ...prev, imageUrl: res.data.url }));
          } else {
            setNewCategory(prev => ({ ...prev, imageUrl: res.data.url }));
          }
        } else {
          if (isEdit) {
            setEditingProduct(prev => ({ ...prev, imageUrls: [res.data.url] }));
          } else {
            setNewProduct(prev => ({ ...prev, imageUrls: [res.data.url] }));
          }
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to upload photo from device');
    } finally {
      setUploadingImage(false);
    }
  };

  // New Saree Form Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    fabric: 'Pure Katan Silk',
    weave: 'Kadwa Handloom',
    occasion: 'Wedding & Festive',
    color: 'Deep Crimson Maroon',
    price: '',
    originalPrice: '',
    stockQuantity: 10,
    categoryId: 1,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    imageUrls: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
  });

  // Edit Saree Form State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // New Coupon Form Modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isSubmittingCoupon, setIsSubmittingCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderValue: 2000,
    maxDiscountAmount: 2000,
  });

  // Category Form State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    displayOrder: 1,
    isActive: true,
  });

  // Status update modal
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState('SHIPPED');
  const [courierName, setCourierName] = useState('Blue Dart Express');
  const [trackingNumber, setTrackingNumber] = useState('BD-87654321');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [isAdmin, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [mRes, oRes, pRes, cRes, coupRes, rRes] = await Promise.all([
        api.get('/api/admin/metrics'),
        api.get('/api/admin/orders?size=20'),
        api.get('/api/products?size=20'),
        api.get('/api/admin/categories'),
        api.get('/api/admin/coupons'),
        api.get('/api/admin/reviews?size=20'),
      ]);

      if (mRes.success) setMetrics(mRes.data);
      if (oRes.success) setOrders(oRes.data?.content || []);
      if (pRes.success) setProducts(pRes.data?.content || []);
      if (cRes.success) setCategories(cRes.data || []);
      if (coupRes.success) setCoupons(coupRes.data || []);
      if (rRes.success) setReviews(rRes.data?.content || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (e) => {
    e.preventDefault();
    if (!updatingOrderId) return;
    try {
      const res = await api.patch(`/api/admin/orders/${updatingOrderId}/status`, {
        status: newStatus,
        courierName: courierName,
        trackingNumber: trackingNumber,
        remarks: `Dispatched via ${courierName}`,
      });
      if (res.success) {
        setOrders(orders.map((o) => (o.id === updatingOrderId ? res.data : o)));
        setUpdatingOrderId(null);
        alert('Order status successfully updated!');
      }
    } catch (err) {
      alert(err.message || 'Could not update order status.');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      setIsSubmittingProduct(true);
      const res = await api.post('/api/admin/products', newProduct);
      if (res.success) {
        setShowProductModal(false);
        fetchDashboardData();
        alert('Saree published successfully to catalog!');
      }
    } catch (err) {
      alert(err.message || 'Could not create product.');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name || '',
      sku: product.sku || '',
      fabric: product.fabric || 'Pure Katan Silk',
      weave: product.weave || 'Kadwa Handloom',
      occasion: product.occasion || 'Wedding & Festive',
      color: product.color || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      stockQuantity: product.stockQuantity ?? 10,
      categoryId: product.category?.id || (categories.length > 0 ? categories[0].id : 1),
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      isFeatured: !!product.isFeatured,
      isBestSeller: !!product.isBestSeller,
      isNewArrival: !!product.isNewArrival,
      imageUrls: product.images && product.images.length > 0
        ? product.images.map((img) => img.imageUrl)
        : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      setIsSubmittingProduct(true);
      const payload = {
        name: editingProduct.name.trim(),
        sku: editingProduct.sku.trim(),
        shortDescription: editingProduct.shortDescription,
        description: editingProduct.description,
        fabric: editingProduct.fabric,
        weave: editingProduct.weave,
        occasion: editingProduct.occasion,
        color: editingProduct.color,
        price: parseFloat(editingProduct.price),
        originalPrice: editingProduct.originalPrice ? parseFloat(editingProduct.originalPrice) : parseFloat(editingProduct.price),
        stockQuantity: parseInt(editingProduct.stockQuantity, 10),
        categoryId: parseInt(editingProduct.categoryId, 10),
        isFeatured: editingProduct.isFeatured,
        isBestSeller: editingProduct.isBestSeller,
        isNewArrival: editingProduct.isNewArrival,
        imageUrls: editingProduct.imageUrls.filter((url) => url && url.trim().length > 0),
      };

      const res = await api.put(`/api/admin/products/${editingProduct.id}`, payload);
      if (res.success) {
        setEditingProduct(null);
        await fetchDashboardData();
        alert('Saree details updated successfully!');
      }
    } catch (err) {
      alert(err.message || 'Could not update saree details.');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to remove "${product.name}" (SKU: ${product.sku}) from the catalog?`)) {
      return;
    }
    try {
      const res = await api.delete(`/api/admin/products/${product.id}`);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        await fetchDashboardData();
        alert(`"${product.name}" has been removed from the catalog.`);
      }
    } catch (err) {
      alert(err.message || 'Could not remove product.');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      setIsSubmittingCoupon(true);
      const res = await api.post('/api/admin/coupons', newCoupon);
      if (res.success) {
        setShowCouponModal(false);
        fetchDashboardData();
        alert('Promotional coupon created!');
      }
    } catch (err) {
      alert(err.message || 'Could not create coupon.');
    } finally {
      setIsSubmittingCoupon(false);
    }
  };

  const openEditCouponModal = (coupon) => {
    setEditingCoupon({
      id: coupon.id,
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType || 'PERCENTAGE',
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || '',
      isActive: coupon.active !== undefined ? coupon.active : (coupon.isActive !== undefined ? coupon.isActive : true),
    });
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    if (!editingCoupon) return;
    try {
      setIsSubmittingCoupon(true);
      const payload = {
        code: editingCoupon.code.trim().toUpperCase(),
        description: editingCoupon.description,
        discountType: editingCoupon.discountType,
        discountValue: parseFloat(editingCoupon.discountValue),
        minOrderValue: parseFloat(editingCoupon.minOrderValue) || 0,
        maxDiscountAmount: editingCoupon.maxDiscountAmount ? parseFloat(editingCoupon.maxDiscountAmount) : null,
        isActive: editingCoupon.isActive,
      };

      const res = await api.put(`/api/admin/coupons/${editingCoupon.id}`, payload);
      if (res.success) {
        setEditingCoupon(null);
        await fetchDashboardData();
        alert('Coupon updated successfully!');
      }
    } catch (err) {
      alert(err.message || 'Could not update coupon.');
    } finally {
      setIsSubmittingCoupon(false);
    }
  };

  const handleDeleteCoupon = async (coupon) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) {
      return;
    }
    try {
      const res = await api.delete(`/api/admin/coupons/${coupon.id}`);
      if (res.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
        await fetchDashboardData();
        alert(`Coupon "${coupon.code}" has been deleted.`);
      }
    } catch (err) {
      alert(err.message || 'Could not delete coupon.');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      setIsSubmittingCategory(true);
      const payload = {
        name: newCategory.name.trim(),
        description: newCategory.description,
        imageUrl: newCategory.imageUrl,
        displayOrder: parseInt(newCategory.displayOrder, 10) || 0,
        isActive: newCategory.isActive,
      };
      const res = await api.post('/api/admin/categories', payload);
      if (res.success) {
        setShowCategoryModal(false);
        setNewCategory({
          name: '',
          description: '',
          imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
          displayOrder: categories.length + 1,
          isActive: true,
        });
        await fetchDashboardData();
        alert('New saree category created successfully!');
      }
    } catch (err) {
      alert(err.message || 'Could not create category.');
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const openEditCategoryModal = (cat) => {
    setEditingCategory({
      id: cat.id,
      name: cat.name || '',
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      displayOrder: cat.displayOrder ?? 0,
      isActive: cat.active !== undefined ? cat.active : (cat.isActive !== undefined ? cat.isActive : true),
    });
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      setIsSubmittingCategory(true);
      const payload = {
        name: editingCategory.name.trim(),
        description: editingCategory.description,
        imageUrl: editingCategory.imageUrl,
        displayOrder: parseInt(editingCategory.displayOrder, 10) || 0,
        isActive: editingCategory.isActive,
      };
      const res = await api.put(`/api/admin/categories/${editingCategory.id}`, payload);
      if (res.success) {
        setEditingCategory(null);
        await fetchDashboardData();
        alert('Category updated successfully!');
      }
    } catch (err) {
      alert(err.message || 'Could not update category.');
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Are you sure you want to remove the category "${cat.name}"? If sarees are currently linked to this category, it will be deactivated.`)) {
      return;
    }
    try {
      const res = await api.delete(`/api/admin/categories/${cat.id}`);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        await fetchDashboardData();
        alert(`Category "${cat.name}" has been removed.`);
      }
    } catch (err) {
      alert(err.message || 'Could not remove category.');
    }
  };

  const handleToggleReview = async (id, approved) => {
    try {
      await api.patch(`/api/admin/reviews/${id}/approval?approved=${approved}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="bg-white rounded-2xl border border-[#E8D5BC] p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-[#800020] text-[#E8D5BC] flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#800020] font-bold">Administration Command Center</span>
              <h1 className="font-serif text-2xl font-bold text-[#302820]">AVERA Operations Management</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchDashboardData}
              className="p-2 border border-gray-300 rounded text-gray-600 hover:text-[#800020] transition"
              title="Refresh live data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowProductModal(true)}
              className="bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] text-xs font-semibold px-4 py-2 rounded shadow transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Saree</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-[#E8D5BC] mb-8 pb-1 overflow-x-auto text-xs font-semibold">
          {[
            { key: 'overview', label: 'Dashboard KPIs' },
            { key: 'orders', label: `Orders Fulfillment (${orders.length})` },
            { key: 'products', label: `Saree Inventory (${products.length})` },
            { key: 'categories', label: `Categories (${categories.length})` },
            { key: 'coupons', label: `Coupons (${coupons.length})` },
            { key: 'reviews', label: `Patron Reviews (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-t-lg uppercase tracking-wider transition ${
                activeTab === tab.key
                  ? 'bg-[#800020] text-[#E8D5BC]'
                  : 'bg-white text-gray-600 hover:text-[#302820] border border-b-0 border-[#E8D5BC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview KPIs */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              <div className="bg-white p-5 rounded-2xl border border-[#E8D5BC] shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Gross Revenue</p>
                  <p className="font-serif text-2xl font-bold text-[#800020]">
                    ₹{(metrics?.totalRevenue || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8D5BC] shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Total Orders</p>
                  <p className="font-serif text-2xl font-bold text-[#302820]">
                    {metrics?.totalOrders || orders.length}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8D5BC] shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Active Sarees</p>
                  <p className="font-serif text-2xl font-bold text-[#302820]">
                    {metrics?.totalProducts || products.length}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8D5BC] shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Patrons Enrolled</p>
                  <p className="font-serif text-2xl font-bold text-[#302820]">
                    {metrics?.totalCustomers || 1}
                  </p>
                </div>
              </div>

            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl border border-[#E8D5BC] p-6 shadow-sm">
              <h3 className="font-serif text-lg font-semibold text-[#302820] mb-4">Latest Inquiries & Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-cream-50 text-gray-600 uppercase tracking-wider border-b border-cream-200">
                    <tr>
                      <th className="p-3">Order Number</th>
                      <th className="p-3">Patron Name</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Order Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-cream-50/50">
                        <td className="p-3 font-mono font-bold text-[#800020]">{o.orderNumber}</td>
                        <td className="p-3 font-medium text-[#302820]">{o.shippingRecipientName}</td>
                        <td className="p-3 font-bold text-[#302820]">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                        <td className="p-3">{o.paymentMethod} ({o.paymentStatus})</td>
                        <td className="p-3">
                          <span className="bg-[#FAF0F2] text-[#800020] px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setUpdatingOrderId(o.id);
                              setNewStatus(o.orderStatus);
                            }}
                            className="text-[#800020] font-semibold hover:underline"
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders Fulfillment */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-[#E8D5BC] p-6 shadow-sm animate-fade-in">
            <h3 className="font-serif text-lg font-semibold text-[#302820] mb-4">Customer Orders & Shipment Fulfillment</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-cream-50 text-gray-600 uppercase tracking-wider border-b border-cream-200">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Patron / Destination</th>
                    <th className="p-3">Ordered Sarees</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-cream-50/50">
                      <td className="p-3 font-mono font-bold text-[#800020]">
                        <Link to={`/order-tracking?number=${o.orderNumber}`} className="hover:underline">
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-[#302820]">{o.shippingRecipientName}</p>
                        <p className="text-[11px] text-gray-600 font-mono">{o.customerPhone}</p>
                        <p className="text-[11px] text-gray-500">{o.customerEmail}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{o.shippingAddressLine1}, {o.shippingCity}, {o.shippingState} - {o.shippingPostalCode}</p>
                      </td>
                      <td className="p-3 text-[11px] text-gray-700">
                        {o.items?.map((it) => (
                          <div key={it.id} className="py-0.5">
                            <span className="font-medium text-[#302820]">{it.productName}</span> <span className="text-gray-500">(x{it.quantity})</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-3 font-bold text-[#800020] text-sm">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          o.paymentMethod === 'COD' 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {o.paymentMethod === 'COD' ? 'COD (Pay on Delivery)' : 'Razorpay (Paid)'}
                        </span>
                        <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Payment: {o.paymentStatus}</p>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          o.orderStatus === 'CONFIRMED'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : o.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : o.orderStatus === 'SHIPPED'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-[#FAF0F2] text-[#800020] border border-[#800020]/20'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setUpdatingOrderId(o.id);
                            setNewStatus(o.orderStatus);
                          }}
                          className="bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] px-3 py-1.5 rounded text-[11px] font-semibold transition shadow-sm"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Products */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-[#E8D5BC] p-6 shadow-sm animate-fade-in space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-semibold text-[#302820]">Cataloged Saree Masterpieces</h3>
              <button
                onClick={() => setShowProductModal(true)}
                className="bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] text-xs font-semibold px-4 py-2 rounded shadow transition flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish New Saree</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-cream-50 text-gray-600 uppercase tracking-wider border-b border-cream-200">
                  <tr>
                    <th className="p-3">Saree</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Fabric</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock Remaining</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-cream-50/50 transition-colors">
                      <td className="p-3 font-semibold text-[#302820] flex items-center space-x-3">
                        <img src={p.images?.[0]?.imageUrl || ''} alt={p.name} className="w-9 h-11 object-cover rounded bg-cream-100 border border-cream-200" />
                        <Link to={`/product/${p.slug}`} target="_blank" className="hover:text-[#800020] transition-colors">{p.name}</Link>
                      </td>
                      <td className="p-3 font-mono">{p.sku}</td>
                      <td className="p-3">{p.fabric}</td>
                      <td className="p-3 font-bold text-[#800020]">₹{p.price?.toLocaleString('en-IN')}</td>
                      <td className="p-3">{p.stockQuantity} pieces</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {p.inStock ? 'Active' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-3 text-right pr-4">
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="bg-[#302820] text-[#E8D5BC] hover:bg-[#800020] hover:text-white px-2.5 py-1.5 rounded text-[11px] font-semibold transition flex items-center space-x-1 shadow-sm"
                            title="Edit Saree Details"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="bg-red-50 text-red-700 hover:bg-red-700 hover:text-white border border-red-200 px-2.5 py-1.5 rounded text-[11px] font-semibold transition flex items-center space-x-1 shadow-sm"
                            title="Remove Saree from Catalog"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Categories */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl border border-[#E8D5BC] p-6 shadow-sm animate-fade-in space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#302820]">Curated Saree Collections & Weave Categories</h3>
                <p className="text-xs text-gray-500">Manage handloom collections, storefront display sequence, and collection hero images</p>
              </div>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] text-xs font-semibold px-4 py-2 rounded shadow transition flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-[#E8D5BC] bg-[#FAF8F5] space-y-3 text-xs flex flex-col justify-between shadow-sm hover:shadow transition">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={c.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                        alt={c.name}
                        className="w-14 h-14 object-cover rounded-lg border border-[#E8D5BC] bg-cream-100"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-sm text-[#302820] truncate">{c.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.active !== false && c.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                            {c.active !== false && c.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="font-mono text-[11px] text-gray-500 truncate">slug: {c.slug}</p>
                        <p className="text-[11px] text-[#800020] font-semibold">Display Order: #{c.displayOrder ?? 0}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 line-clamp-2 leading-relaxed">
                      {c.description || 'Exclusive Indian handloom weave collection.'}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-cream-200 flex items-center justify-between">
                    <Link
                      to={`/shop?category=${c.slug}`}
                      target="_blank"
                      className="text-gray-500 hover:text-[#800020] text-[11px] font-medium flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Sarees</span>
                    </Link>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditCategoryModal(c)}
                        className="bg-[#302820] text-[#E8D5BC] hover:bg-[#800020] hover:text-white px-2.5 py-1 rounded text-[11px] font-semibold transition flex items-center space-x-1 shadow-sm"
                        title="Edit Category Details"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(c)}
                        className="bg-red-50 text-red-700 hover:bg-red-700 hover:text-white border border-red-200 px-2.5 py-1 rounded text-[11px] font-semibold transition flex items-center space-x-1 shadow-sm"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Coupons */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-2xl border border-[#E8D5BC] p-6 shadow-sm animate-fade-in space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-semibold text-[#302820]">Active Promotional Coupons</h3>
              <button
                onClick={() => setShowCouponModal(true)}
                className="bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] text-xs font-semibold px-4 py-2 rounded shadow transition flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-[#E8D5BC] bg-[#FAF8F5] space-y-3 text-xs flex flex-col justify-between shadow-sm hover:shadow transition">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm font-bold text-[#800020] bg-white px-2 py-1 rounded border border-[#E8D5BC]">
                        {c.code}
                      </span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${c.active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}>
                        {c.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-600 line-clamp-2">{c.description || 'Promotional Discount'}</p>
                    <div className="pt-1 border-t border-cream-200">
                      <p className="font-semibold text-[#302820]">
                        Discount: <span className="text-[#800020] font-bold">{c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `₹${c.discountValue}`}</span>
                      </p>
                      <p className="text-[11px] text-gray-500">Min Order: ₹{c.minOrderValue || 0}</p>
                      {c.maxDiscountAmount && (
                        <p className="text-[11px] text-gray-500">Max Cap: ₹{c.maxDiscountAmount}</p>
                      )}
                    </div>
                  </div>

                  {/* Coupon Actions Row */}
                  <div className="pt-2 border-t border-cream-200 flex justify-end space-x-2">
                    <button
                      onClick={() => openEditCouponModal(c)}
                      className="bg-[#302820] text-[#E8D5BC] hover:bg-[#800020] hover:text-white px-2.5 py-1 rounded text-[11px] font-semibold transition flex items-center space-x-1 shadow-sm"
                      title="Edit Coupon"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(c)}
                      className="bg-red-50 text-red-700 hover:bg-red-700 hover:text-white border border-red-200 px-2.5 py-1 rounded text-[11px] font-semibold transition flex items-center space-x-1 shadow-sm"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Reviews Moderation */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl border border-[#E8D5BC] p-6 shadow-sm animate-fade-in space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#302820]">Patron Review Moderation</h3>
            <div className="divide-y divide-cream-100">
              {reviews.map((r) => (
                <div key={r.id} className="py-4 flex items-center justify-between text-xs gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-[#302820]">{r.title} ({r.rating} ★)</p>
                    <p className="text-gray-600 italic">"{r.comment}"</p>
                    <p className="text-[11px] text-gray-500">— {r.customerName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleReview(r.id, true)}
                      className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded text-xs font-semibold hover:bg-emerald-100"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleToggleReview(r.id, false)}
                      className="px-3 py-1 bg-red-50 text-red-800 rounded text-xs font-semibold hover:bg-red-100"
                    >
                      Hide
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Update Order Status Modal */}
      {updatingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E8D5BC] p-6 space-y-4">
            <h3 className="font-serif text-xl font-semibold text-[#302820]">Update Order Fulfillment</h3>
            <form onSubmit={handleUpdateOrderStatus} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-[#302820]"
                >
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING (Packaging)</option>
                  <option value="SHIPPED">SHIPPED (In Transit)</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Courier Partner</label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="e.g. Blue Dart Express, Delhivery"
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-[#302820]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Airway Bill / Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="AWB Tracking ID"
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-[#302820]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUpdatingOrderId(null)}
                  className="px-4 py-2 text-gray-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#800020] text-[#E8D5BC] font-semibold px-5 py-2 rounded"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Saree Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#E8D5BC] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl font-semibold text-[#302820]">Publish New Handloom Saree</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Saree Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Gulab Katan Silk Banarasi Saree"
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="e.g. AV-BAN-105"
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Fabric *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.fabric}
                    onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })}
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="7999"
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    placeholder="9999"
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value, 10) })}
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: parseInt(e.target.value, 10) })}
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Saree Photo (Upload from Device or Paste Link)
                </label>
                
                {/* Device Upload Area */}
                <div className="border-2 border-dashed border-[#E8D5BC] hover:border-[#800020] bg-cream-50/60 hover:bg-cream-50 rounded-xl p-4 transition text-center cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleDeviceImageUpload(e.target.files[0], 'product', false);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    {uploadingImage ? (
                      <div className="py-2 flex items-center space-x-2">
                        <RefreshCw className="w-5 h-5 text-[#800020] animate-spin" />
                        <span className="text-xs text-[#800020] font-semibold">Uploading saree photo from device...</span>
                      </div>
                    ) : newProduct.imageUrls[0] ? (
                      <div className="flex items-center space-x-4 text-left w-full justify-center">
                        <img
                          src={newProduct.imageUrls[0]}
                          alt="Saree preview"
                          className="w-16 h-20 object-cover object-top rounded-lg border border-[#E8D5BC] shadow-md"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div>
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Photo Selected</span>
                          </div>
                          <span className="text-[11px] text-gray-500 block truncate max-w-xs">{newProduct.imageUrls[0]}</span>
                          <span className="text-[11px] text-[#800020] font-semibold underline mt-1 block">Click or drop to replace with another photo</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-[#800020]">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-[#302820]">Click to choose photo from this device</span>
                        <span className="text-[11px] text-gray-500">Supports JPG, PNG, WEBP, AVIF from laptop, mobile or desktop</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Optional manual URL input */}
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-[11px] font-semibold text-gray-500 whitespace-nowrap">Or Image URL:</span>
                  <input
                    type="text"
                    value={newProduct.imageUrls[0] || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrls: [e.target.value] })}
                    placeholder="https://images.unsplash.com/... or paste external image link"
                    className="flex-1 bg-white border border-cream-300 rounded px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#800020]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 text-gray-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="bg-[#800020] text-[#E8D5BC] font-semibold px-5 py-2 rounded shadow hover:bg-[#66001A] disabled:opacity-50"
                >
                  {isSubmittingProduct ? 'Publishing...' : 'Publish Saree'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Saree Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#E8D5BC] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-cream-200 pb-3">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#302820]">Edit Saree Details</h3>
                <p className="text-xs text-gray-500">SKU: <span className="font-mono font-bold text-[#800020]">{editingProduct.sku}</span></p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-cream-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Saree Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-[#302820] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value.toUpperCase() })}
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: parseInt(e.target.value, 10) })}
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Fabric *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.fabric}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Weave</label>
                  <input
                    type="text"
                    value={editingProduct.weave}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weave: e.target.value })}
                    placeholder="e.g. Kadwa, Jamdani, Brocade"
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Occasion</label>
                  <input
                    type="text"
                    value={editingProduct.occasion}
                    onChange={(e) => setEditingProduct({ ...editingProduct, occasion: e.target.value })}
                    placeholder="e.g. Wedding & Festive"
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Color Shade</label>
                  <input
                    type="text"
                    value={editingProduct.color}
                    onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })}
                    placeholder="e.g. Crimson Maroon, Royal Gold"
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 font-bold text-[#800020]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">MRP / Original (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingProduct.stockQuantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Saree Photo (Upload from Device or Edit Link)
                </label>
                
                {/* Device Upload Area */}
                <div className="border-2 border-dashed border-[#E8D5BC] hover:border-[#800020] bg-cream-50/60 hover:bg-cream-50 rounded-xl p-4 transition text-center cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleDeviceImageUpload(e.target.files[0], 'product', true);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    {uploadingImage ? (
                      <div className="py-2 flex items-center space-x-2">
                        <RefreshCw className="w-5 h-5 text-[#800020] animate-spin" />
                        <span className="text-xs text-[#800020] font-semibold">Uploading new saree photo from device...</span>
                      </div>
                    ) : editingProduct.imageUrls[0] ? (
                      <div className="flex items-center space-x-4 text-left w-full justify-center">
                        <img
                          src={editingProduct.imageUrls[0]}
                          alt="Saree preview"
                          className="w-16 h-20 object-cover object-top rounded-lg border border-[#E8D5BC] shadow-md"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div>
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Current Saree Photo</span>
                          </div>
                          <span className="text-[11px] text-gray-500 block truncate max-w-xs">{editingProduct.imageUrls[0]}</span>
                          <span className="text-[11px] text-[#800020] font-semibold underline mt-1 block">Click to upload new photo from device</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-[#800020]">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-[#302820]">Click to choose photo from this device</span>
                        <span className="text-[11px] text-gray-500">Supports JPG, PNG, WEBP, AVIF</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Optional manual URL input */}
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-[11px] font-semibold text-gray-500 whitespace-nowrap">Or Image URL:</span>
                  <input
                    type="text"
                    value={editingProduct.imageUrls[0] || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imageUrls: [e.target.value] })}
                    placeholder="https://... or paste image link"
                    className="flex-1 bg-white border border-cream-300 rounded px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#800020]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Artisan weaving details, zari craft, pallu description..."
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-1 border-t border-cream-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="rounded text-[#800020] focus:ring-[#800020]"
                  />
                  <span className="font-medium text-gray-700">Featured</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBestSeller}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                    className="rounded text-[#800020] focus:ring-[#800020]"
                  />
                  <span className="font-medium text-gray-700">Best Seller</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNewArrival}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                    className="rounded text-[#800020] focus:ring-[#800020]"
                  />
                  <span className="font-medium text-gray-700">New Arrival</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] font-semibold px-6 py-2 rounded shadow transition disabled:opacity-50"
                >
                  {isSubmittingProduct ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E8D5BC] p-6 space-y-4">
            <h3 className="font-serif text-xl font-semibold text-[#302820]">Create Promotional Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full uppercase bg-cream-50 border border-cream-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Discount Value (%, or Flat ₹) *</label>
                <input
                  type="number"
                  required
                  value={newCoupon.discountValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: parseFloat(e.target.value) })}
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Festival discount"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 text-gray-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCoupon}
                  className="bg-[#800020] text-[#E8D5BC] font-semibold px-5 py-2 rounded hover:bg-[#66001A] disabled:opacity-50"
                >
                  {isSubmittingCoupon ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Coupon Modal */}
      {editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E8D5BC] p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-cream-200 pb-3">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#302820]">Edit Promotional Coupon</h3>
                <p className="text-xs text-gray-500">Code: <span className="font-mono font-bold text-[#800020]">{editingCoupon.code}</span></p>
              </div>
              <button
                onClick={() => setEditingCoupon(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-cream-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={editingCoupon.code}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full uppercase bg-cream-50 border border-cream-300 rounded px-3 py-2 font-mono font-bold text-[#800020]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Discount Type *</label>
                  <select
                    value={editingCoupon.discountType}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discountType: e.target.value })}
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min={0.01}
                    step="any"
                    value={editingCoupon.discountValue}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: e.target.value })}
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Description</label>
                <input
                  type="text"
                  value={editingCoupon.description}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, description: e.target.value })}
                  placeholder="e.g. 10% festive discount on all orders"
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingCoupon.minOrderValue}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrderValue: e.target.value })}
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Max Cap (₹, Optional)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingCoupon.maxDiscountAmount || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, maxDiscountAmount: e.target.value })}
                    placeholder="No cap"
                    className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCoupon.isActive}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, isActive: e.target.checked })}
                    className="rounded text-[#800020] focus:ring-[#800020]"
                  />
                  <span className="font-medium text-gray-700">Active (Redeemable by customers)</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCoupon}
                  className="bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] font-semibold px-6 py-2 rounded shadow transition disabled:opacity-50"
                >
                  {isSubmittingCoupon ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E8D5BC] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-cream-200 pb-3">
              <h3 className="font-serif text-xl font-semibold text-[#302820]">Create Saree Category</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-cream-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kanjivaram Silk Sarees"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-[#302820] font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the weave, heritage, and artisan tradition..."
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Hero Image URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newCategory.imageUrl}
                    onChange={(e) => setNewCategory({ ...newCategory, imageUrl: e.target.value })}
                    className="flex-1 bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  />
                  {newCategory.imageUrl && (
                    <img
                      src={newCategory.imageUrl}
                      alt="Preview"
                      className="w-9 h-9 object-cover rounded border border-[#E8D5BC]"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Display Order</label>
                <input
                  type="number"
                  min={0}
                  value={newCategory.displayOrder}
                  onChange={(e) => setNewCategory({ ...newCategory, displayOrder: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCategory.isActive}
                    onChange={(e) => setNewCategory({ ...newCategory, isActive: e.target.checked })}
                    className="rounded text-[#800020] focus:ring-[#800020]"
                  />
                  <span className="font-medium text-gray-700">Active (Visible in Navigation & Catalog)</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-gray-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCategory}
                  className="bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] font-semibold px-5 py-2 rounded shadow transition disabled:opacity-50"
                >
                  {isSubmittingCategory ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E8D5BC] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-cream-200 pb-3">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#302820]">Edit Saree Category</h3>
                <p className="text-xs text-gray-500">Editing: <span className="font-bold text-[#800020]">{editingCategory.name}</span></p>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-cream-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2 text-[#302820] font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Hero Image URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editingCategory.imageUrl || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
                    className="flex-1 bg-cream-50 border border-cream-300 rounded px-3 py-2"
                  />
                  {editingCategory.imageUrl && (
                    <img
                      src={editingCategory.imageUrl}
                      alt="Preview"
                      className="w-9 h-9 object-cover rounded border border-[#E8D5BC]"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Display Order</label>
                <input
                  type="number"
                  min={0}
                  value={editingCategory.displayOrder}
                  onChange={(e) => setEditingCategory({ ...editingCategory, displayOrder: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCategory.isActive}
                    onChange={(e) => setEditingCategory({ ...editingCategory, isActive: e.target.checked })}
                    className="rounded text-[#800020] focus:ring-[#800020]"
                  />
                  <span className="font-medium text-gray-700">Active (Visible in Navigation & Catalog)</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCategory}
                  className="bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] font-semibold px-6 py-2 rounded shadow transition disabled:opacity-50"
                >
                  {isSubmittingCategory ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
