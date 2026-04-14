import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Upload, Camera, Shield, CheckCircle, AlertTriangle, 
  Info, MapPin, FileText, Sparkles, Zap, 
  ChevronRight, ArrowLeft, Loader2, Binary, Fingerprint, Search, Plus, IndianRupee
} from 'lucide-react';
import { extractMetadata } from '../utils/forensics';
import { updatePropertyInStore } from '../utils/mockData';
import SecureCamera from './SecureCamera';

const ListPropertyModal = ({ isOpen, onClose, onRefresh }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
    type: 'Entire Home',
    images: [],
    forensicReport: null
  });

  // Reset state when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setLoading(false);
      setScanning(false);
      setShowCamera(false);
      setFormData({
        title: '',
        location: '',
        price: '',
        description: '',
        type: 'Entire Home',
        images: [],
        forensicReport: null
      });
    }
  }, [isOpen]);

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file) => {
    setScanning(true);
    setLoading(true);
    
    try {
      // Simulate forensic scanning delay for UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const report = await extractMetadata(file);
      
      // Upload to Supabase Storage for a real public URL
      let imageUrl = null;
      try {
        const { uploadImage } = await import('../utils/supabase');
        const filePath = `listings/${Date.now()}_${file.name}`;
        imageUrl = await uploadImage('property-photos', filePath, file);
        console.log('✅ File upload to Supabase Storage:', imageUrl);
      } catch (uploadErr) {
        console.warn('⚠️ Supabase Storage upload failed, using object URL:', uploadErr);
      }
      
      // Fallback to local object URL if storage fails
      if (!imageUrl) {
        imageUrl = URL.createObjectURL(file);
      }

      setFormData(prev => ({
        ...prev,
        images: [imageUrl],
        forensicReport: report,
        _uploadedFile: file  // Keep file reference in case we need it
      }));
      setScanning(false);
      setLoading(false);
      setStep(3);
    } catch (error) {
      console.error('Forensic analysis failed:', error);
      setScanning(false);
      setLoading(false);
    }
  };

  const onCapture = async (file, report) => {
    // Upload file to Supabase Storage for a real public URL
    let imageUrl = null;
    try {
      const { uploadImage } = await import('../utils/supabase');
      const filePath = `listings/secure-capture-${Date.now()}.jpg`;
      imageUrl = await uploadImage('property-photos', filePath, file);
      console.log('✅ Secure capture uploaded to Supabase Storage:', imageUrl);
    } catch (uploadErr) {
      console.warn('⚠️ Supabase Storage upload failed:', uploadErr);
    }
    
    if (!imageUrl) {
      imageUrl = URL.createObjectURL(file);
    }

    setFormData(prev => ({
      ...prev,
      images: [imageUrl],
      forensicReport: report
    }));
    setShowCamera(false);
    setStep(3);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const newProperty = {
      id: Date.now().toString(),
      title: formData.title,
      location: formData.location,
      price: formData.price,
      rating: 5.0,
      image: formData.images[0],
      verified: formData.forensicReport?.aiConfidence < 30, // Strict threshold for main badge
      forensics: formData.forensicReport,
      photos: [
        {
          id: `p-${Date.now()}`,
          url: formData.images[0],
          isVerified: formData.forensicReport?.aiConfidence < 50,
          meta: formData.forensicReport
        }
      ]
    };

    await updatePropertyInStore(newProperty);
    
    setTimeout(() => {
      setLoading(false);
      onRefresh();
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-slate-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-airbnb/10 rounded-2xl flex items-center justify-center text-airbnb">
                <Shield size={20} fill="currentColor" fillOpacity={0.2} />
              </div>
              <div>
                <h2 className="text-xl font-black font-manrope tracking-tight">Verifiable Listing</h2>
                <div className="flex gap-2 mt-0.5">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-6 bg-airbnb' : 'w-2 bg-slate-100'}`} />
                  ))}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1">Property Title</label>
                    <div className="relative group">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-airbnb transition-colors" size={18} />
                      <input 
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g. Modern Glass Villa in Bali"
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-airbnb/20 focus:bg-white outline-none rounded-2xl py-4 pl-12 pr-4 font-bold transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-airbnb transition-colors" size={18} />
                      <input 
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Uluwatu, Indonesia"
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-airbnb/20 focus:bg-white outline-none rounded-2xl py-4 pl-12 pr-4 font-bold transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1">Price per Night</label>
                    <div className="relative group">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-airbnb transition-colors" size={18} />
                      <input 
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="450"
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-airbnb/20 focus:bg-white outline-none rounded-2xl py-4 pl-12 pr-4 font-bold transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1">Property Type</label>
                    <select 
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-airbnb/20 focus:bg-white outline-none rounded-2xl py-4 px-6 font-bold transition-all appearance-none cursor-pointer"
                    >
                      <option>Entire Home</option>
                      <option>Private Room</option>
                      <option>Luxury Estate</option>
                      <option>Tiny Home</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell guests about your space..."
                    rows={4}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-airbnb/20 focus:bg-white outline-none rounded-3xl py-4 px-6 font-bold transition-all resize-none"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-black font-manrope">Visual Evidence</h3>
                  <p className="text-slate-400 font-medium">Capture or upload photos. Our AI forensic engine will verify authenticity.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
                  <button 
                    onClick={() => setShowCamera(true)}
                    className="flex-1 group relative overflow-hidden bg-slate-900 rounded-[32px] p-8 text-white transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/20"
                  >
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Camera size={32} />
                      </div>
                      <div className="text-center">
                        <p className="font-black text-lg">Secure Capture</p>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Hardware Attested</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="flex-1 group relative overflow-hidden bg-white border-2 border-slate-100 rounded-[32px] p-8 transition-all hover:border-airbnb/40 hover:scale-[1.02] active:scale-95"
                  >
                    <input 
                       type="file" 
                       ref={fileInputRef} 
                       className="hidden" 
                       accept="image/*"
                       onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                    />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-airbnb/5 transition-colors">
                        <Upload size={32} className="text-slate-400 group-hover:text-airbnb transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="font-black text-lg">Upload Media</p>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Forensic Scan</p>
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && formData.forensicReport && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Image Preview */}
                  <div className="w-full lg:w-1/2 aspect-square rounded-[32px] overflow-hidden relative shadow-inner">
                    <img src={formData.images[0]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                        <Binary size={14} /> Provenance Node: {formData.forensicReport?.timestamp?.substring(0, 10)}
                      </div>
                    </div>
                  </div>

                  {/* Forensic Report Card */}
                  <div className="flex-1 space-y-6">
                    <div className={`p-6 rounded-[32px] border-2 ${formData.forensicReport.aiColor === 'red' ? 'bg-red-50 border-red-100' : formData.forensicReport.aiColor === 'yellow' ? 'bg-amber-50 border-amber-100' : 'bg-green-50 border-green-100'}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${formData.forensicReport.aiColor === 'red' ? 'text-red-500' : formData.forensicReport.aiColor === 'yellow' ? 'text-amber-600' : 'text-green-600'}`}>
                            Forensic Verdict
                          </p>
                          <h4 className="text-xl font-black">{formData.forensicReport.aiDetection}</h4>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${formData.forensicReport.aiColor === 'red' ? 'bg-red-500 text-white' : formData.forensicReport.aiColor === 'yellow' ? 'bg-amber-500 text-white' : 'bg-green-600 text-white'}`}>
                          {formData.forensicReport.aiColor === 'red' ? <AlertTriangle size={24} /> : formData.forensicReport.aiColor === 'yellow' ? <Zap size={24} /> : <Shield size={24} />}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm font-bold">
                          <span>AI Signal Confidence</span>
                          <span>{formData.forensicReport.aiConfidence}%</span>
                        </div>
                        <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${formData.forensicReport.aiConfidence}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full ${formData.forensicReport.aiColor === 'red' ? 'bg-red-500' : formData.forensicReport.aiColor === 'yellow' ? 'bg-amber-500' : 'bg-green-600'}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Fingerprint size={14} /> Detector Signal Logic
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {formData.forensicReport.aiSignals?.map((signal, idx) => (
                           <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50"
                           >
                             <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{signal.label}</p>
                             <p className="text-sm font-bold truncate">{signal.value}</p>
                           </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-3xl space-y-3">
                       <p className="text-[10px] font-black uppercase text-white/30 tracking-widest flex items-center gap-2">
                          <Search size={12} /> Hardware Metadata
                       </p>
                       <div className="grid grid-cols-2 gap-y-2 text-[12px]">
                          <div className="text-white/40 font-bold">Device</div>
                          <div className="text-white font-black text-right">{formData.forensicReport.sourceDevice}</div>
                          <div className="text-white/40 font-bold">Resolution</div>
                          <div className="text-white font-black text-right">{formData.forensicReport.resolution}</div>
                          <div className="text-white/40 font-bold">Timestamp</div>
                          <div className="text-white font-black text-right">{formData.forensicReport.timestamp?.substring(0, 16)}</div>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
            {step > 1 && (
              <button 
                onClick={() => setStep(prev => prev - 1)}
                className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-slate-900 transition-colors"
                disabled={loading}
              >
                <ArrowLeft size={18} /> Back
              </button>
            )}
            <div className="flex-1" />
            
            {step < 3 ? (
              <button 
                disabled={step === 1 && (!formData.title || !formData.price)}
                onClick={() => setStep(prev => prev + 1)}
                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[14px] font-black hover:bg-black transition-all disabled:opacity-20 disabled:scale-95 active:scale-95"
              >
                Next Step <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                disabled={loading}
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-airbnb text-white px-10 py-3.5 rounded-2xl text-[14px] font-black hover:bg-airbnb-hover transition-all active:scale-95 shadow-xl shadow-airbnb/20 overflow-hidden relative"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>Create Verified Listing <Sparkles size={18} /></>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Camera Modal Overlay */}
      {showCamera && (
        <div className="fixed inset-0 z-[200]">
           <SecureCamera onCapture={onCapture} onClose={() => setShowCamera(false)} />
        </div>
      )}

      {/* Scanning Overlay */}
      <AnimatePresence>
        {scanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-slate-900/80 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="relative mb-8">
               <motion.div 
                  className="w-48 h-48 border-4 border-airbnb rounded-[40px] relative overflow-hidden"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
               >
                  <motion.div 
                    initial={{ top: '-10%' }}
                    animate={{ top: '110%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-airbnb shadow-[0_0_20px_#ff385c]"
                  />
                  <div className="absolute inset-0 bg-airbnb/5 flex items-center justify-center">
                    <Fingerprint className="text-airbnb animate-pulse" size={64} />
                  </div>
               </motion.div>
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Forensic Neural Analysis</h3>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest max-w-sm">
              Analyzing pixel-level heuristics and binary signatures for AI generation signals...
            </p>
            <div className="mt-8 flex gap-3">
               {[1, 2, 3].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-airbnb rounded-full"
                  />
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default ListPropertyModal;
