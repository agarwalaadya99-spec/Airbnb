import { Search, Globe, Menu, UserCircle, Shield, ArrowRight, Home, Layout, Compass } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHost = location.pathname.startsWith('/host');
  const isExplore = location.pathname === '/explore';
  const isLanding = location.pathname === '/';

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100/50 px-4 sm:px-6 lg:px-12 py-3.5">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-1 group shrink-0">
            <div className="w-10 h-10 flex items-center justify-center text-airbnb transition-transform group-hover:scale-105">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-current">
                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.392 3.415-6.501 3.415-3.48 0-6.358-2.416-6.358-6.479 0-1.135.253-2.185.834-3.513l.186-.423c1.378-2.91 5.922-12.787 7.101-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.232 0-2.203.693-3.269 2.59l-.317.61c-1.396 2.768-5.32 11.233-6.602 14c-.452.977-.665 1.777-.733 2.541l-.014.31a3.994 3.994 0 0 0 .151 1.488l.1.34c.54 1.59 1.83 2.61 3.513 2.61 1.42 0 3.279-1.01 5.09-2.946l.243-.264.442-.489a2 2 0 0 1 2.793.003l.443.486.242.261c1.811 1.933 3.67 2.943 5.09 2.943 1.684 0 2.913-1.02 3.514-2.61l.1-.34a4.017 4.017 0 0 0 .151-1.488l-.014-.31c-.068-.764-.281-1.564-.733-2.541-1.282-2.767-5.206-11.232-6.602-14l-.317-.61C18.203 3.693 17.232 3 16 3zm.001 10.5c1.933 0 3.5 1.567 3.5 3.5s-1.567 3.5-3.5 3.5-3.5-1.567-3.5-3.5 1.567-3.5 3.5-3.5zm0 2c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight font-manrope text-airbnb">airbnb</span>
          </Link>
          
          {/* Main Navigation (Context Aware) */}
          <nav className="hidden md:flex items-center bg-gray-50 border border-gray-100 p-1 rounded-2xl">
             <Link 
              to="/explore" 
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[14px] font-bold transition-all ${
                !isHost && !isLanding ? 'bg-white text-[#222222] shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Compass size={18} /> Explore
            </Link>
            <Link 
              to="/host" 
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[14px] font-bold transition-all ${
                isHost ? 'bg-[#1a1c1c] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Layout size={18} /> Dashboard
            </Link>
          </nav>
        </div>

        {/* Global Mode Toggle (Search area alternative) */}
        {!isLanding && (
          <div className="hidden lg:flex items-center bg-white shadow-ambient border border-gray-100 rounded-full p-1.5 gap-1 cursor-pointer">
            <button 
              onClick={() => navigate('/explore')}
              className={`px-6 py-2.5 rounded-full text-[13px] font-extrabold uppercase tracking-widest transition-all ${
                !isHost ? 'bg-airbnb text-white shadow-lg shadow-airbnb/20' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              Guest Mode
            </button>
            <button 
              onClick={() => navigate('/host')}
              className={`px-6 py-2.5 rounded-full text-[13px] font-extrabold uppercase tracking-widest transition-all ${
                isHost ? 'bg-[#1a1c1c] text-white shadow-lg shadow-black/20' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              Host Mode
            </button>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <Link 
            to="/host?tab=safety" 
            className={`hidden sm:flex items-center gap-2 text-[14px] font-bold px-5 py-2.5 border rounded-full transition-all ${
              location.pathname === '/host' && new URLSearchParams(location.search).get('tab') === 'safety'
                ? 'bg-airbnb/5 border-airbnb/20 text-airbnb' 
                : 'border-transparent hover:bg-gray-50 text-slate-700'
            }`}
          >
            Safety Settings
          </Link>
          <button className="flex items-center gap-3 px-3 py-1.5 border border-gray-200 rounded-full hover:shadow-sm transition-shadow bg-white">
            <Menu size={16} />
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100">
               <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" alt="User Profile" />
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
