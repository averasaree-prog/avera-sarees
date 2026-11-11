import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-16 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl border border-[#E8D5BC] shadow-xl p-8 space-y-6">
        
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#800020] font-bold">
            Join the Connoisseurs
          </span>
          <h1 className="font-serif text-3xl font-semibold text-[#302820]">
            Create Patron Account
          </h1>
          <p className="text-xs text-gray-500">
            Enjoy exclusive previews of new handloom drops and seamless tracking.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Radhika Sharma"
              className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2.5 text-[#302820] focus:outline-none focus:border-[#800020]"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="radhika@example.com"
              className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2.5 text-[#302820] focus:outline-none focus:border-[#800020]"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Mobile Phone (Optional)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 96250 47510"
              className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2.5 text-[#302820] focus:outline-none focus:border-[#800020]"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Password * (Min 6 chars)</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2.5 text-[#302820] focus:outline-none focus:border-[#800020]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#800020] hover:bg-[#66001A] text-[#E8D5BC] text-xs uppercase tracking-widest font-semibold py-3.5 rounded shadow-md transition duration-200 flex items-center justify-center space-x-1"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-gray-600 pt-2 border-t border-cream-100">
          <span>Already registered? </span>
          <Link to="/login" className="font-bold text-[#800020] hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
