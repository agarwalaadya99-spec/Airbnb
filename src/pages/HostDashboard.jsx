import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  Plus,
  Layout,
  Settings,
  MessageCircle,
  Clock,
  Edit3,
  MapPin,
  DollarSign,
  FileText,
  ChevronLeft,
  LayoutGrid,
  Globe,
  Lock,
  Upload,
  CheckCircle2,
  MoreVertical,
  Briefcase,
  ChevronRight,
  Filter,
  Trash2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import SecureCamera from '../components/SecureCamera';
import { getProperties, updatePropertyInStore, fileToBase64 } from '../utils/mockData';
import { uploadImage } from '../utils/supabase';

// --- Sub-Components for Organization ---

const OverviewDashboard = ({ allProperties }) => {
  const totalEarnings = allProperties.reduce((acc, p) => acc + (p.price * 12), 0);
  const trustScore = 88;

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-manrope font-black tracking-tight">Host Overview</h1>
        <p className="text-[#5c3f41] font-medium opacity-60">High-level insights into your portfolio performance.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-gray-100 shadow-sm space-y-4">
          <div className="p-3 bg-airbnb/5 text-airbnb w-fit rounded-2xl"><DollarSign size={20} /></div>
          <div>
            <p className="text-slate-400 font-bold text-[10px] sm:text-sm uppercase tracking-widest">Est. Monthly Earnings</p>
            <h3 className="text-2xl sm:text-3xl font-black">${totalEarnings.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-gray-100 shadow-sm space-y-4">
          <div className="p-3 bg-blue-50 text-blue-600 w-fit rounded-2xl"><ShieldCheck size={20} /></div>
          <div>
            <p className="text-slate-400 font-bold text-[10px] sm:text-sm uppercase tracking-widest">Trust Index</p>
            <h3 className="text-2xl sm:text-3xl font-black">{trustScore}/100</h3>
          </div>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-gray-100 shadow-sm space-y-4">
          <div className="p-3 bg-green-50 text-green-600 w-fit rounded-2xl"><Users size={20} /></div>
          <div>
            <p className="text-slate-400 font-bold text-[10px] sm:text-sm uppercase tracking-widest">Active Bookings</p>
            <h3 className="text-2xl sm:text-3xl font-black">14</h3>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1c1c] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
         <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black font-manrope">Verification Performance</h2>
            <p className="text-white/60 max-w-md text-sm sm:text-base">Properties with 100% verified ground truth see 3.4x higher booking conversion rates.</p>
            <div className="flex items-center gap-4 pt-2">
               <div className="px-4 py-2 bg-white/10 rounded-full text-[12px] font-black border border-white/10 uppercase italic">Experimental</div>
               <span className="text-green-400 font-bold flex items-center gap-1 text-sm">
                  <TrendingUp size={16} /> +22% this week
               </span>
            </div>
         </div>
         <button className="bg-white text-black px-10 py-4 rounded-2xl font-black hover:bg-gray-100 transition-all shadow-xl shadow-white/5 whitespace-nowrap">
            Upgrade All Media
         </button>
      </div>
    </div>
  );
};

const PortfolioSection = ({ allProperties, portfolioView, setPortfolioView, onSelect, onAdd }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-manrope font-black tracking-tight">Your Portfolio</h1>
        <p className="text-[#5c3f41] font-medium opacity-60">Manage all {allProperties.length} listings in one place.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-surface-low p-1 rounded-xl border border-gray-100">
           <button 
            onClick={() => setPortfolioView('grid')}
            className={`p-2 rounded-lg transition-all ${portfolioView === 'grid' ? 'bg-white shadow-sm text-airbnb' : 'text-slate-400'}`}
           >
             <LayoutGrid size={18} />
           </button>
           <button 
            onClick={() => setPortfolioView('list')}
            className={`p-2 rounded-lg transition-all ${portfolioView === 'list' ? 'bg-white shadow-sm text-airbnb' : 'text-slate-400'}`}
           >
             <Layout size={18} />
           </button>
        </div>
        <button 
          onClick={onAdd}
          className="flex-1 sm:flex-initial bg-airbnb text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-airbnb/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-sm"
        >
          <Plus size={18} /> New Listing
        </button>
      </div>
    </header>

    {portfolioView === 'grid' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allProperties.map((p) => {
          const verifiedCount = p.photos.filter(ph => ph.isVerified).length;
          const totalCount = p.photos.length;
          const score = Math.round((verifiedCount / totalCount) * 100);
          return (
            <motion.div 
              key={p.id}
              whileHover={{ y: -8 }}
              onClick={() => onSelect(p.id)}
              className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="aspect-video relative overflow-hidden">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.title} />
                <div className={`absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-[11px] font-black flex items-center gap-2 ${score === 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${score === 100 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  {score}% VERIFIED
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-manrope font-black truncate">{p.title}</h3>
                  <p className="text-slate-400 text-[13px] font-bold flex items-center gap-1">
                    <MapPin size={14} /> {p.location}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[12px] font-bold">
                  <span className={p.allowUnverifiedGuests ? 'text-blue-500' : 'text-airbnb'}>{p.allowUnverifiedGuests ? 'Open Enroll' : 'Verified Only'}</span>
                  <span>${p.price}/night</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    ) : (
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-low border-b border-gray-100">
              <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest">Listing</th>
              <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest">Trust Status</th>
              <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest">Policy</th>
              <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest">Pricing</th>
              <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allProperties.map(p => {
              const score = Math.round((p.photos.filter(ph => ph.isVerified).length / p.photos.length) * 100);
              return (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => onSelect(p.id)}>
                   <td className="p-6">
                      <div className="flex items-center gap-4">
                         <img src={p.image} className="w-12 h-12 rounded-xl object-cover" />
                         <span className="font-bold text-[14px] truncate max-w-[200px]">{p.title}</span>
                      </div>
                   </td>
                   <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${score === 100 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className="text-[13px] font-bold">{score}% Provenance</span>
                      </div>
                   </td>
                   <td className="p-6">
                      <span className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase ${p.allowUnverifiedGuests ? 'bg-blue-50 text-blue-500' : 'bg-airbnb/5 text-airbnb'}`}>
                        {p.allowUnverifiedGuests ? 'Relaxed' : 'Strict'}
                      </span>
                   </td>
                   <td className="p-6 font-bold text-[14px]">${p.price}</td>
                   <td className="p-6 text-slate-300">
                      <button className="p-2 hover:text-airbnb transition-colors"><ChevronRight size={20} /></button>
                   </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const ReservationsList = () => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <header className="space-y-2">
      <h1 className="text-4xl font-manrope font-black tracking-tight">Active Reservations</h1>
      <p className="text-[#5c3f41] font-medium opacity-60">Real-time booking and trust verification stream.</p>
    </header>
    <div className="bg-white rounded-[24px] sm:rounded-[32px] border border-gray-100 shadow-sm p-8 sm:p-10 text-center space-y-4">
       <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-low rounded-full flex items-center justify-center mx-auto text-slate-300"><Clock size={28} /></div>
       <h3 className="text-lg sm:text-xl font-bold">No upcoming guest arrivals</h3>
       <p className="text-slate-400 text-xs sm:text-sm max-w-xs mx-auto">Verified properties typically receive bookings within 48 hours of media authentication.</p>
    </div>
  </div>
);

const GlobalSafetySettings = () => {
  const [allowOnlyVerified, setAllowOnlyVerified] = useState(true);
  const [trustScore, setTrustScore] = useState(80);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h1 className="text-4xl font-manrope font-black tracking-tight">Global Safety</h1>
        <p className="text-[#5c3f41] font-medium opacity-60">Manage defaults and cross-portfolio trust policies.</p>
      </header>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Main Safety Controls */}
          <section className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 text-airbnb mb-2 font-extrabold tracking-widest text-[10px] uppercase">
                  <Shield size={14} /> Trust Requirements
                </div>
                <h3 className="text-[16px] sm:text-[18px] font-extrabold">Allow only verified guests</h3>
                <p className="text-[#5c3f41] text-[14px] leading-relaxed opacity-60">
                  Guests must complete government ID verification and phone authentication before booking.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={allowOnlyVerified} 
                  onChange={() => setAllowOnlyVerified(!allowOnlyVerified)}
                />
                <div className="w-14 h-7 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:inset-s-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-airbnb"></div>
              </label>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h3 className="text-[18px] font-extrabold">Minimum trust score required</h3>
                  <p className="text-[#5c3f41] text-[14px] leading-relaxed opacity-60">
                    Automated threshold based on past host reviews and profile age.
                  </p>
                </div>
                <div className="text-[32px] font-manrope font-extrabold text-airbnb leading-none mb-1">
                  {trustScore}%
                </div>
              </div>
              <div className="space-y-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={trustScore} 
                  onChange={(e) => setTrustScore(e.target.value)}
                  className="w-full h-1.5 bg-surface-low rounded-lg appearance-none cursor-pointer accent-airbnb"
                />
                <div className="flex justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-widest pt-2">
                  <span>Lenient</span>
                  <span>Standard</span>
                  <span>Strict</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-airbnb/5 rounded-3xl border border-airbnb/5 flex gap-4 text-airbnb">
              <ShieldCheck size={24} className="shrink-0" />
              <div className="space-y-1">
                <h4 className="text-[13px] font-extrabold uppercase tracking-wider">Security Optimization</h4>
                <p className="text-[13px] opacity-80 leading-relaxed font-semibold">
                  Higher trust = safer bookings. Your current settings reduce potential risk incidents by an estimated 84%.
                </p>
              </div>
            </div>
          </section>

          {/* Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
               <div className="w-10 h-10 bg-surface-low rounded-xl flex items-center justify-center text-airbnb">
                  <Settings size={20} />
               </div>
               <h4 className="font-extrabold">Essential Tier</h4>
               <p className="text-xs text-slate-400 font-medium">Identity verified via government document matching. Required for all booking requests.</p>
            </div>
            <div className="bg-[#1a1c1c] p-8 rounded-[32px] shadow-xl text-white space-y-4">
               <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-airbnb">
                  <ShieldCheck size={20} />
               </div>
               <h4 className="font-extrabold">Elite Tier</h4>
               <p className="text-xs text-white/40 font-medium">Multiple 5-star host endorsements and background check cleared. Perfect for luxury listings.</p>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-video bg-surface-low">
                 <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-2">
                 <h4 className="font-black text-[15px] sm:text-base">Protecting Your Haven</h4>
                 <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">Verification standards build a community of responsible travelers.</p>
              </div>
           </div>
           <div className="bg-green-50 p-5 sm:p-6 rounded-[20px] sm:rounded-[24px] border border-green-100 flex items-start gap-4">
              <Lock size={20} className="text-green-600 mt-1 shrink-0" />
              <div className="space-y-1">
                 <p className="font-black text-green-800 text-[13px] sm:text-[14px]">Zero-Liability Guarantee</p>
                 <p className="text-[11px] sm:text-[12px] text-green-700/70 font-medium leading-relaxed">
                    Hosting verified guests covers you by Airbnb's $1M policy automatically.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const HostDashboard = () => {
  const navigate = useNavigate();
  
  const location = useLocation();
  const [sidebarTab, setSidebarTab] = useState('portfolio'); 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['overview', 'portfolio', 'reservations', 'safety'].includes(tab)) {
      setSidebarTab(tab);
      setSelectedPropertyId(null);
    }
  }, [location.search]);
  const [portfolioView, setPortfolioView] = useState('grid'); // grid, list
  
  // Data State
  const [allProperties, setAllProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, details, media, policies
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProperties = async () => {
    const data = await getProperties();
    setAllProperties(data);
    if (!selectedPropertyId && data.length > 0) {
      setSelectedPropertyId(data[0].id);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Dynamic get for selected property
  const selectedProperty = allProperties.find(p => p.id === selectedPropertyId) || allProperties[0];
  
  const filteredProperties = allProperties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Bulk Selection State (Future expansion)
  const [selectedBulkIds, setSelectedBulkIds] = useState([]);

  // UI State
  const [showCamera, setShowCamera] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('partial'); // partial, verifying, complete
  
  // Form States (initialized when property is selected)
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [safetySettings, setSafetySettings] = useState(null);

  // Sync details when property changes
  useEffect(() => {
    if (selectedProperty) {
      setPropertyDetails({ 
        title: selectedProperty.title, 
        price: selectedProperty.price, 
        location: selectedProperty.location, 
        description: selectedProperty.description,
        image: selectedProperty.image || ""
      });
      setSafetySettings({ 
        allowUnverifiedGuests: selectedProperty.allowUnverifiedGuests, 
        minTrustScore: selectedProperty.minTrustScore || 75 
      });
    }
  }, [selectedPropertyId, allProperties]);

  // Sync with storage
  useEffect(() => {
    const handleStorageUpdate = async () => {
      await fetchProperties();
    };
    window.addEventListener('storage-update', handleStorageUpdate);
    return () => window.removeEventListener('storage-update', handleStorageUpdate);
  }, []);

  const handleSelectProperty = (id) => {
    setSelectedPropertyId(id);
    setActiveTab('overview');
    window.scrollTo(0, 0);
  };

  const handleUpdateProperty = async (e) => {
    if (e) e.preventDefault();
    setVerificationStatus('verifying');
    
    // Simulate attestation delay for the new details
    setTimeout(async () => {
      const updated = { 
        ...selectedProperty, 
        ...propertyDetails, 
        ...safetySettings
      };
      await updatePropertyInStore(updated);
      setAllProperties(allProperties.map(p => p.id === selectedPropertyId ? updated : p));
      setVerificationStatus('complete');
      
      // Snappy transition back to overview after success
      setTimeout(() => { 
        setVerificationStatus('partial'); 
        setActiveTab('overview'); 
      }, 1000);
    }, 1200);
  };

  const handleCreateListing = async () => {
    const newId = String(Date.now()); // Using timestamp for safer ID generation
    const newProp = {
      id: newId,
      title: "Unnamed Oasis",
      location: "San Francisco, CA",
      price: 350,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      photos: [
        { id: "p1", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop", isVerified: false }
      ],
      allowUnverifiedGuests: true,
      description: "Enter your property description here.",
      rating: 5.0,
      verified: false
    };
    await updatePropertyInStore(newProp);
    setAllProperties([...allProperties, newProp]);
    handleSelectProperty(newId);
    setTimeout(() => setActiveTab('details'), 100); // Auto-focus on Details for immediate editing
  };

  const handleCapture = async (file, meta) => {
    setShowCamera(false);
    setVerificationStatus('verifying');
    
    // Upload to Supabase Storage for persistent cloud hosting
    const fileName = `${selectedPropertyId}/${Date.now()}.jpg`;
    const publicUrl = await uploadImage('provenance-assets', fileName, file);
    
    // Fallback to Base64 if upload fails
    const finalUrl = publicUrl || await fileToBase64(file);
    
    // Snappy anchoring since verification happened in camera
    setTimeout(async () => {
      const newPhoto = { id: `p${Date.now()}`, url: finalUrl, isVerified: true, meta };
      const updated = { ...selectedProperty, photos: [...selectedProperty.photos, newPhoto] };
      await updatePropertyInStore(updated);
      setAllProperties(allProperties.map(p => p.id === selectedPropertyId ? updated : p));
      setVerificationStatus('complete');
      setTimeout(() => setVerificationStatus('partial'), 1500);
    }, 1200);
  };

  const handleDeletePhoto = async (photoId) => {
    const updated = { ...selectedProperty, photos: selectedProperty.photos.filter(p => p.id !== photoId) };
    await updatePropertyInStore(updated);
    setAllProperties(allProperties.map(p => p.id === selectedPropertyId ? updated : p));
  };

  const handleSetPrimary = async (photoUrl) => {
    const updated = { ...selectedProperty, image: photoUrl };
    await updatePropertyInStore(updated);
    setAllProperties(allProperties.map(p => p.id === selectedPropertyId ? updated : p));
  };

  const handleBulkUpload = () => {
    setVerificationStatus('verifying');
    setTimeout(() => {
      const newMedia = [
        { id: `u1`, url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2116&auto=format&fit=crop", isVerified: false },
        { id: `u2`, url: "https://images.unsplash.com/photo-1594901851159-99e54665ca1d?q=80&w=2070&auto=format&fit=crop", isVerified: false }
      ];
      const updated = { ...selectedProperty, photos: [...selectedProperty.photos, ...newMedia] };
      updatePropertyInStore(updated);
      setAllProperties(allProperties.map(p => p.id === selectedPropertyId ? updated : p));
      setVerificationStatus('complete');
      setTimeout(() => setVerificationStatus('partial'), 1500);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-surface font-inter text-[#1a1c1c] flex flex-col pb-20 lg:pb-0">
      <Navbar />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-6 py-3 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          {[
            { id: 'overview', label: 'Home', icon: LayoutGrid },
            { id: 'portfolio', label: 'Listings', icon: Layout },
            { id: 'reservations', label: 'Bookings', icon: Clock },
            { id: 'safety', label: 'Safety', icon: ShieldCheck },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setSidebarTab(item.id); setSelectedPropertyId(null); }}
              className={`flex flex-col items-center gap-1 transition-all ${
                sidebarTab === item.id && !selectedPropertyId ? 'text-airbnb' : 'text-slate-400'
              }`}
            >
              <item.icon size={20} className={sidebarTab === item.id && !selectedPropertyId ? 'scale-110' : ''} />
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Navigation - Desktop only */}
        <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-gray-100 p-6 space-y-8">
          <div className="space-y-1 px-2">
            <h2 className="text-[11px] font-black uppercase text-slate-400 tracking-widest pl-2">Host Suite</h2>
            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Dashboard', icon: LayoutGrid },
                { id: 'portfolio', label: 'My Listings', icon: Layout },
                { id: 'reservations', label: 'Reservations', icon: Clock },
                { id: 'safety', label: 'Global Safety', icon: ShieldCheck },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setSidebarTab(item.id); setSelectedPropertyId(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-[14px] transition-all ${
                    sidebarTab === item.id && !selectedPropertyId ? 'bg-airbnb/5 text-airbnb' : 'text-slate-500 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="mt-auto space-y-4 px-2">
             <div className="bg-airbnb/5 p-4 rounded-2xl space-y-2">
                <p className="text-[12px] font-black text-airbnb uppercase tracking-tighter text-center">Trust Reputation</p>
                <div className="h-1.5 w-full bg-airbnb/10 rounded-full overflow-hidden">
                   <div className="h-full bg-airbnb w-[88%]" />
                </div>
                <p className="text-[10px] text-center font-bold text-airbnb/60">Elite Host Status</p>
             </div>
             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-[14px] text-slate-500 hover:bg-gray-50 transition-all">
                <Settings size={18} /> Settings
             </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 lg:px-10 lg:py-12">
          {selectedPropertyId && selectedProperty ? (
            /* Detailed Listing Management View */
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 animate-in slide-in-from-right-8 duration-500">
              <div className="flex-1 space-y-12">
                <header className="space-y-8">
                  <button onClick={() => setSelectedPropertyId(null)} className="flex items-center gap-2 text-slate-400 font-black text-[13px] uppercase tracking-widest hover:text-airbnb transition-colors">
                    <ChevronLeft size={16} /> Back to {sidebarTab}
                  </button>
                  <div className="space-y-4">
                    <h1 className="text-2xl sm:text-4xl font-manrope font-black tracking-tight">{selectedProperty.title}</h1>
                    <div className="flex items-center gap-1 p-1 bg-surface-low rounded-2xl w-full sm:w-fit border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
                      {[
                        { id: 'overview', label: 'Overview', icon: Layout },
                        { id: 'details', label: 'Details', icon: Edit3 },
                        { id: 'media', label: 'Media', icon: ImageIcon },
                        { id: 'policies', label: 'Policies', icon: Shield }
                      ].map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-extrabold text-[12px] sm:text-[14px] transition-all shrink-0 ${activeTab === tab.id ? 'bg-white text-airbnb shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                          <tab.icon size={14} /> {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </header>

                {activeTab === 'overview' && (
                  <section className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-ambient border border-gray-100 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-center sm:text-left">
                    <div className="relative shrink-0">
                      <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-8 flex items-center justify-center ${selectedProperty.photos.every(p => p.isVerified) ? 'border-green-500' : 'border-airbnb/20'}`}>
                        <span className="text-xl sm:text-2xl font-black">{Math.round((selectedProperty.photos.filter(p => p.isVerified).length / selectedProperty.photos.length) * 100)}%</span>
                      </div>
                      <ShieldCheck size={20} className="absolute -bottom-1 right-0 bg-white p-2 rounded-full shadow-md text-airbnb" />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-xl sm:text-2xl font-black font-manrope">Ground Truth Health</h2>
                      <p className="text-slate-500 text-sm sm:text-base max-w-md">Your listing provenance is currently rated {selectedProperty.photos.every(p => p.isVerified) ? 'Excellent' : 'Needs Improvement'}.</p>
                      <button onClick={() => setActiveTab('media')} className="w-full sm:w-auto bg-airbnb text-white px-8 py-3 rounded-full font-black text-sm sm:text-base">Fix Legacy Media</button>
                    </div>
                  </section>
                )}

                {activeTab === 'details' && (
                  <form onSubmit={handleUpdateProperty} className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-gray-100 shadow-sm space-y-6 sm:space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-[10px] sm:text-[11px] font-black uppercase text-slate-400 tracking-widest pl-2">Title</label>
                        <input type="text" value={propertyDetails.title} onChange={(e) => setPropertyDetails({...propertyDetails, title: e.target.value})} className="w-full bg-surface-low rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-5 sm:px-6 font-bold focus:ring-2 focus:ring-airbnb/20 transition-all outline-none text-sm" placeholder="Property Title" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] sm:text-[11px] font-black uppercase text-slate-400 tracking-widest pl-2">Price ($)</label>
                        <input type="number" value={propertyDetails.price} onChange={(e) => setPropertyDetails({...propertyDetails, price: e.target.value})} className="w-full bg-surface-low rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-5 sm:px-6 font-bold focus:ring-2 focus:ring-airbnb/20 transition-all outline-none text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] sm:text-[11px] font-black uppercase text-slate-400 tracking-widest pl-2">Location</label>
                        <input type="text" value={propertyDetails.location} onChange={(e) => setPropertyDetails({...propertyDetails, location: e.target.value})} className="w-full bg-surface-low rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-5 sm:px-6 font-bold focus:ring-2 focus:ring-airbnb/20 transition-all outline-none text-sm" placeholder="City, Country" />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-[10px] sm:text-[11px] font-black uppercase text-slate-400 tracking-widest pl-2">Description</label>
                        <textarea rows={4} value={propertyDetails.description} onChange={(e) => setPropertyDetails({...propertyDetails, description: e.target.value})} className="w-full bg-surface-low rounded-[20px] sm:rounded-[24px] py-3.5 sm:py-4 px-5 sm:px-6 font-bold focus:ring-2 focus:ring-airbnb/20 transition-all outline-none resize-none text-sm" placeholder="Provide a detailed description of your stay." />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-[10px] sm:text-[11px] font-black uppercase text-slate-400 tracking-widest pl-2">Featured Image URL</label>
                        <input type="text" value={propertyDetails.image} onChange={(e) => setPropertyDetails({...propertyDetails, image: e.target.value})} className="w-full bg-surface-low rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-5 sm:px-6 font-bold focus:ring-2 focus:ring-airbnb/20 transition-all outline-none text-sm" placeholder="https://images.unsplash.com/your-photo" />
                        <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold pl-2 mt-1 uppercase italic">Note: Verified photos can also be set as primary from the Media tab.</p>
                      </div>
                    </div>
                    <button type="submit" className="w-full sm:w-auto bg-airbnb text-white px-10 py-4 rounded-2xl font-black text-sm sm:text-base">Save Changes</button>
                  </form>
                )}

                {activeTab === 'media' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {selectedProperty.photos.map((ph, idx) => (
                      <div key={ph.id || idx} className="aspect-square sm:aspect-4/3 rounded-[24px] sm:rounded-[32px] overflow-hidden relative group shadow-sm border border-gray-100">
                        <img src={ph.url} className="w-full h-full object-cover" />
                        
                        {/* Status Badges */}
                        {ph.isVerified && <div className="absolute top-4 left-4 bg-green-500 text-white p-1 rounded-full"><CheckCircle size={14} /></div>}
                        
                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {ph.isVerified && ph.url !== selectedProperty.image && (
                               <button 
                                 onClick={(e) => { e.stopPropagation(); handleSetPrimary(ph.url); }}
                                 className="bg-white text-airbnb px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-xl hover:scale-105 transition-transform"
                               >
                                 Make Primary
                               </button>
                            )}
                            <div className="flex gap-2">
                                {!ph.isVerified && (
                                   <button onClick={() => setShowCamera(true)} className="bg-airbnb text-white px-4 py-2 rounded-xl text-xs font-black">Verify</button>
                                )}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeletePhoto(ph.id || idx); }}
                                    className="bg-white/90 text-red-500 p-2.5 rounded-xl hover:bg-white transition-all shadow-xl"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setShowCamera(true)} className="aspect-4/3 rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-airbnb hover:text-airbnb transition-all">
                       <Camera size={24} /> <span className="text-xs font-black">Secure Capture</span>
                    </button>
                  </div>
                )}

                {activeTab === 'policies' && (
                  <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                     <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                           <h4 className="font-black text-base sm:text-lg">Verified Guests Only</h4>
                           <p className="text-xs sm:text-sm text-slate-400">Restricts booking to hardware-attested travelers.</p>
                        </div>
                        <button 
                          onClick={() => setSafetySettings({...safetySettings, allowUnverifiedGuests: !safetySettings.allowUnverifiedGuests})}
                          className={`w-14 h-8 shrink-0 rounded-full transition-all relative ${!safetySettings.allowUnverifiedGuests ? 'bg-airbnb' : 'bg-gray-200'}`}
                        >
                           <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${!safetySettings.allowUnverifiedGuests ? 'left-7' : 'left-1'}`} />
                        </button>
                     </div>
                     <button onClick={handleUpdateProperty} className="w-full py-4 bg-[#1a1c1c] text-white rounded-2xl font-black text-sm">Confirm Policy</button>
                  </div>
                )}
              </div>
              <aside className="w-full lg:w-[320px] bg-[#1a1c1c] rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 text-white h-fit">
                <h4 className="text-base sm:text-lg font-black mb-6">Listing Insights</h4>
                <div className="space-y-6">
                   <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <span className="text-xs sm:text-sm opacity-60">Visibility Score</span>
                      <span className="font-black text-green-400">+12%</span>
                   </div>
                   <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <span className="text-xs sm:text-sm opacity-60">Avg. Rating</span>
                      <span className="font-black">{selectedProperty.rating} ★</span>
                   </div>
                </div>
              </aside>
            </div>
          ) : (
            /* Root Sidebar Tabs */
            <div className="max-w-7xl mx-auto">
               {sidebarTab === 'overview' && <OverviewDashboard allProperties={allProperties} />}
               {sidebarTab === 'portfolio' && (
                 <PortfolioSection 
                   allProperties={allProperties} 
                   portfolioView={portfolioView} 
                   setPortfolioView={setPortfolioView}
                   onSelect={handleSelectProperty}
                   onAdd={handleCreateListing}
                 />
               )}
               {sidebarTab === 'reservations' && <ReservationsList />}
               {sidebarTab === 'safety' && <GlobalSafetySettings />}
            </div>
          )}
        </main>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {verificationStatus === 'verifying' && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-[#1a1c1c]/90 backdrop-blur-xl">
             <div className="w-full max-w-[400px] text-center space-y-8">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-20 h-20 border-4 border-airbnb/20 border-t-airbnb rounded-full mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Attesting Metadata</h3>
                  <p className="text-white/40 font-mono text-[11px] uppercase tracking-widest">Digital Provenance Hash Update</p>
                </div>
             </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {verificationStatus === 'complete' && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 z-110 bg-green-500 text-white px-8 py-4 rounded-full font-black shadow-2xl flex items-center gap-3">
            <CheckCircle2 size={24} /> <span>Success: Provenance updated</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCamera && (
          <SecureCamera onCapture={handleCapture} onClose={() => setShowCamera(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HostDashboard;
