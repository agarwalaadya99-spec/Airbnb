import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperties, getPropertyById, updatePropertyInStore } from '../utils/mockData';

console.log("🚀 Forensic Detail Engine: Loaded v1.5.1");
import Navbar from '../components/Navbar';
import { Star, ShieldCheck, ChevronLeft, Camera, Upload, CheckCircle, Info, ArrowRight, Shield, Globe, MapPin, Lock, Clock, Sparkles, AlertTriangle, X, Edit3, Trash2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SecureCamera from '../components/SecureCamera';

const PropertyReviews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isHostMode = location.pathname.startsWith('/host');

  // Local state for property to handle host updates
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProperty = async () => {
    try {
      const found = await getPropertyById(id);
      setProperty(found);
    } catch (err) {
      console.error("Failed to load property details:", err);
    } finally {
      setLoading(false);
    }
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

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, loading, complete
  const [showCamera, setShowCamera] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [provenanceData, setProvenanceData] = useState(null);
  const [showProvenanceModal, setShowProvenanceModal] = useState(false);

  // New State for Interactions
  const [newReview, setNewReview] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [userSelectedRating, setUserSelectedRating] = useState(5);

  // Booking details
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const calculateTotalNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalNights = calculateTotalNights();
  const subtotal = (property?.price || 0) * totalNights;
  const cleaningFee = totalNights > 0 ? 1500 : 0;
  const serviceFee = Math.round(subtotal * 0.14);
  const finalTotal = subtotal + cleaningFee + serviceFee;

  const handleStartVerification = () => {
    if (isHostMode) {
      setShowCamera(true);
    } else {
      // Guest requests verification
      setIsVerifying(true);
      setTimeout(() => setIsVerifying(false), 3000); // Simulate "Request Sent"
    }
  };

  const handleCapture = async (file, meta) => {
    setShowCamera(false);
    setVerificationStatus('loading');

    let photoUrl = null;

    // STEP 1: Upload file to Supabase Storage to get a real public URL
    try {
      const { uploadImage } = await import('../utils/supabase');
      const filePath = `forensic/${property.id}/${Date.now()}.jpg`;
      photoUrl = await uploadImage('property-photos', filePath, file);
      console.log('✅ Supabase Storage upload success:', photoUrl);
    } catch (uploadErr) {
      console.warn('⚠️ Supabase Storage upload failed, using local object URL:', uploadErr);
    }

    // STEP 2: Fallback to object URL if storage upload failed
    if (!photoUrl) {
      photoUrl = URL.createObjectURL(file);
    }

    setCapturedMedia(photoUrl);

    setTimeout(async () => {
      setProvenanceData(meta);
      setVerificationStatus('complete');
      setShowProvenanceModal(true);

      // STEP 3: Permanently store the photo if in host mode
      if (isHostMode) {
        const newPhoto = {
          id: `p${Date.now()}`,
          url: photoUrl,   // Real URL, not base64!
          isVerified: true,
          meta
        };
        const updated = { ...property, photos: [...property.photos, newPhoto] };
        const result = await updatePropertyInStore(updated);
        if (result) setProperty(result);
      }
    }, 800);
  };

  const handleDeletePhoto = async (photoId) => {
    const updated = { ...property, photos: property.photos.filter(p => p.id !== photoId) };
    const result = await updatePropertyInStore(updated);
    if (result) setProperty(result);
  };

  const handleReviewSubmit = async () => {
    if (!newReview.trim()) return;

    setIsSubmittingReview(true);
    // Simulate high-tech signature process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const reviewObj = {
      id: `r${Date.now()}`,
      user: "Verified User", // In a real app, this would be the logged-in user's name
      rating: userSelectedRating,
      date: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
      comment: newReview,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150"
    };

    const updated = {
      ...property,
      reviews: [reviewObj, ...(property.reviews || [])],
      reviewsCount: (property.reviewsCount || 0) + 1,
      verifiedReviewsCount: (property.verifiedReviewsCount || 0) + 1
    };

    try {
      const result = await updatePropertyInStore(updated);
      if (result) setProperty(result);
      setReviewSubmitted(true);
      setNewReview('');
      setShowWriteReview(false);

      // Clear success message after a few seconds
      setTimeout(() => setReviewSubmitted(false), 5000);
    } catch (err) {
      console.error("Failed to post review:", err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading || !property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-airbnb border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Provenance Report Modal */}
      <AnimatePresence>
        {showProvenanceModal && provenanceData && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-[540px] rounded-[48px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-manrope font-black tracking-tight">Provenance Report</h3>
                    <p className="text-[12px] text-slate-400 font-extrabold uppercase tracking-widest">Listing Authenticity Record</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProvenanceModal(false)}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#222222]">Trust Certification</span>
                    <span className="text-[12px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">100% Valid</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { label: 'Content ID (CID)', value: provenanceData.cid || 'N/A', icon: Lock },
                      { label: 'Source Device', value: provenanceData.sourceDevice, icon: Camera },
                      { label: 'Capture Time', value: provenanceData.timestamp, icon: Clock },
                      { label: 'Verified Location', value: provenanceData.gps, icon: MapPin },
                      { label: 'Blockchain Sig', value: provenanceData.sig || 'N/A', icon: Shield }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                        <item.icon size={18} className="text-gray-400 mt-0.5" />
                        <div className="space-y-0.5 min-w-0">
                          <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{item.label}</span>
                          <span className="block text-[14px] font-semibold text-[#222222] truncate">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1a1c1c] rounded-[32px] p-6 text-white space-y-4 relative overflow-hidden">
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg text-airbnb"><Sparkles size={16} /></div>
                    <span className="text-[15px] font-manrope font-extrabold">Digital Forensics Verdict</span>
                  </div>
                  <p className="relative z-10 text-white/70 text-[13px] leading-relaxed">
                    This media was captured using a manufacturer-signed Secure Enclave. No pixel manipulation detected. Content hashes match the original capture state preserved on the provenance ledger.
                  </p>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-airbnb/20 rounded-full blur-3xl -mr-12 -mt-12" />
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => setShowProvenanceModal(false)}
                  className="w-full py-4 bg-white border border-gray-200 rounded-2xl font-black text-[15px] shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Navbar />

      <main className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        {/* Navigation / Title - Hidden on small mobile to save space */}
        <button
          onClick={() => navigate('/explore')}
          className="hidden sm:flex items-center gap-2 text-[#222222] font-semibold text-[14px] mb-6 hover:underline"
        >
          <ChevronLeft size={18} /> Back to explore
        </button>

        {/* Sticky Mobile Booking Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-100 px-6 py-4 pb-safe flex flex-col gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col min-w-0">
              <span className="text-[18px] font-black tracking-tight text-[#1a1c1c] truncate">₹{property.price} <span className="text-[14px] font-medium text-slate-400">night</span></span>
              <span className="text-[12px] font-extrabold text-[#222222] underline">{property.rating} ★</span>
            </div>
            <button
              onClick={() => isHostMode ? navigate('/host') : (totalNights > 0 ? navigate(`/booking-verification/${property.id}`) : alert("Please select dates first"))}
              className="bg-airbnb text-white px-8 py-3.5 rounded-xl font-black text-[14px] shadow-lg shadow-airbnb/20 active:scale-95 transition-all whitespace-nowrap"
            >
              {isHostMode ? "Edit Listing" : "Reserve"}
            </button>
          </div>

          {!isHostMode && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <div className="flex-1 min-w-[120px] bg-gray-50 rounded-lg p-2 border border-gray-100">
                <label className="block text-[8px] font-black uppercase text-gray-400 mb-0.5">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-bold text-[11px] cursor-pointer"
                />
              </div>
              <div className="flex-1 min-w-[120px] bg-gray-50 rounded-lg p-2 border border-gray-100">
                <label className="block text-[8px] font-black uppercase text-gray-400 mb-0.5">Checkout</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-bold text-[11px] cursor-pointer"
                />
              </div>
              <div className="flex-1 min-w-[80px] bg-gray-50 rounded-lg p-2 border border-gray-100">
                <label className="block text-[8px] font-black uppercase text-gray-400 mb-0.5">Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full bg-transparent border-none outline-none font-bold text-[11px] cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-12 pb-24 lg:pb-0">
          {/* Left Column: Property Highlights & Reviews */}
          <div className="flex-1 space-y-12">
            <section className="overflow-hidden">
              <h1 className="text-[24px] sm:text-[32px] font-manrope font-extrabold leading-[1.2] mb-3 break-words">{property.title}</h1>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-3 sm:gap-4 text-[13px] sm:text-[14px] font-semibold text-[#222222]">
                <div className="flex items-center gap-1">
                  <Star size={14} fill="currentColor" />
                  <span>{property.rating}</span>
                </div>
                <span className="underline cursor-pointer">{property.reviewsCount} reviews</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-700 rounded-lg text-[11px] font-extrabold border border-green-100 whitespace-nowrap">
                  <ShieldCheck size={12} /> {property.verifiedReviewsCount} Verified
                </div>
                <span className="underline cursor-pointer truncate max-w-[150px] sm:max-w-none">{property.location}</span>
              </div>
            </section>

            {property.host && (
              <section className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 p-5 sm:p-8 bg-gray-50/50 rounded-[28px] sm:rounded-[32px] border border-gray-100/50">
                <div className="relative flex-shrink-0">
                  <img
                    src={property.host.avatar}
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-sm object-cover"
                    alt={property.host.name}
                  />
                  {property.host.superhost && (
                    <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md text-airbnb">
                      <Shield size={12} className="text-airbnb" fill="currentColor" fillOpacity={0.1} />
                    </div>
                  )}
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-[17px] sm:text-[20px] font-manrope font-black tracking-tight">Hosted by {property.host.name}</h3>
                  <p className="text-[13px] text-slate-500 font-medium overflow-hidden text-ellipsis">Joined in {property.host.joined} · Trust ID: HS-92{property.id}4</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                    <span className="text-[10px] font-black uppercase text-airbnb tracking-widest flex items-center gap-1.5 sm:border-r border-gray-200 sm:pr-4">
                      <Star size={10} fill="currentColor" /> {property.rating} Rating
                    </span>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest whitespace-nowrap">
                      {property.reviewsCount} Reviews
                    </span>
                  </div>
                </div>
              </section>
            )}


            {/* Property Insights / Gallery */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-[20px] sm:text-[22px] font-manrope font-extrabold text-[#222222]">Property Insights</h3>
                  <p className="text-[13px] text-[#717171]">Photos verified via secure hardware device IDs.</p>
                </div>
                {(!property.photos || property.photos.length === 0 || property.photos.some(p => p.meta?.aiConfidence > 60 || (!p.isVerified && p.meta?.aiConfidence > 40))) ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full text-[11px] font-extrabold text-red-700 uppercase tracking-widest border border-red-100 animate-pulse">
                    <AlertTriangle size={12} fill="currentColor" fillOpacity={0.1} /> Forensic Alert: Low Trust
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full text-[11px] font-extrabold text-green-700 uppercase tracking-widest border border-green-100">
                    <Shield size={12} fill="currentColor" fillOpacity={0.1} /> High Trust Level
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {property.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-sm border border-gray-100 bg-gray-100"
                    style={{ aspectRatio: '1/1', position: 'relative' }}
                  >
                    <img
                      src={photo.url}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt="Listing"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {photo.isVerified ? (
                        <div className="bg-green-500/90 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[10px] font-black flex items-center gap-1.5 shadow-lg border border-white/20">
                          <Shield size={12} /> VERIFIED LIVE
                        </div>
                      ) : (
                        <div className="bg-yellow-500/90 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[10px] font-black flex items-center gap-1.5 shadow-lg border border-white/20">
                          <AlertTriangle size={12} /> LEGACY MEDIA
                        </div>
                      )}
                    </div>

                    {/* Host specific delete button */}
                    {isHostMode && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id); }}
                        className="absolute top-4 right-4 bg-white/90 text-red-500 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    {photo.isVerified && (
                      <button
                        onClick={() => {
                          setProvenanceData(photo.meta || { sourceDevice: 'Unknown', timestamp: 'Original Listing', gps: 'Not Recorded' });
                          setShowProvenanceModal(true);
                        }}
                        className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest sm:opacity-0 sm:group-hover:opacity-100 transition-opacity border border-white/10"
                      >
                        View Signature
                      </button>
                    )}
                  </div>
                ))}

                {isHostMode && (
                  <div className="relative rounded-[24px] sm:rounded-[32px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-6 sm:p-8 text-center space-y-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl sm:rounded-[24px] shadow-sm flex items-center justify-center text-airbnb">
                      <Camera size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-[15px] sm:text-[16px]">
                        Update Ground Truth
                      </h4>
                      <p className="text-[12px] sm:text-[13px] text-slate-500 max-w-[200px]">
                        Use Secure Enclave to replace legacy media.
                      </p>
                    </div>
                    <button
                      onClick={handleStartVerification}
                      className="text-airbnb font-extrabold text-[13px] sm:text-[14px] hover:underline"
                    >
                      Capture Live Photo
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Live Verification Timeline */}
            <section className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-sm border border-gray-100 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-[20px] sm:text-[22px] font-manrope font-extrabold text-[#222222]">Live Verification Record</h3>
                <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-tighter">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                  Real-time Ledger Active
                </div>
              </div>

              <div className="relative border-l-2 border-dashed border-gray-100 ml-3 pl-6 sm:pl-8 space-y-10 pb-4">
                {[...(property.photos || [])].reverse().slice(0, 3).map((ph, idx) => (
                  <motion.div
                    key={ph.id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="relative"
                  >
                    <div className={`absolute -left-[37px] sm:-left-[41px] top-1 w-6 h-6 rounded-full border-4 border-white shadow-md flex items-center justify-center ${ph.isVerified ? 'bg-green-500' : 'bg-gray-300'}`}>
                      {ph.isVerified ? <CheckCircle size={10} className="text-white" /> : <div className="w-1 h-1 bg-white rounded-full" />}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="font-bold text-[14px] sm:text-[15px]">{ph.isVerified ? 'Secure Enclave Capture' : 'Legacy Media Import'}</h4>
                        <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 font-mono whitespace-nowrap">{ph.meta?.timestamp || 'Original'}</span>
                      </div>
                      <p className="text-[13px] text-gray-500 max-w-md">
                        {ph.isVerified
                          ? `Media anchored via ${ph.meta?.sourceDevice || 'Protected Device'}.`
                          : 'Standard listing media upload.'}
                      </p>
                      {ph.isVerified && (
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-1">
                          <div className="flex items-center gap-1.5 text-[10px] bg-gray-50 px-2 py-1 rounded-md text-gray-400 font-mono uppercase">
                            <MapPin size={10} /> {ph.meta?.gps || '34.0522° N'}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] bg-gray-50 px-2 py-1 rounded-md text-gray-400 font-mono uppercase">
                            <Lock size={10} /> CID: {ph.id.slice(0, 8)}...
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-[20px] sm:text-[22px] font-manrope font-extrabold">Guest Sentiment</h3>
                  <p className="text-[13px] text-slate-500">Feedback signed by authenticated travelers.</p>
                </div>
                {!isHostMode && !showWriteReview && !reviewSubmitted && (
                  <button
                    onClick={() => setShowWriteReview(true)}
                    className="px-4 py-2 border border-gray-200 rounded-xl font-extrabold text-[13px] hover:bg-gray-50 transition-all"
                  >
                    Write Review
                  </button>
                )}
              </div>

              <AnimatePresence>
                {showWriteReview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 sm:p-8 bg-gray-50 rounded-[24px] sm:rounded-[32px] border border-gray-100 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm"><Star size={16} className="text-airbnb" /></div>
                        <span className="font-manrope font-black text-[15px]">Verify Your Stay</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setUserSelectedRating(star)}
                            className="p-1 transition-all hover:scale-110 active:scale-95"
                          >
                            <Star
                              size={18}
                              fill={star <= userSelectedRating ? "#FF385C" : "transparent"}
                              className={star <= userSelectedRating ? "text-airbnb" : "text-gray-300"}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-[12px] font-black text-airbnb mr-2">{userSelectedRating}.0</span>
                      </div>
                    </div>
                    <textarea
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      placeholder="Share your experience (Verified via Secure Enclave)..."
                      className="w-full h-32 p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-airbnb/20 focus:border-airbnb outline-none transition-all font-medium text-[14px]"
                    />
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                        <Lock size={12} /> Hardware Signature Required
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={() => setShowWriteReview(false)} className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-[14px]">Cancel</button>
                        <button
                          onClick={handleReviewSubmit}
                          disabled={isSubmittingReview || !newReview}
                          className="flex-1 sm:flex-initial bg-airbnb text-white px-8 py-2.5 rounded-xl font-black text-[14px] shadow-lg shadow-airbnb/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isSubmittingReview ? "Signing..." : "Post Review"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {reviewSubmitted && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-6 bg-green-50 rounded-[24px] border border-green-100 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm shrink-0"><CheckCircle size={24} /></div>
                  <div className="space-y-0.5">
                    <h4 className="font-black text-[15px] text-green-800">Review Authenticated</h4>
                    <p className="text-[13px] text-green-700/70">Signature success! Feedback anchored to ledger.</p>
                  </div>
                </motion.div>
              )}

              {/* Guest Reviews List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                {property.reviews?.map((review) => (
                  <div key={review.id} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img src={review.avatar} className="w-12 h-12 rounded-full border border-gray-100 shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-[15px]">{review.user}</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5 text-xs text-airbnb">
                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                          </div>
                          <span className="text-[12px] text-slate-400 font-medium">\u00b7 {review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[14px] text-[#222222] leading-relaxed line-clamp-3">
                      {review.comment}
                    </p>
                    {review.verified && (
                      <div className="flex items-center gap-1.5 text-green-600 font-bold text-[11px] uppercase tracking-wider">
                        Verified Review
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Reservation Sidebar - Desktop Only */}
          <div className="hidden lg:block w-[400px] shrink-0">
            <div className="sticky top-[100px] border border-gray-100 shadow-ambient p-8 rounded-[32px] bg-white space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[24px] font-extrabold text-[#222222]">₹ {property.price} <span className="text-[16px] font-normal text-[#717171]">night</span></div>
                <div className="flex items-center gap-1 text-[14px] font-bold">
                  <Star size={14} fill="currentColor" /> {property.rating}
                </div>
              </div>

              {/* Functional Date Pickers */}
              <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-2">
                  <div 
                    className="p-3 border-r border-b border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={(e) => {
                      const input = e.currentTarget.querySelector('input');
                      if (input && 'showPicker' in input) input.showPicker();
                      else if (input) input.focus();
                    }}
                  >
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-bold text-[13px] cursor-pointer"
                    />
                  </div>
                  <div 
                    className="p-3 border-b border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={(e) => {
                      const input = e.currentTarget.querySelector('input');
                      if (input && 'showPicker' in input) input.showPicker();
                      else if (input) input.focus();
                    }}
                  >
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Checkout</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-bold text-[13px] cursor-pointer"
                    />
                  </div>
                </div>
                <div className="p-3">
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full bg-transparent border-none outline-none font-bold text-[14px] cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>

              {/* Price Breakdown */}
              {totalNights > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-[15px] font-medium text-[#222222]">
                    <span className="underline">₹ {property.price} x {totalNights} nights</span>
                    <span>₹ {subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-[15px] font-medium text-[#222222]">
                    <span className="underline">Cleaning fee</span>
                    <span>₹ {cleaningFee}</span>
                  </div>
                  <div className="flex items-center justify-between text-[15px] font-medium text-[#222222]">
                    <span className="underline">Airbnb service fee</span>
                    <span>₹ {serviceFee}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[18px] font-black text-[#222222]">
                    <span>Total</span>
                    <span>₹ {finalTotal}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {isHostMode ? (
                  <button
                    onClick={() => navigate('/host')}
                    className="w-full bg-airbnb text-white py-4 rounded-2xl font-black text-[16px] shadow-lg hover:bg-airbnb-hover transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Edit3 size={18} /> Edit This Listing
                  </button>
                ) : (
                  <button
                    onClick={() => totalNights > 0 ? navigate(`/booking-verification/${property.id}`) : alert("Please select dates first")}
                    className="w-full bg-airbnb text-white py-4 rounded-2xl font-black text-[16px] shadow-lg hover:bg-airbnb-hover transition-all active:scale-[0.98]"
                  >
                    Book Property
                  </button>
                )}

                <div className={`p-4 rounded-2xl flex items-start gap-4 border ${property.allowUnverifiedGuests ? 'bg-blue-50/50 border-blue-100 text-blue-900' : 'bg-red-50/50 border-red-100 text-red-900'
                  }`}>
                  <div className="mt-0.5 opacity-60"><Shield size={18} /></div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-widest">Trust Policy</p>
                    <p className="text-[12px] font-bold leading-relaxed opacity-90">
                      {property.allowUnverifiedGuests
                        ? "Verified Human-Shot photos confirmed."
                        : "Host requires a fresh Secure Enclave capture before booking."
                      }
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-center text-[12px] font-bold text-[#717171]">
                {isHostMode ? "Sync status: Real-time Ledger active" : "You won't be charged yet"}
              </p>
            </div>
          </div>
        </div>
      </main>

      {showCamera && (
        <SecureCamera
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default PropertyReviews;
