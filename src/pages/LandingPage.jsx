import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProperties, mockVerifiedUsers } from '../utils/mockData';
import { motion } from 'framer-motion';
import { Shield, Sparkles, User, Home, ArrowRight, CheckCircle, Globe, Lock } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'guest',
      title: 'Explore as Guest',
      desc: 'Browse high-fidelity listings with blockchain-verified media and real-time provenance tracking.',
      icon: User,
      color: 'bg-airbnb',
      path: '/explore',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      tag: 'Trust-First Booking'
    },
    {
      id: 'host',
      title: 'Manage as Host',
      desc: 'Protect your listing from AI manipulation. Use Secure Enclave captures to prove your property is real.',
      icon: Home,
      color: 'bg-[#1a1c1c]',
      path: '/host', // Linked to the new Host Dashboard
      image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=1200',
      tag: 'Digital Provenance Tools'
    }
  ];

  return (
    <div className="min-h-screen bg-surface font-inter text-[#1a1c1c] overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-airbnb/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-24 min-h-screen flex flex-col justify-center">
        <div className="space-y-4 mb-12 lg:mb-16 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-[11px] sm:text-[13px] font-extrabold text-airbnb uppercase tracking-widest"
          >
            <Shield size={14} fill="currentColor" fillOpacity={0.1} />
            Airbnb Trust Core v2.0
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-manrope font-black tracking-tight leading-[1.1] lg:leading-[1.05]"
          >
            A Future Built on <br />
            <span className="text-airbnb">Verifiable Truth</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[15px] sm:text-[18px] lg:text-[20px] text-[#5c3f41] max-w-[600px] font-medium opacity-80"
          >
            Eliminating AI-generated listing fraud through multi-layered hardware attestation and digital provenance. Choose your perspective to begin.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {roles.map((role, idx) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, x: idx === 0 ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1, type: "spring", damping: 20 }}
              onClick={() => navigate(role.path)}
              className="group relative h-[400px] lg:h-[500px] rounded-[48px] overflow-hidden cursor-pointer shadow-ambient hover:shadow-2xl transition-all duration-700"
            >
              {/* Image Layer */}
              <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
                <img src={role.image} alt={role.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
              </div>

              {/* Content Layer */}
              <div className="absolute inset-x-0 bottom-0 p-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${role.color} p-3 rounded-2xl shadow-xl shadow-black/20`}>
                      <role.icon className="text-white" size={24} />
                    </div>
                    <span className="text-white/80 text-[12px] font-extrabold uppercase tracking-widest">{role.tag}</span>
                  </div>
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1a1c1c]"
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-[32px] lg:text-[40px] font-manrope font-black text-white leading-tight">{role.title}</h2>
                  <p className="text-white/70 text-[15px] lg:text-[16px] leading-relaxed font-medium max-w-[400px]">
                    {role.desc}
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <div className="flex items-center gap-2 text-white/40 text-[11px] font-extrabold uppercase">
                    <CheckCircle size={14} className="text-green-400" /> C2PA Compliant
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-[11px] font-extrabold uppercase">
                    <Lock size={14} className="text-blue-400" /> Secure Enclave
                  </div>
                </div>
              </div>

              {/* Border glow on hover */}
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-[48px] transition-colors duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Technical Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 sm:mt-24 pt-8 border-t border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-8 text-[10px] sm:text-[12px] font-bold text-slate-400 uppercase tracking-widest text-center"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2"><Globe size={14} /> Distributed Ledger Hash: 0x82...AF21</div>
            <div className="flex items-center gap-2 text-airbnb"><Sparkles size={14} /> AI Sentiment Score: 0.998</div>
          </div>
          <div className="flex items-center gap-1.5 opacity-60">
            Powered by Airbnb Digital Provenance Parser
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;
