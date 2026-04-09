import { Search, Globe, Menu, X, UserCircle, Shield, ArrowRight, Home, Layout, Compass, ShieldCheck, Plus } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Navbar = ({ onListProperty }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Simplified for student project single-view
  const isLanding = location.pathname === '/landing';

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100/50 px-4 sm:px-6 lg:px-12 py-3.5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-4 lg:gap-10">
            <Link to="/" className="flex items-center gap-1 group shrink-0">
              <div className="w-10 h-10 flex items-center justify-center text-airbnb transition-transform group-hover:scale-105">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-current">
                  <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.392 3.415-6.501 3.415-3.48 0-6.358-2.416-6.358-6.479 0-1.135.253-2.185.834-3.513l.186-.423c1.378-2.91 5.922-12.787 7.101-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.232 0-2.203.693-3.269 2.59l-.317.61c-1.396 2.768-5.32 11.233-6.602 14c-.452.977-.665 1.777-.733 2.541l-.014.31a3.994 3.994 0 0 0 .151 1.488l.1.34c.54 1.59 1.83 2.61 3.513 2.61 1.42 0 3.279-1.01 5.09-2.946l.243-.264.442-.489a2 2 0 0 1 2.793.003l.443.486.242.261c1.811 1.933 3.67 2.943 5.09 2.943 1.684 0 2.913-1.02 3.514-2.61l.1-.34a4.017 4.017 0 0 0 .151-1.488l-.014-.31c-.068-.764-.281-1.564-.733-2.541-1.282-2.767-5.206-11.232-6.602-14l-.317-.61C18.203 3.693 17.232 3 16 3zm.001 10.5c1.933 0 3.5 1.567 3.5 3.5s-1.567 3.5-3.5 3.5-3.5-1.567-3.5-3.5 1.567-3.5 3.5-3.5zm0 2c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5z" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight font-manrope text-airbnb">airbnb</span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {/* List Property - New Main Call to Action */}
            <button 
              onClick={onListProperty}
              className="hidden sm:flex items-center gap-2 bg-airbnb text-white px-6 py-2.5 rounded-full text-[14px] font-black hover:bg-airbnb-hover transition-all shadow-lg shadow-airbnb/20 active:scale-95 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" />
              List Property
            </button>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 px-3 py-1.5 border border-gray-200 rounded-full hover:shadow-sm transition-shadow bg-white active:scale-95"
            >
              <Menu size={16} />
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 hidden sm:block">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" alt="User Profile" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Simplified Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[280px] bg-white shadow-2xl p-8 flex flex-col gap-8"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-black font-manrope text-airbnb">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <button 
                  onClick={() => { onListProperty(); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl font-black text-[16px] bg-airbnb text-white shadow-lg"
                >
                  <Plus size={22} /> List Property
                </button>
                <Link 
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl font-bold text-[16px] text-[#1a1c1c] hover:bg-gray-50"
                >
                  <Home size={22} /> Explore
                </Link>
                {/* Legacy Dashboard (Hidden from UI but code preserved) */}
                {/* 
                <Link to="/host" className="..."> ... </Link> 
                */}
              </div>

              <div className="mt-auto">
                 <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-[24px]">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                       <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <p className="font-extrabold">Aadya Agarwal</p>
                       <p className="text-[11px] font-bold text-slate-400 uppercase">Student Project</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
