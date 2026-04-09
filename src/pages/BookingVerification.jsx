import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  HelpCircle, 
  MapPin, 
  Calendar, 
  Users, 
  Info as InfoIcon, 
  ShieldCheck, 
  CheckCircle2, 
  CheckCircle,
  AlertTriangle, 
  User, 
  Plus, 
  ChevronRight as ChevronRightIcon, 
  Shield, 
  X 
} from 'lucide-react';
import { getProperties, mockVerifiedUsers } from '../utils/mockData';

const BookingVerification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Local state for property to handle host updates
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchProperty = async () => {
    const all = await getProperties();
    const found = all.find(p => p.id === id) || all[0];
    setProperty(found);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);
  
  // Sync with storage updates
  useEffect(() => {
    const handleStorageUpdate = async () => {
      await fetchProperty();
    };
    window.addEventListener('storage-update', handleStorageUpdate);
    return () => window.removeEventListener('storage-update', handleStorageUpdate);
  }, [id]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [partyMembers, setPartyMembers] = useState([
    { 
      id: "guest_1", 
      name: "Aadya Agarwal", 
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      verified: true 
    }
  ]);
  const [showUnverifiedWarning, setShowUnverifiedWarning] = useState(false);

  if (loading || !property) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-airbnb border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    const filtered = mockVerifiedUsers.filter(u => 
      u.name.toLowerCase().includes(term.toLowerCase()) && 
      !partyMembers.some(m => m.id === u.id)
    );
    setSearchResults(filtered);
  };

  const addMember = (user) => {
    setPartyMembers([...partyMembers, user]);
    setSearchTerm('');
    setSearchResults([]);
    setShowModal(false);
  };

  const removeMember = (id) => {
    if (partyMembers.length === 1) return; // Keep at least one guest
    setPartyMembers(partyMembers.filter(m => m.id !== id));
  };

  const handleConfirm = () => {
    const hasUnverified = partyMembers.some(m => !m.verified);
    if (!property.allowUnverifiedGuests && hasUnverified) {
      setShowUnverifiedWarning(true);
      return;
    }
    navigate('/booking-confirmation');
  };

  return (
    <div className="bg-surface font-inter text-[#1a1c1c] min-h-screen">
      <Navbar />

      <main className="pt-20 sm:pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Property & Details */}
          <div className="lg:col-span-7 space-y-8 sm:y-12">
            {/* Property Summary Card */}
            <section className="bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-video w-full relative">
                <img 
                   alt={property.title} 
                   className="w-full h-full object-cover" 
                   src={property.image} 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest text-airbnb uppercase border border-white/20 shadow-lg">Verified Listing</span>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-manrope font-black tracking-tight text-[#1a1c1c] mb-2">{property.title}</h1>
                    <p className="text-[#5c3f41] flex items-center gap-2 text-[14px] font-medium opacity-70">
                      <MapPin size={16} />
                      {property.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-manrope font-black text-airbnb">${property.price}<span className="text-sm font-normal text-[#5c3f41]">/night</span></p>
                  </div>
                </div>
              </div>
            </section>

            {/* Selectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <label className="text-[10px] font-black tracking-widest text-[#5c3f41] uppercase opacity-50">Stay Dates</label>
                <div className="flex items-center gap-3 text-[#1a1c1c] font-extrabold">
                  <Calendar size={18} className="text-airbnb" />
                  <span>Oct 15 - Oct 20</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <label className="text-[10px] font-black tracking-widest text-[#5c3f41] uppercase opacity-50">Travelers</label>
                <div className="flex items-center gap-3 text-[#1a1c1c] font-extrabold">
                  <Users size={18} className="text-airbnb" />
                  <span>2 Guests</span>
                </div>
              </div>
            </div>

            {/* Guest Verification Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${property.allowUnverifiedGuests ? 'bg-blue-50 text-blue-600' : 'bg-airbnb/5 text-airbnb'}`}>
                    <Shield size={24} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-[17px] font-manrope font-black tracking-tight">Host Verification Policy</h2>
                    <p className="text-[13px] text-slate-500 font-medium">
                      {property.allowUnverifiedGuests 
                        ? "This host allows unverified guests." 
                        : "Strict Policy: Only verified Airbnb members may stay."}
                    </p>
                  </div>
                </div>
                {!property.allowUnverifiedGuests && (
                  <div className="bg-airbnb text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Strict</div>
                )}
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input 
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-airbnb/5 focus:border-airbnb outline-none transition-all placeholder:text-slate-300 font-medium text-[15px] shadow-sm" 
                    placeholder="Search by Airbnb ID or Name" 
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden"
                      >
                        {searchResults.map(user => (
                          <button 
                            key={user.id}
                            onClick={() => addMember(user)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                          >
                            <div className="flex items-center gap-4 text-left">
                              <img src={user.avatar} className="w-10 h-10 rounded-full border border-gray-100" />
                              <div>
                                <p className="font-black text-[14px]">{user.name}</p>
                                <p className="text-[11px] text-slate-400 font-medium">{user.level}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {user.verified && <ShieldCheck size={16} className="text-blue-500" />}
                              <Plus size={16} className="text-airbnb" />
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {partyMembers.map((member) => (
                  <div 
                    key={member.id}
                    className={`p-6 rounded-[24px] border flex items-center justify-between group transition-all ${
                      member.verified ? 'bg-white border-gray-100 hover:shadow-md' : 'bg-orange-50/30 border-orange-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center ${!member.verified ? 'bg-white' : ''}`}>
                          {member.avatar ? (
                            <img alt={member.name} src={member.avatar} />
                          ) : (
                            <User size={28} className="text-orange-300" />
                          )}
                        </div>
                        {member.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                            <ShieldCheck size={18} className="text-blue-500" fill="currentColor" fillOpacity={0.1} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-[16px] text-[#1a1c1c]">{member.name}</p>
                        {member.verified ? (
                          <p className="text-[13px] text-green-600 font-extrabold flex items-center gap-1">
                            <CheckCircle2 size={14} />
                            Verified Identity
                          </p>
                        ) : (
                          <p className="text-[13px] text-orange-600 font-extrabold flex items-center gap-1">
                            <AlertTriangle size={14} />
                            Unverified Guest
                          </p>
                        )}
                      </div>
                    </div>
                    {partyMembers.length > 1 && (
                      <button 
                        onClick={() => removeMember(member.id)}
                        className="text-slate-300 hover:text-airbnb transition-colors p-2"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-center gap-2 py-5 rounded-[24px] border-2 border-dashed border-gray-200 text-slate-400 font-black text-[15px] hover:border-airbnb hover:text-airbnb hover:bg-airbnb/5 transition-all group"
              >
                <Plus size={20} className="group-hover:scale-125 transition-transform" />
                Add Verified Traveler
              </button>
            </section>
          </div>

          <div className="lg:col-span-5">
             <div className="bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-ambient p-2">
                <div className="relative rounded-t-[20px] sm:rounded-t-[28px] overflow-hidden aspect-video sm:aspect-video">
                <h3 className="text-[24px] font-manrope font-black mb-8 tracking-tight">Reservation Breakdown</h3>
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between text-[#5c3f41] font-medium">
                    <span>₹{property.price} × 5 nights</span>
                    <span className="font-black text-[#1a1c1c]">₹{property.price * 5}</span>
                  </div>
                  <div className="flex justify-between text-[#5c3f41] font-medium">
                    <span>Airbnb Service Fee</span>
                    <span className="font-black text-[#1a1c1c]">₹140</span>
                  </div>
                  <div className="flex justify-between text-[#5c3f41] font-medium">
                    <span>Cleaning & Sanitization</span>
                    <span className="font-black text-[#1a1c1c]">₹85</span>
                  </div>
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[20px] font-manrope font-black">Total (INR)</span>
                    <span className="text-[28px] font-manrope font-black text-airbnb tracking-tighter">₹{property.price * 5 + 225}</span>
                  </div>
                </div>
                <button 
                  onClick={handleConfirm}
                  className="w-full bg-linear-to-r from-airbnb to-airbnb-hover text-white py-5 rounded-[20px] font-manrope font-black text-[18px] shadow-xl shadow-airbnb/20 active:scale-95 hover:scale-[1.02] transition-all"
                >
                  Confirm & Reserve
                </button>
                <p className="text-center text-[12px] text-slate-400 mt-6 italic font-medium">Ground Truth verification active for this stay.</p>
              </div>
              
              <div className="bg-green-50/50 p-6 rounded-[24px] border border-green-100 flex items-start gap-4">
                <ShieldCheck size={24} className="text-green-600 mt-1" />
                <div className="space-y-1">
                  <p className="font-black text-green-800 text-[14px]">Airbnb Protected</p>
                  <p className="text-[12px] text-green-700/70 font-medium leading-relaxed">
                    Every interaction is secured by cryptographic provenance and hardware-attested identity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Verification Warning Modal */}
      <AnimatePresence>
        {showUnverifiedWarning && (
           <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-[#1a1c1c]/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden p-8 space-y-6 text-center"
            >
               <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                 <AlertTriangle size={32} />
               </div>
               <div className="space-y-2">
                 <h3 className="text-[20px] font-manrope font-black tracking-tight">Trust Level Mismatch</h3>
                 <p className="text-[14px] text-slate-500 leading-relaxed font-medium">
                   This host requires **Verified Identity** for all guests. One or more party members lack a hardware-attested trust record.
                 </p>
               </div>
               <button 
                onClick={() => setShowUnverifiedWarning(false)}
                className="w-full py-4 bg-airbnb text-white rounded-2xl font-black text-[15px] shadow-lg shadow-airbnb/20 transition-all hover:scale-[1.02] active:scale-95"
               >
                 Review Party
               </button>
            </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* Add Verified Guest Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-[#1a1c1c]/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="p-10 space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-[24px] font-manrope font-black tracking-tight">Add Trust Member</h3>
                  <p className="text-slate-400 text-[14px] font-medium">Search for existing verified travelers.</p>
                </div>
                
                <div className="bg-slate-50 p-8 rounded-[32px] flex flex-col items-center text-center space-y-6 border border-gray-100">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img 
                        alt="Profile" 
                        src={mockVerifiedUsers[0].avatar}
                      />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-md">
                      <ShieldCheck size={20} className="text-blue-500" fill="currentColor" fillOpacity={0.1} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[20px] font-black">{mockVerifiedUsers[0].name}</p>
                    <p className="text-[13px] text-slate-400 font-bold uppercase tracking-widest mt-1">{mockVerifiedUsers[0].level}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100">
                     <div className="flex items-center gap-1.5 text-airbnb">
                        <CheckCircle size={14} fill="currentColor" fillOpacity={0.1} />
                        <span className="text-[12px] font-extrabold uppercase tracking-widest">Verified Provenance Assets</span>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="py-4 bg-white border border-gray-200 text-slate-500 font-black rounded-2xl hover:bg-gray-50 transition-all text-[15px]"
                  >
                    Dismiss
                  </button>
                  <button 
                    onClick={() => addMember(mockVerifiedUsers[0])}
                    className="py-4 bg-linear-to-r from-airbnb to-airbnb-hover text-white font-black rounded-2xl shadow-lg shadow-airbnb/20 hover:opacity-90 transition-all text-[15px]"
                  >
                    Add Member
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingVerification;
