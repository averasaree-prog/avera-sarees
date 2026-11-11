import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import api from '../../api/client';

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/products?q=${encodeURIComponent(query)}&size=6`);
        if (res.success && res.data) {
          setResults(res.data.content || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-cream-200 overflow-hidden">
        
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center px-5 py-4 border-b border-cream-200 bg-cream-50">
          <Search className="w-5 h-5 text-maroon-800 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by saree name, fabric (e.g. Banarasi, Katan), color or occasion..."
            className="w-full bg-transparent text-charcoal-900 placeholder-gray-400 focus:outline-none text-base"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-charcoal-800 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase tracking-wider font-semibold text-gray-500 hover:text-maroon-900 px-2 py-1"
          >
            Esc
          </button>
        </form>

        {/* Live Search Suggestions */}
        <div className="max-h-96 overflow-y-auto p-4">
          {loading && (
            <div className="py-8 text-center text-xs text-gray-500">
              Searching master weavers' catalog...
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold px-2 mb-2">
                Matching Sarees ({results.length})
              </p>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.slug)}
                  className="flex items-center p-2 rounded-lg hover:bg-cream-100 cursor-pointer transition"
                >
                  <img
                    src={product.images?.[0]?.imageUrl || ''}
                    alt={product.name}
                    className="w-12 h-16 object-cover rounded bg-cream-200 mr-4"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm text-charcoal-900 font-medium truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-maroon-800 font-semibold">
                      ₹{product.price?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider bg-cream-200/60 px-2 py-1 rounded ml-2">
                    {product.fabric}
                  </span>
                </div>
              ))}

              <div className="pt-3 border-t border-cream-100 text-center">
                <button
                  onClick={handleSubmit}
                  className="text-xs text-maroon-900 hover:text-maroon-700 font-semibold flex items-center justify-center mx-auto space-x-1"
                >
                  <span>View all results for "{query}"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm font-serif text-charcoal-800 mb-1">No sarees found for "{query}"</p>
              <p className="text-xs text-gray-500">Try searching for fabrics like "Banarasi", "Kanjivaram", or "Organza".</p>
            </div>
          )}

          {!query && (
            <div className="py-6 px-2">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-3">Popular Collections</p>
              <div className="flex flex-wrap gap-2">
                {['Banarasi Silk', 'Kanjivaram', 'Bridal Sarees', 'Chanderi Tissue', 'Organza Florals', 'Cocktail Sarees'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      onClose();
                      navigate(`/shop?q=${encodeURIComponent(tag)}`);
                    }}
                    className="text-xs bg-cream-100 hover:bg-maroon-900 hover:text-gold-200 text-charcoal-800 px-3 py-1.5 rounded-full transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
