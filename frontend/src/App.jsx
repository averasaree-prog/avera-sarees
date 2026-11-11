import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AnnouncementBar from './components/common/AnnouncementBar';
import SearchModal from './components/common/SearchModal';
import CartDrawer from './components/common/CartDrawer';
import FloatingInstagram from './components/common/FloatingInstagram';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import OurStoryPage from './pages/OurStoryPage';

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] text-[#302820]">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navbar */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Live Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/story" element={<OurStoryPage />} />
        </Routes>
      </main>

      {/* Luxury Footer */}
      <Footer />

      {/* Floating Instagram Shortcut */}
      <FloatingInstagram />
    </div>
  );
}
