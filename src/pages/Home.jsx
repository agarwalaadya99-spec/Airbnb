import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { getProperties, categories } from '../utils/mockData';
import { 
  Search, SlidersHorizontal, ChevronRight, ChevronLeft, 
  Star, Heart, Map, List, Stars, Mountain, 
  Palmtree, Waves, Castle, Home as HomeIcon, Triangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
  Stars,
  Mountain,
  Palmtree,
  Waves,
  Castle,
  Home: HomeIcon,
  Triangle
};

const Home = () => {
  const [activeProperties, setActiveProperties] = useState(getProperties());
  const [activeCategory, setActiveCategory] = useState('icons');

  // Sync with storage updates from Host Dashboard
  useEffect(() => {
    const handleStorageUpdate = () => {
      setActiveProperties(getProperties());
    };
    window.addEventListener('storage-update', handleStorageUpdate);
    return () => window.removeEventListener('storage-update', handleStorageUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-24">
      <Navbar />

      {/* Categories Bar */}
      <div className="sticky top-[80px] sm:top-[100px] z-40 bg-white border-b border-gray-100/50 flex items-center justify-between px-4 sm:px-6 lg:px-12 py-2 gap-4">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-2 flex-1 scroll-smooth">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Stars;
            const isActive = activeCategory === cat.id;
            
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center gap-2 group transition-all shrink-0 relative pb-3 mt-2`}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110 text-[#222222]' : 'text-[#717171] group-hover:text-[#222222]'}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[12px] font-semibold whitespace-nowrap transition-colors ${
                  isActive ? 'text-[#222222]' : 'text-[#717171] group-hover:text-[#222222]'
                }`}>
                  {cat.name}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#222222]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <button className="hidden md:flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl font-bold text-[12px] hover:border-[#222222] hover:bg-gray-50 transition-all bg-white">
            <SlidersHorizontal size={14} />
            Filters
          </button>
          <div className="hidden lg:flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl font-bold text-[12px] bg-white opacity-50 cursor-not-allowed">
            Display total before taxes
            <div className="w-8 h-4 bg-gray-200 rounded-full relative">
               <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
        
        {/* Featured Icon Section (Editorial Asymmetry) */}
        <section className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full aspect-[21/9] sm:aspect-[16/6] rounded-[32px] overflow-hidden group cursor-pointer bg-gray-100 shadow-xl"
          >
            <img 
              src="/forest.png" 
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              alt="Icon Experience"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 sm:p-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-white/20">
                    Featured Icon
                  </span>
                </div>
                <h2 className="text-white text-[32px] sm:text-[56px] font-manrope font-extrabold leading-[1.1] mb-6 max-w-[600px] drop-shadow-2xl">
                  Stay in a floating geometric forest.
                </h2>
                <button className="w-fit bg-white text-[#222222] px-8 py-4 rounded-2xl font-extrabold text-[16px] hover:scale-105 transition-all shadow-2xl active:scale-[0.98]">
                  Live the experience
                </button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 gap-y-12">
          {activeProperties
            .filter(p => !activeCategory || activeCategory === 'all' || p.category?.toLowerCase() === activeCategory.toLowerCase() || (activeCategory === 'icons' && p.category === 'Icons'))
            .map((p, idx) => (
              <PropertyCard key={p.id} property={p} index={idx} />
            ))
          }
          {/* Fill the grid with curated, unique aesthetic listings */}
          {[
            { id: 'f1', title: 'Mountain Hideaway', location: 'Aspen, Colorado', price: 890, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200', rating: 4.95, distance: '850 miles away' },
            { id: 'f2', title: 'Modernist Retreat', location: 'Austin, Texas', price: 320, image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200', rating: 4.88, distance: '1,200 miles away' },
            { id: 'f3', title: 'Nordic Cabin', location: 'Lofoten, Norway', price: 550, image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200', rating: 5.0, distance: '4,500 miles away' },
            { id: 'f4', title: 'Zen Sanctuary', location: 'Kyoto, Japan', price: 720, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200', rating: 4.97, distance: '6,200 miles away' },
            { id: 'f5', title: 'Desert Oasis', location: 'Palm Springs, California', price: 410, image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200', rating: 4.92, distance: '105 miles away' },
            { id: 'f6', title: 'Architectural Cube', location: 'Berlin, Germany', price: 280, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200', rating: 4.85, distance: '5,100 miles away' },
            { id: 'f7', title: 'Lakeside Minimalist', location: 'Lake Como, Italy', price: 1500, image: 'https://images.unsplash.com/photo-1512918766671-ad6507962077?q=80&w=1200', rating: 4.99, distance: '5,800 miles away' },
            { id: 'f8', title: 'Concrete Loft', location: 'London, UK', price: 450, image: 'https://images.unsplash.com/photo-1502117859338-fd9daa518a9a?q=80&w=1200', rating: 4.91, distance: '4,900 miles away' }
          ].map((p, idx) => (
            <PropertyCard key={p.id} property={{...p, verified: idx % 3 === 0}} index={idx + 4} />
          ))}
        </div>
      </main>

      {/* Floating Map/List Toggle */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <button className="bg-[#222222] text-white flex items-center gap-2 px-6 py-4 rounded-full font-bold text-[14px] shadow-2xl hover:scale-105 transition-all active:scale-[0.95] group">
          Show map 
          <Map size={18} className="group-hover:rotate-12 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
};

export default Home;
