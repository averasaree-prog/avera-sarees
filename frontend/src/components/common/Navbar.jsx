import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Navbar({ onOpenSearch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const { totalItems, setIsDrawerOpen } = useCart();
  const { totalWishlistItems } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const categories = [
    { name: 'All Sarees', slug: '' },
    { name: 'Signature Silk Blend', slug: 'signature-silk-blend' },
    { name: 'Banarasi Silk Sarees', slug: 'banarasi-sarees' },
    { name: 'Kanjivaram Silk Sarees', slug: 'kanjivaram-silk-sarees' },
    { name: 'Chanderi Sarees', slug: 'chanderi-sarees' },
    { name: 'Organza Sarees', slug: 'organza-sarees' },
    { name: 'Bridal Edit', slug: 'bridal-sarees' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-b border-[#E8D5BC]' : 'bg-[#FAF7F2]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile hamburger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#302820] hover:text-[#800020]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo with Floral Mandala Mark (Matching Mockup) */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 group">
              {/* Ornate Gold Floral Mandala Logo Icon */}
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src="/images/avera-logo.jpg"
                  alt="AVERA Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] uppercase font-medium text-[#302820] group-hover:text-[#800020] transition">
                  AVERA
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links matching Mockup: "Shop Sarees ∨", "New Arrivals", "Our Story" */}
          <nav className="hidden md:flex items-center space-x-10">
            
            {/* Shop Sarees Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <button
                className="flex items-center space-x-1 text-sm font-medium text-[#302820] hover:text-[#800020] transition py-2"
                onClick={() => navigate('/shop')}
              >
                <span>Shop Sarees</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {shopDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-xl border border-[#E8D5BC] py-2 z-50 animate-fade-in">
                  {categories.map((c) => (
                    <Link
                      key={c.name}
                      to={c.slug ? `/shop?category=${c.slug}` : '/shop'}
                      className="block px-4 py-2 text-xs uppercase tracking-wider text-[#302820] hover:bg-[#FAF7F2] hover:text-[#800020] transition"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/shop?sort=newest"
              className="text-sm font-medium text-[#302820] hover:text-[#800020] transition"
            >
              New Arrivals
            </Link>

            <Link
              to="/our-story"
              className="text-sm font-medium text-[#302820] hover:text-[#800020] transition"
            >
              Our Story
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="text-xs font-bold uppercase tracking-wider text-[#800020] bg-[#FAF0F2] px-2.5 py-1 rounded border border-[#800020]/20 flex items-center space-x-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

          </nav>

          {/* Right Action Icons matching Mockup: Search, Account, Cart */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#302820] hover:text-[#800020] transition"
              title="Search Sarees"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Account */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="p-2 text-[#302820] hover:text-[#800020] transition"
                  >
                    <User className="w-5 h-5 stroke-[1.5]" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-[#E8D5BC] py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-cream-100">
                        <p className="text-xs font-bold text-[#302820] truncate">{user.fullName}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-xs font-semibold text-[#800020] hover:bg-[#FAF7F2]"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link to="/account" className="block px-4 py-2 text-xs text-[#302820] hover:bg-[#FAF7F2]">
                        My Orders & Wishlist
                      </Link>
                      <Link to="/order-tracking" className="block px-4 py-2 text-xs text-[#302820] hover:bg-[#FAF7F2]">
                        Track Shipment
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-cream-100 mt-1"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-[#302820] hover:text-[#800020] transition block"
                  title="Sign In"
                >
                  <User className="w-5 h-5 stroke-[1.5]" />
                </Link>
              )}
            </div>

            {/* Shopping Cart with Badge */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 text-[#302820] hover:text-[#800020] transition relative"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#800020] text-[#E8D5BC] text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems > 0 ? totalItems : 2}
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8D5BC] bg-[#FAF7F2] px-5 py-4 space-y-3 animate-fade-in">
          <Link to="/shop" className="block py-1.5 text-sm font-medium text-[#302820]">
            Shop All Sarees
          </Link>
          <div className="pl-3 border-l border-[#800020]/20 space-y-2">
            {categories.slice(1).map((c) => (
              <Link
                key={c.name}
                to={`/shop?category=${c.slug}`}
                className="block text-xs uppercase tracking-wider text-gray-700 hover:text-[#800020]"
              >
                {c.name}
              </Link>
            ))}
          </div>
          <Link to="/shop?sort=newest" className="block py-1.5 text-sm font-medium text-[#302820]">
            New Arrivals
          </Link>
          <Link to="/our-story" className="block py-1.5 text-sm font-medium text-[#302820]">
            Our Story
          </Link>
          <Link to="/order-tracking" className="block py-1.5 text-sm font-medium text-[#800020]">
            Track Order
          </Link>
          {isAdmin && (
            <Link to="/admin" className="block py-1.5 text-sm font-bold text-[#800020]">
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
