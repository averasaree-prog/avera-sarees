import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await login(email, password);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials autofill
  const fillAdmin = () => {
    setEmail('admin@saanvisarees.com');
    setPassword('Admin@Saanvi2026!');
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-16 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl border border-[#E8D5BC] shadow-xl p-8 space-y-6">
        
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#800020] font-bold">
            Welcome to AVERA
          </span>
          <h1 className="font-serif text-3xl font-semibold text-[#302820]">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-gray-500">
            Access order tracking, saved sarees and express checkout.
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
            <label className="font-semibold text-gray-700 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2.5 text-[#302820] focus:outline-none focus:border-[#800020]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-gray-700">Password</label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cream-50 border border-cream-300 rounded px-3 py-2.5 text-[#302820] focus:outline-none focus:border-[#800020]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#800020] hover:bg-[#66001A] text-[#E8D5BC] text-xs uppercase tracking-widest font-semibold py-3.5 rounded shadow-md transition duration-200 flex items-center justify-center space-x-1"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast-Fill Pill */}
        <div className="bg-[#FAF4ED] p-3 rounded-lg border border-[#E8D5BC] text-center space-y-1.5">
          <p className="text-[11px] text-gray-600 font-medium">Testing Admin Access?</p>
          <button
            type="button"
            onClick={fillAdmin}
            className="text-xs text-[#800020] font-bold hover:underline"
          >
            Auto-fill Admin Credentials
          </button>
        </div>

        <div className="text-center text-xs text-gray-600 pt-2 border-t border-cream-100">
          <span>New to AVERA? </span>
          <Link to="/register" className="font-bold text-[#800020] hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
}
