import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Settings, 
  MessageCircle, 
  Home, 
  List, 
  ShieldCheck, 
  ChevronRight, 
  LineChart, 
  Lock, 
  CheckCircle2,
  Bell,
  HelpCircle
} from 'lucide-react';

const HostSafetySettings = () => {
  const navigate = useNavigate();
  const [allowOnlyVerified, setAllowOnlyVerified] = useState(true);
  const [trustScore, setTrustScore] = useState(80);

  const sidebarItems = [
    { icon: Home, label: 'My Properties', active: false },
    { icon: List, label: 'Booking Rules', active: false },
    { icon: Shield, label: 'Safety & Trust', active: true },
    { icon: MessageCircle, label: 'Messages', active: false },
  ];

  return (
    <div className="bg-surface font-inter text-[#1a1c1c] min-h-screen">
      {/* TopAppBar - Fixed */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-transparent">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <span 
              onClick={() => navigate('/')} 
              className="text-2xl font-black text-airbnb tracking-tighter font-manrope cursor-pointer"
            >
              Airbnb
            </span>
            <nav className="hidden md:flex items-center gap-6">
              <a className="font-manrope font-bold tracking-tight text-slate-500 hover:text-slate-900 transition-colors" href="#">Properties</a>
              <a className="font-manrope font-bold tracking-tight text-airbnb border-b-2 border-airbnb pb-1" href="#">Safety</a>
              <a className="font-manrope font-bold tracking-tight text-slate-500 hover:text-slate-900 transition-colors" href="#">Account</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <Bell size={24} />
            </button>
            <button className="p-2 text-slate-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <HelpCircle size={24} />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-container">
              <img 
                alt="User profile avatar" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQLAdqJpSQ7IZ5MvjGY9tSqLOfwFtEh1ebALYhQWwabdjAg3ncg-xEJtcTtlklubLDoswqWa8DYQkvAEJRPaSKChygk2J540HbPYBP1u7IAMw-PsBQTwHMVGWKhB_rIZ9rZ8W4D0vuriItGEc2O_kJaT7VZdjfnsq9rVazRDMQYW9oZLsEjTpff64_xjO2M-KBsunRoVAnxFQHV9lpEgM8HgG5xSWjGUihWHIR1c6Ryo5wmb8CJgDUq9HM_yBWv8HmrHfeRDVxbKg"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="pt-28 flex max-w-7xl mx-auto px-6 h-full min-h-[calc(100vh-112px)]">
        {/* Sidebar */}
        <aside className="w-[280px] shrink-0 border-r border-surface-container pr-8 py-8 space-y-8 hidden md:block">
           <div className="space-y-2">
              <h2 className="text-[14px] font-extrabold text-airbnb uppercase tracking-[0.2em] mb-6">Host Portal</h2>
              <nav className="space-y-1">
                {sidebarItems.map((item, idx) => (
                  <button 
                    key={idx}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                      item.active ? 'bg-white shadow-sm text-airbnb border border-surface-low' : 'text-slate-500 hover:bg-slate-100/50'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
           </div>

           <div className="pt-[100px] space-y-4">
              <div className="bg-white p-6 rounded-[24px] border border-surface-container shadow-sm space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Host Safety Score</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '92%' }}
                        className="h-full bg-green-500 rounded-full"
                       />
                    </div>
                    <span className="text-[13px] font-extrabold">92%</span>
                 </div>
                 <button className="w-full py-2.5 bg-surface-low text-[13px] font-extrabold rounded-lg hover:bg-slate-200 transition-colors">
                    View Safety Score
                 </button>
              </div>
           </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-8 lg:px-16 py-8">
           <div className="max-w-[800px] space-y-12">
              <div className="space-y-2">
                <h1 className="text-4xl font-manrope font-extrabold tracking-tight">Guest Verification Settings</h1>
                <p className="text-[#5c3f41] text-[18px] opacity-70 leading-relaxed font-medium">
                  Configure how Airbnb filters potential guests to ensure your property remains secure and respected.
                </p>
              </div>

              {/* Trust Requirements Section */}
              <section className="bg-white p-10 rounded-[40px] shadow-sm border border-surface-low space-y-10">
                 <div className="flex items-center justify-between gap-8">
                    <div className="space-y-1 flex-1">
                       <div className="flex items-center gap-2 text-airbnb mb-2 font-extrabold tracking-widest text-[11px] uppercase">
                          <Shield size={16} /> Trust Requirements
                       </div>
                       <h3 className="text-[18px] font-extrabold">Allow only verified guests</h3>
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
                             Automated threshold based on past host reviews, payment history, and profile age.
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

                 <div className="p-6 bg-[#fbf4f5] rounded-3xl border border-airbnb/5 flex gap-4">
                    <LineChart className="text-airbnb mt-1 shrink-0" size={20} />
                    <div className="space-y-1">
                       <h4 className="text-[13px] font-extrabold text-airbnb uppercase tracking-wider">Security Optimization</h4>
                       <p className="text-[13px] text-[#920029] opacity-80 leading-relaxed font-semibold">
                          Higher trust = safer bookings. Your current settings reduce potential risk incidents by an estimated 84%.
                       </p>
                    </div>
                 </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-surface-low p-8 rounded-[32px] space-y-4 group hover:bg-white tonal-card border border-transparent hover:border-surface-container">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-airbnb">
                       <Settings size={20} />
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-[18px] font-extrabold">Essential Tier</h4>
                       <p className="text-[14px] text-[#5c3f41] opacity-60 leading-relaxed">
                          Identity verified via government document matching. Required for all booking requests.
                       </p>
                    </div>
                 </div>
                 <div className="bg-surface-low p-8 rounded-[32px] space-y-4 group hover:bg-white tonal-card border border-transparent hover:border-surface-container">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-airbnb">
                       <ShieldCheck size={20} />
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-[18px] font-extrabold">Elite Tier</h4>
                       <p className="text-[14px] text-[#5c3f41] opacity-60 leading-relaxed">
                          Multiple 5-star host endorsements and background check cleared. Perfect for luxury listings.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </main>

        {/* Right Sidebar - Info Cards */}
        <aside className="w-[340px] pt-8 space-y-8 hidden lg:block">
           <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-surface-container">
              <div className="aspect-4/3 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=340" 
                  className="w-full h-full object-cover"
                  alt="Protection"
                />
              </div>
              <div className="p-8 space-y-4">
                 <h4 className="text-[20px] font-manrope font-extrabold tracking-tight">Protecting Your Haven</h4>
                 <p className="text-[14px] text-[#5c3f41] opacity-70 leading-relaxed font-medium">
                    Setting strict verification standards doesn't just protect your property—it builds a community of responsible travelers.
                 </p>
                 <button className="flex items-center gap-2 text-airbnb font-extrabold text-[13px] group">
                    Learn about our safety protocols
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>

           <div className="bg-[#1a1c1c] rounded-[32px] p-8 space-y-6 text-white shadow-xl">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                 <Lock size={24} className="text-white" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-[20px] font-manrope font-extrabold tracking-tight">Zero-Liability Guarantee</h4>
                 <p className="text-[14px] text-white/60 leading-relaxed font-medium">
                    When only verified guests are hosted, you're covered by Airbnb's $1M protection policy automatically.
                 </p>
              </div>
              <div className="flex items-center gap-2 text-white font-extrabold text-[13px]">
                 <CheckCircle2 size={16} className="text-green-400" />
                 Active for all current properties
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default HostSafetySettings;
