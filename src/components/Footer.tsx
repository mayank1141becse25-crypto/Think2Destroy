import React from 'react';
import { 
  Recycle, 
  Leaf, 
  ShieldCheck, 
  Heart, 
  ArrowUp,
  Globe,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                Waste<span className="text-emerald-500">2</span>Wealth
              </span>
            </div>

            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Accelerating the transition from a linear "Take-Make-Waste" economy to an 
              autonomous, decentralized circular value network. Turning urban discards into industrial wealth.
            </p>

            <div className="flex items-center gap-3 pt-2 text-stone-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 text-emerald-400 text-[11px] font-semibold border border-stone-700">
                <Leaf className="w-3.5 h-3.5" />
                Zero-Waste Circular Platform
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Waste Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('calculator')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Value Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('upcycle-lab')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Upcycle Lab & Blueprints
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('locator')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Recycling Locator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  User Activity Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Knowledge & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Circular Knowledge
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('education')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Polymers & Plastics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('education')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Paper & Cellulose Pulp
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('education')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Non-Ferrous Metals & Copper
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('education')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  E-waste & Precious Circuitry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  UN SDG 12 & 13 Impact
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Organization
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  About Our Mission
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <span className="text-stone-500">Terms of Exchange</span>
              </li>
              <li>
                <span className="text-stone-500">Privacy & Traceability</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} Waste2Wealth Initiative. Designed for a resilient circular future.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-emerald-400 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
