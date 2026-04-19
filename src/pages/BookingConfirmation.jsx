import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
   CheckCircle,
   Wifi,
   Waves,
   MapPin,
   Download,
   Calendar,
   ShieldCheck,
   Bell,
   HelpCircle,
   Map as MapIcon
} from 'lucide-react';

const BookingConfirmation = () => {
   const navigate = useNavigate();

   return (
      <div className="bg-surface font-inter text-[#1a1c1c] min-h-screen">
         {/* TopAppBar - Fixed */}
         <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
            <div className="flex justify-between items-center w-full px-4 sm:px-6 py-4 max-w-7xl mx-auto">
               <div className="flex items-center gap-4 sm:gap-8">
                  <span
                     onClick={() => navigate('/')}
                     className="text-xl sm:text-2xl font-black text-airbnb tracking-tighter font-manrope cursor-pointer"
                  >
                     Airbnb
                  </span>
               </div>
               <div className="flex items-center gap-2 sm:gap-4">
                  <button className="p-2 text-slate-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">
                     <Bell size={20} />
                  </button>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gray-100">
                     <img
                        alt="User profile avatar"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                     />
                  </div>
               </div>
            </div>
         </header>

         <main className="pt-24 sm:pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16">
               <div className="lg:col-span-7 space-y-8 sm:space-y-12">
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="space-y-4"
                  >
                     <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-[11px] sm:text-[13px] font-extrabold uppercase tracking-widest">
                        <CheckCircle size={14} fill="currentColor" fillOpacity={0.1} />
                        Booking Confirmed
                     </div>
                     <h1 className="text-4xl sm:text-5xl md:text-6xl font-manrope font-extrabold tracking-tight text-[#1a1c1c] leading-[1.1]">
                        Your stay is booked!
                     </h1>
                     <p className="text-[16px] sm:text-[18px] text-[#5c3f41] max-w-[500px] font-medium opacity-80 leading-relaxed">
                        Everything is set for your upcoming trip to the coast. We've sent the receipt to your email.
                     </p>
                  </motion.div>

                  <section className="bg-white rounded-xl shadow-sm border border-[#e5bdbe]/5 overflow-hidden">
                     <div className="p-8 space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-surface-low">
                           <div className="flex items-center gap-4">
                              <img
                                 src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                                 className="w-14 h-14 rounded-full object-cover shadow-sm"
                                 alt="Guest"
                              />
                              <div>
                                 <span className="block text-[10px] font-extrabold text-[#5c3f41] uppercase tracking-widest mb-1">Guest Details</span>
                                 <span className="text-[18px] font-extrabold text-[#1a1c1c]">Aadya Agarwal</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 bg-surface-low px-3 py-1 rounded-full">
                              <ShieldCheck size={14} className="text-[#006a45]" />
                              <span className="text-[12px] font-extrabold text-[#006a45]">Identity Verified</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                           <div className="space-y-1">
                              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Dates</span>
                              <div className="flex items-center gap-2 font-bold text-[#1a1c1c]">
                                 <Calendar size={16} />
                                 <span>Oct 12 – Oct 15</span>
                              </div>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Booking ID</span>
                              <div className="font-bold text-[#1a1c1c]">HS-9921-XPR</div>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Total</span>
                              <div className="text-[20px] font-black text-airbnb">₹1,245.00</div>
                           </div>
                        </div>
                     </div>
                  </section>

                  <div className="bg-white/50 border border-transparent rounded-2xl p-6 flex items-center gap-4 bg-linear-to-r from-surface to-white">
                     <div className="p-3 bg-airbnb/10 rounded-2xl text-airbnb">
                        <ShieldCheck size={28} />
                     </div>
                     <div>
                        <h4 className="font-extrabold text-[16px]">Secure Verified Booking</h4>
                        <p className="text-[14px] text-[#5c3f41]">All guests verified for safety and trust via Secure Enclave protocols.</p>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                     <button className="flex-1 px-8 py-4 bg-airbnb text-white rounded-full font-extrabold text-[15px] sm:text-[16px] shadow-lg shadow-airbnb/20 hover:scale-105 transition-all">
                        Manage Trip
                     </button>
                     <button className="flex-1 px-8 py-4 bg-slate-100 text-[#1a1c1c] rounded-full font-extrabold text-[15px] sm:text-[16px] hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                        <Download size={18} />
                        Download PDF
                     </button>
                  </div>
               </div>

               <div className="lg:col-span-5">
                  <div className="bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-ambient p-2">
                     <div className="relative rounded-t-[20px] sm:rounded-t-[28px] overflow-hidden aspect-video sm:aspect-4/3">
                        <img
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFS1R_O_C0fzC2p1ADXz7iHZexG0x-2xvD-pO4eG6RnsZe-wXlmmQXsZ6AKrGcH6PzNvhe2DNxnZnZ9p5vlKmO7lrkJqvyaZ5-X34LR75LcM_LSILLmxZ_ma7Nv0MWWh9VFEeeWuovjpXowSps6opN96OqyTtsd407x61U4H7GICGp-5YcVgWl7rqhkMxPEfH3vxh2Zoj-AWG3Ityg_hf_G2Jopo_cFAG-pn1Wq0lruoJS_vFq64D9isR_sw7B1x6J-WqRhOlTceg"
                           className="w-full h-full object-cover"
                           alt="Property"
                        />
                        <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold">
                           The Coastal Retreat
                        </div>
                        <div className="absolute bottom-4 left-4 flex gap-2">
                           <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1.5 text-[11px] font-bold">
                              <MapPin size={12} className="text-airbnb" /> Malibu, California
                           </div>
                        </div>
                     </div>

                     <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-surface-low p-4 rounded-xl flex flex-col items-center gap-2 text-center group hover:bg-airbnb/5 transition-colors">
                              <Wifi size={24} className="text-slate-400 group-hover:text-airbnb" />
                              <span className="text-[12px] font-extrabold">Fast Wi-Fi</span>
                           </div>
                           <div className="bg-surface-low p-4 rounded-xl flex flex-col items-center gap-2 text-center group hover:bg-airbnb/5 transition-colors">
                              <Waves size={24} className="text-slate-400 group-hover:text-airbnb" />
                              <span className="text-[12px] font-extrabold">Private Pool</span>
                           </div>
                        </div>

                        <div className="space-y-4 pt-2">
                           <div className="flex justify-between items-center text-[14px]">
                              <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Check-in</span>
                              <span className="font-bold">3:00 PM, Oct 12</span>
                           </div>
                           <div className="flex justify-between items-center text-[14px]">
                              <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Check-out</span>
                              <span className="font-bold">11:00 AM, Oct 15</span>
                           </div>
                        </div>

                        <div className="relative rounded-xl overflow-hidden h-32 bg-slate-100 group">
                           <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                              <MapIcon size={48} className="opacity-20 translate-y-2 group-hover:scale-110 transition-transform" />
                           </div>
                           <div className="absolute inset-0 bg-linear-to-t from-slate-200/50 to-transparent" />
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-airbnb rounded-full border-2 border-white shadow-lg animate-bounce" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
};

export default BookingConfirmation;
