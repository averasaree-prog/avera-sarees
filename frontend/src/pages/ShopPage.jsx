import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, Check, RefreshCw } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import api from '../api/client';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters from query params
  const categoryParam = searchParams.get('category') || '';
  const queryParam = searchParams.get('q') || '';
  const fabricParam = searchParams.get('fabric') || '';
  const occasionParam = searchParams.get('occasion') || '';
  const colorParam = searchParams.get('color') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const inStockParam = searchParams.get('inStock') === 'true';

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    api.get('/api/categories').then((res) => {
      if (res.success && res.data) setCategories(res.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [categoryParam, queryParam, fabricParam, occasionParam, colorParam, sortParam, pageParam, inStockParam]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryParam) params.append('category', categoryParam);
      if (queryParam) params.append('q', queryParam);
      if (fabricParam) params.append('fabric', fabricParam);
      if (occasionParam) params.append('occasion', occasionParam);
      if (colorParam) params.append('color', colorParam);
      if (sortParam) params.append('sort', sortParam);
      if (inStockParam) params.append('inStockOnly', 'true');
      params.append('page', pageParam);
      params.append('size', '12');

      const res = await api.get(`/api/products?${params.toString()}`);
      if (res.success && res.data) {
        setProducts(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Error fetching sarees:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '0'); // reset to page 0
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const fabrics = ['Pure Katan Silk', 'Pure Mulberry Silk', 'Chanderi Silk Cotton', 'Silk Organza', '100% Fine Combed Cotton', '100 Count Organic Linen', 'Pure Viscose Georgette', 'Silk Blend'];
  const occasions = ['Bridal & Reception', 'Wedding & Festive', 'Day Wedding & Soiree', 'Festive Puja & Celebrations', 'Everyday Luxury & Office', 'Cocktail & Sangeet Night'];
  const colors = ['Deep Crimson Maroon', 'Temple Gold & Forest Green', 'Muted Dusty Rose', 'Warm Ivory & Antique Gold', 'Midnight Indigo & Ecru', 'Deep Maroon Wine', 'Deep Sindoor Red', 'Sage Green & Sterling Silver'];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="border-b border-[#E8D5BC] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#800020] font-bold">
              Artisanal Handloom Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#302820] font-normal mt-1">
              {categoryParam ? categoryParam.replace('-', ' ').toUpperCase() : (queryParam ? `Results for "${queryParam}"` : 'All Luxury Sarees')}
            </h1>
            <p className="text-xs text-gray-500 font-light mt-1">
              Showing {totalElements} handcrafted saree designs
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center space-x-1.5 px-3 py-2 bg-white border border-[#E8D5BC] rounded text-xs font-semibold text-[#302820]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-2">
              <label htmlFor="sort-select" className="text-xs text-gray-500 uppercase tracking-wider font-medium">Sort by:</label>
              <select
                id="sort-select"
                value={sortParam}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-white border border-[#E8D5BC] rounded text-xs font-medium text-[#302820] px-3 py-2 focus:outline-none focus:border-[#800020]"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popularity">Bestsellers</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid (Sidebar + Product Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar (1 col) */}
          <aside className="hidden md:block space-y-6">
            
            {/* Active Filters Clear */}
            {(categoryParam || fabricParam || occasionParam || colorParam || inStockParam || queryParam) && (
              <div className="bg-white p-4 rounded-lg border border-[#E8D5BC] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#302820] uppercase tracking-wider">Active Filters</span>
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] text-[#800020] hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {categoryParam && <span className="bg-cream-100 text-[#800020] text-[10px] px-2 py-0.5 rounded font-medium">{categoryParam}</span>}
                  {fabricParam && <span className="bg-cream-100 text-[#800020] text-[10px] px-2 py-0.5 rounded font-medium">{fabricParam}</span>}
                  {occasionParam && <span className="bg-cream-100 text-[#800020] text-[10px] px-2 py-0.5 rounded font-medium">{occasionParam}</span>}
                  {colorParam && <span className="bg-cream-100 text-[#800020] text-[10px] px-2 py-0.5 rounded font-medium">{colorParam}</span>}
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="bg-white p-5 rounded-lg border border-[#E8D5BC]">
              <h3 className="font-serif text-sm font-semibold text-[#302820] uppercase tracking-wider mb-3 pb-2 border-b border-cream-100">
                Categories
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={`text-left w-full transition ${!categoryParam ? 'font-bold text-[#800020]' : 'text-gray-600 hover:text-[#800020]'}`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => updateFilter('category', c.slug)}
                      className={`text-left w-full transition ${categoryParam === c.slug ? 'font-bold text-[#800020]' : 'text-gray-600 hover:text-[#800020]'}`}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fabric */}
            <div className="bg-white p-5 rounded-lg border border-[#E8D5BC]">
              <h3 className="font-serif text-sm font-semibold text-[#302820] uppercase tracking-wider mb-3 pb-2 border-b border-cream-100">
                Fabric & Weave
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {fabrics.map((fab) => (
                  <label key={fab} className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer hover:text-[#800020]">
                    <input
                      type="radio"
                      name="fabric"
                      checked={fabricParam === fab}
                      onChange={() => updateFilter('fabric', fabricParam === fab ? '' : fab)}
                      className="text-[#800020] focus:ring-[#800020]"
                    />
                    <span className="truncate">{fab}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div className="bg-white p-5 rounded-lg border border-[#E8D5BC]">
              <h3 className="font-serif text-sm font-semibold text-[#302820] uppercase tracking-wider mb-3 pb-2 border-b border-cream-100">
                Occasion
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {occasions.map((occ) => (
                  <label key={occ} className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer hover:text-[#800020]">
                    <input
                      type="radio"
                      name="occasion"
                      checked={occasionParam === occ}
                      onChange={() => updateFilter('occasion', occasionParam === occ ? '' : occ)}
                      className="text-[#800020] focus:ring-[#800020]"
                    />
                    <span className="truncate">{occ}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white p-5 rounded-lg border border-[#E8D5BC]">
              <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-[#302820]">
                <span>In-Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockParam}
                  onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')}
                  className="rounded text-[#800020] focus:ring-[#800020] w-4 h-4"
                />
              </label>
            </div>

          </aside>

          {/* Product Catalog Grid (3 cols on desktop) */}
          <main className="md:col-span-3">
            {loading ? (
              <div className="py-24 text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#800020] mb-3" />
                <p className="font-serif text-lg text-[#302820]">Loading artisanal sarees...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center space-x-2 pt-6 border-t border-[#E8D5BC]">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => updateFilter('page', i.toString())}
                        className={`w-9 h-9 rounded text-xs font-semibold transition ${
                          pageParam === i
                            ? 'bg-[#800020] text-[#E8D5BC]'
                            : 'bg-white text-[#302820] hover:bg-cream-100 border border-[#E8D5BC]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center bg-white rounded-xl border border-[#E8D5BC] p-8">
                <p className="font-serif text-xl text-[#302820] mb-2">No sarees match your current filter</p>
                <p className="text-xs text-gray-500 mb-6">Try clearing some filters or searching for fabrics like "Banarasi" or "Silk Blend".</p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#800020] text-[#E8D5BC] hover:bg-[#66001A] text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
}
