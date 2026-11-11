import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, ShieldCheck, Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#241E18] text-[#E8D5BC] pt-14 pb-8 border-t border-[#302820]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Col (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E8D5BC]">
                <img
                  src="/images/avera-logo.jpg"
                  alt="AVERA Seal"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-2xl tracking-[0.2em] uppercase font-bold text-white">
                  AVERA
                </span>
                <p className="text-[10px] tracking-[0.25em] text-[#C59B27] uppercase">
                  Handwoven from the Heart of Bharat
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
              Dedicated to celebrating India's finest handloom weaving heritage. From the Ghats of Varanasi to the temple corridors of Kanchipuram, every saree is an enduring story of artisanship.
            </p>

            <div className="pt-2 text-xs text-gray-300 space-y-1.5">
              <p className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                <span>SK-128 Shastri Nagar, Ghaziabad</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                <span>Concierge: <a href="tel:+919625047510" className="hover:text-white transition">+91 96250 47510</a> (Mon-Sat, 10am-7pm IST)</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                <span>Email: <a href="mailto:averasaree@gmail.com" className="hover:text-white transition">averasaree@gmail.com</a></span>
              </p>
              <p className="flex items-center space-x-2">
                <Instagram className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                <span>
                  Instagram:{' '}
                  <a
                    href="https://www.instagram.com/avera.premiumethnic?mdxt=MTBhd3UyeDlwMXM3aQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition underline-offset-2 hover:underline"
                  >
                    @avera.premiumethnic
                  </a>
                </span>
              </p>
            </div>
          </div>

          {/* Saree Collections */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-wider text-white font-semibold mb-3 border-b border-[#C59B27]/40 pb-1 inline-block">
              Weaves & Fabrics
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><Link to="/shop?category=banarasi-sarees" className="hover:text-white transition">Banarasi Katan Silk</Link></li>
              <li><Link to="/shop?category=kanjivaram-silk-sarees" className="hover:text-white transition">Kanjivaram Silk</Link></li>
              <li><Link to="/shop?category=chanderi-sarees" className="hover:text-white transition">Chanderi Tissue</Link></li>
              <li><Link to="/shop?category=organza-sarees" className="hover:text-white transition">Hand-Painted Organza</Link></li>
              <li><Link to="/shop?category=cotton-sarees" className="hover:text-white transition">Bengal Jamdani Cotton</Link></li>
              <li><Link to="/shop?category=bridal-sarees" className="hover:text-white transition">Bridal Trousseau Edit</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-wider text-white font-semibold mb-3 border-b border-[#C59B27]/40 pb-1 inline-block">
              Assistance
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><Link to="/our-story" className="hover:text-white text-[#C59B27] font-medium transition">Our Story</Link></li>
              <li><Link to="/order-tracking" className="hover:text-white transition">Track Your Shipment</Link></li>
              <li><Link to="/shop" className="hover:text-white transition">Shipping & Delivery Policy</Link></li>
              <li><Link to="/shop" className="hover:text-white transition">7-Day Easy Returns</Link></li>
              <li><Link to="/shop" className="hover:text-white transition">Silk Saree Care Guide</Link></li>
              <li><Link to="/account" className="hover:text-white transition">Customer Account</Link></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-wider text-white font-semibold mb-2 border-b border-[#C59B27]/40 pb-1 inline-block">
              The AVERA Gazette
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Receive private invitations to bridal trunk shows and preview new loom drops.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                required
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#C59B27]"
              />
              <button
                type="submit"
                className="w-full bg-[#800020] hover:bg-[#66001A] text-[#E8D5BC] text-xs uppercase tracking-wider font-semibold py-2 rounded transition shadow-md"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>

            {/* Social Follow */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 block mb-2 font-medium">Follow Us</span>
              <a
                href="https://www.instagram.com/avera.premiumethnic?mdxt=MTBhd3UyeDlwMXM3aQ=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @avera.premiumethnic"
                className="inline-flex items-center space-x-2 text-xs text-gray-300 hover:text-white group"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[1.5px] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-[#241E18] rounded-full flex items-center justify-center">
                    <Instagram className="w-3.5 h-3.5 text-[#E8D5BC] group-hover:text-white" />
                  </div>
                </div>
                <span className="text-[11px] tracking-wide group-hover:text-[#C59B27] transition-colors">@avera.premiumethnic</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright & badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-3">
          <p>© {new Date().getFullYear()} AVERA Luxury Sarees. Handcrafted with reverence in India.</p>
          <div className="flex items-center space-x-3 text-gray-300">
            <a
              href="https://www.instagram.com/avera.premiumethnic?mdxt=MTBhd3UyeDlwMXM3aQ=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-400 hover:text-[#C59B27] transition-colors flex items-center gap-1"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
            <span>•</span>
            <span>Razorpay Verified</span>
            <span>•</span>
            <span>UPI & Net Banking</span>
            <span>•</span>
            <span>Cash on Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
