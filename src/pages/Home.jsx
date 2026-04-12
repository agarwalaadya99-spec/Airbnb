import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { getProperties, categories } from '../utils/mockData';
import { 
  Search, SlidersHorizontal, ChevronRight, ChevronLeft, 
  Star, Heart, Map, List, Stars, Mountain, 
  Palmtree, Waves, Castle, Home as HomeIcon, Triangle, Globe 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import ListPropertyModal from '../components/ListPropertyModal';

const iconMap = {
  Stars,
  Mountain,
  Palmtree,
  Waves,
  Castle,
  Home: HomeIcon,
  Triangle,
  Globe
};

const Home = () => {
  const [activeProperties, setActiveProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    const data = await getProperties();
    setActiveProperties(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Sync with storage updates from Host Dashboard or Modal
  useEffect(() => {
    const handleStorageUpdate = async () => {
      await fetchProperties();
    };
    window.addEventListener('storage-update', handleStorageUpdate);
    return () => window.removeEventListener('storage-update', handleStorageUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-24">
      <Navbar onListProperty={() => setIsListModalOpen(true)} />

      <ListPropertyModal 
        isOpen={isListModalOpen} 
        onClose={() => setIsListModalOpen(false)} 
        onRefresh={fetchProperties}
      />

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
        


        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10 sm:gap-y-12">
          {activeProperties
            .filter(p => !activeCategory || activeCategory === 'all' || p.category?.toLowerCase() === activeCategory.toLowerCase())
            .map((p, idx) => (
              <PropertyCard key={p.id} property={p} index={idx} />
            ))
          }
        </div>
      </main>

      {/* Floating Map/List Toggle */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden md:block"
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
