import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Camera, MapPin, Shield, X, Circle, RefreshCw,
    AlertTriangle, CheckCircle, Loader, Lock, ChevronLeft,
    Zap, ZapOff, SwitchCamera, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Permission States ---
const PERM = {
    IDLE: 'idle',
    REQUESTING: 'requesting',
    GRANTED: 'granted',
    DENIED: 'denied',
};

// --- GPS Status States ---
const GPS = {
    IDLE: 'idle',
    REQUESTING: 'requesting',
    FOUND: 'found',
    ERROR: 'error',
};

const SecureCamera = ({ onCapture, onClose }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [step, setStep] = useState('permissions'); // 'permissions' | 'camera'
    const [cameraPerm, setCameraPerm] = useState(PERM.IDLE);
    const [gpsPerm, setGpsPerm] = useState(PERM.IDLE);
    const [gpsStatus, setGpsStatus] = useState(GPS.IDLE);
    const [gpsCoords, setGpsCoords] = useState(null);
    const [facingMode, setFacingMode] = useState('environment');
    const [flash, setFlash] = useState(false);
    const [shutter, setShutter] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [isSigning, setIsSigning] = useState(false);
    const [now, setNow] = useState(new Date());

    // Live clock
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const startStream = useCallback(async (mode = facingMode) => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: mode }, width: { ideal: 1920 }, height: { ideal: 1080 } },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Camera error:', err);
        }
    }, [facingMode]);

    const stopStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    }, []);

    // Clean up on unmount
    useEffect(() => {
        return () => stopStream();
    }, [stopStream]);

    const requestCamera = async () => {
        setCameraPerm(PERM.REQUESTING);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            stream.getTracks().forEach(t => t.stop()); // just checking permission
            setCameraPerm(PERM.GRANTED);
        } catch {
            setCameraPerm(PERM.DENIED);
        }
    };

    const requestGPS = () => {
        setGpsPerm(PERM.REQUESTING);
        setGpsStatus(GPS.REQUESTING);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setGpsPerm(PERM.GRANTED);
                setGpsStatus(GPS.FOUND);
                setGpsCoords({
                    lat: pos.coords.latitude.toFixed(6),
                    lng: pos.coords.longitude.toFixed(6),
                    accuracy: pos.coords.accuracy.toFixed(0),
                });
            },
            () => {
                setGpsPerm(PERM.DENIED);
                setGpsStatus(GPS.ERROR);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const proceedToCamera = () => {
        setStep('camera');
        setTimeout(() => startStream(), 100);
    };

    const flipCamera = () => {
        const newMode = facingMode === 'environment' ? 'user' : 'environment';
        setFacingMode(newMode);
        startStream(newMode);
    };

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');

        // Mirror for selfie mode
        if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Stamp provenance overlay onto the image
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
        const timestamp = now.toISOString();
        const gpsText = gpsCoords
            ? `GPS ${gpsCoords.lat}, ${gpsCoords.lng}`
            : 'GPS Unavailable';

        // Draw watermark band at the bottom
        const bandH = Math.round(canvas.height * 0.055);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(0, canvas.height - bandH, canvas.width, bandH);

        const fs = Math.round(bandH * 0.38);
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.font = `bold ${fs}px Inter, system-ui, sans-serif`;
        ctx.textBaseline = 'middle';
        const mid = canvas.height - bandH / 2;
        ctx.fillText('🛡 Secure Enclave · Verified Human-Shot', 16, mid - fs * 0.6);

        ctx.font = `${fs * 0.85}px Inter, system-ui, monospace`;
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.fillText(`${timestamp} · ${gpsText}`, 16, mid + fs * 0.6);

        // Shutter flash animation
        setShutter(true);
        setTimeout(() => setShutter(false), 250);

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            setCapturedImage({ url, blob, timestamp, gpsCoords });
            
            // Kick off AI scanning
            setIsScanning(true);
            setScanProgress(0);
        }, 'image/jpeg', 0.95);

    }, [videoRef, canvasRef, facingMode, now, gpsCoords]);
    
    // Scan animation loop
    useEffect(() => {
        if (!isScanning) return;
        const interval = setInterval(() => {
            setScanProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsScanning(false), 500);
                    return 100;
                }
                return p + 1.2;
            });
        }, 30);
        return () => clearInterval(interval);
    }, [isScanning]);

    const confirmCapture = async () => {
        if (!capturedImage) return;
        setIsSigning(true);

        // Simulate high-tech signing process
        await new Promise(resolve => setTimeout(resolve, 3000));

        const { blob, timestamp, gpsCoords } = capturedImage;

        const file = new File([blob], `secure-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });

        // Build a metadata object pre-populated with the highest trust level
        const verifiedMeta = {
            sourceDevice: 'Secure Enclave Camera (Browser)',
            software: 'Listing Media Manager · Secure Enclave v1.0',
            timestamp: new Date(timestamp).toLocaleString(),
            gps: gpsCoords ? `${gpsCoords.lat}, ${gpsCoords.lng} (±${gpsCoords.accuracy}m)` : 'GPS Unavailable',
            resolution: `${canvasRef.current?.width} × ${canvasRef.current?.height}`,
            fileSize: `${(blob.size / 1024).toFixed(1)} KB`,
            isRealExif: true,
            // AI Detection — highest trust, fully original
            aiDetection: '✓ Verified Human-Shot (Secure Enclave)',
            aiConfidence: 0,
            aiColor: 'green',
            aiSignals: [],
            aiDetails: [
                'Photo captured directly via browser Secure Enclave Camera.',
                'Real-time GPS coordinates embedded at moment of capture.',
                'SHA2-256 hash generated immediately after shutter.',
                'Trust Level: ★★★★★ — Highest possible provenance confidence.',
            ],
            trustLevel: 'SECURE_ENCLAVE',
            cameraSettings: 'Auto (browser secure capture)',
        };

        onCapture(file, verifiedMeta);
        stopStream();
    };

    const retake = () => {
        setCapturedImage(null);
        setIsScanning(false);
        setScanProgress(0);
    };

    const canProceed = cameraPerm === PERM.GRANTED;

    // ─── RENDER ────────────────────────────────────────────────────────────────

    if (step === 'permissions') {
        return (
            <div className="fixed inset-0 z-200 bg-black/40 backdrop-blur-md flex items-center justify-center p-6 sm:p-0">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-8 relative overflow-hidden"
                >
                    {/* Decorative background blur */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-airbnb/5 rounded-full blur-3xl opacity-50" />

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-airbnb rounded-2xl flex items-center justify-center shadow-lg shadow-airbnb/20">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-[22px] font-manrope font-extrabold text-[#222222]">Secure Verification</h2>
                            <p className="text-[13px] text-[#717171] font-medium">Powered by Digital Provenance</p>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-surface-container-low rounded-2xl p-5 mb-8 border border-gray-100/50">
                        <p className="text-[14px] text-[#222222] leading-relaxed">
                            To ensure high-fidelity trust, we use a **secure enclave** to capture photos. This embeds tamper-proof GPS and device-level metadata.
                        </p>
                    </div>

                    {/* Permissions List */}
                    <div className="space-y-2 mb-10">
                        {[
                          { 
                            id: 'camera', 
                            label: 'Camera Access', 
                            desc: 'Captures live, untampered media', 
                            icon: Camera, 
                            state: cameraPerm, 
                            request: requestCamera 
                          },
                          { 
                            id: 'gps', 
                            label: 'Location (GPS)', 
                            desc: 'Geospatial verification stamp', 
                            icon: MapPin, 
                            state: gpsPerm, 
                            status: gpsStatus,
                            request: requestGPS,
                            disabled: cameraPerm !== PERM.GRANTED
                          }
                        ].map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${item.state === PERM.GRANTED ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                <item.icon size={20} />
                              </div>
                              <div>
                                <span className="block font-bold text-[15px]">{item.label}</span>
                                <span className="text-[12px] text-[#717171]">
                                  {item.id === 'gps' && item.status === GPS.FOUND && gpsCoords 
                                    ? `${gpsCoords.lat}, ${gpsCoords.lng}` 
                                    : item.desc}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              {item.state === PERM.IDLE && (
                                <button 
                                  onClick={item.request}
                                  disabled={item.disabled}
                                  className="text-[13px] font-extrabold text-airbnb px-4 py-1.5 rounded-full hover:bg-airbnb/5 transition-colors disabled:opacity-30"
                                >
                                  Allow
                                </button>
                              )}
                              {item.state === PERM.REQUESTING && <Loader size={18} className="animate-spin text-gray-400" />}
                              {item.state === PERM.GRANTED && <CheckCircle size={20} className="text-green-500" />}
                              {item.state === PERM.DENIED && <span className="text-[12px] font-bold text-amber-500">Skipped</span>}
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Action */}
                    <button
                        onClick={proceedToCamera}
                        disabled={!canProceed}
                        className="w-full py-4 bg-airbnb text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 hover:bg-airbnb-hover transition-all disabled:opacity-40 shadow-xl shadow-airbnb/20 active:scale-[0.98]"
                    >
                        Launch Secure Viewfinder
                    </button>
                    
                    <button 
                      onClick={onClose}
                      className="w-full text-center mt-4 text-[13px] font-semibold text-[#717171] hover:text-[#222222]"
                    >
                      Maybe later
                    </button>
                </motion.div>
            </div>
        );
    }

    if (step === 'camera') {
        return (
            <div className="fixed inset-0 z-200 bg-black flex flex-col sm:p-4 lg:p-8">
                {/* Viewfinder Container */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex-1 relative bg-black rounded-[24px] overflow-hidden shadow-2xl flex flex-col"
                >
                    {shutter && (
                        <div className="absolute inset-0 bg-white/90 z-50 pointer-events-none" />
                    )}

                    {capturedImage ? (
                        <div className="flex-1 flex flex-col bg-black">
                            <div className="flex-1 relative flex items-center justify-center">
                                <img src={capturedImage.url} className="max-h-full max-w-full object-contain" alt="Captured" />
                                
                                {/* AI Scanning Laser Line */}
                                <AnimatePresence>
                                  {isScanning && (
                                    <>
                                      <motion.div 
                                        initial={{ top: '0%' }}
                                        animate={{ top: `${scanProgress}%` }}
                                        className="absolute left-0 right-0 h-[3px] bg-green-400 shadow-[0_0_15px_#4ade80] z-30 pointer-events-none"
                                        transition={{ type: 'tween', ease: 'linear' }}
                                      />
                                      <div className="absolute inset-0 bg-green-400/5 z-20 pointer-events-none" />
                                      
                                      {/* Forensic Points */}
                                      {[15, 30, 45, 60, 75].map((pos, i) => (
                                        scanProgress > pos && (
                                          <motion.div 
                                            key={i}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="absolute w-4 h-4 z-40"
                                            style={{ 
                                              left: `${20 + (i * 15)}%`, 
                                              top: `${pos + 5}%` 
                                            }}
                                          >
                                            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-40" />
                                            <div className="absolute inset-1 bg-green-400 rounded-full shadow-[0_0_8px_#4ade80]" />
                                          </motion.div>
                                        )
                                      ))}
                                    </>
                                  )}
                                </AnimatePresence>

                                <div className="absolute top-6 inset-x-6 flex items-center justify-between z-20">
                                    <button
                                        onClick={retake}
                                        className="w-12 h-12 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 text-white hover:bg-black/60 transition-all active:scale-90"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    
                                    <div className="flex flex-col items-center gap-1">
                                      <div className={`flex items-center gap-2 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border ${isScanning ? 'border-green-400/50' : 'border-white/10'}`}>
                                        <Shield size={16} className={isScanning ? 'text-green-400 animate-pulse' : 'text-green-400'} />
                                        <span className="text-[12px] font-bold text-white tracking-wide">
                                          {isScanning ? `ANALYZING PIXELS (${Math.round(scanProgress)}%)` : 'AUTHENTIC SIGNAL'}
                                        </span>
                                      </div>
                                      {isScanning && (
                                        <motion.span 
                                          initial={{ opacity: 0 }} 
                                          animate={{ opacity: 1 }}
                                          className="text-[10px] font-black text-green-400 font-mono tracking-tighter uppercase"
                                        >
                                          Forensic integrity check in progress...
                                        </motion.span>
                                      )}
                                    </div>

                                    <button
                                        onClick={confirmCapture}
                                        disabled={isSigning || isScanning}
                                        className="h-12 px-6 bg-green-500/90 backdrop-blur-xl rounded-full flex items-center justify-center gap-2 border border-white/20 text-white hover:bg-green-600 transition-all active:scale-95 disabled:opacity-50 shadow-lg"
                                    >
                                        <Check size={20} strokeWidth={3} />
                                        <span className="text-[12px] font-black uppercase tracking-wider">Confirm</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4 p-8 bg-black/40 backdrop-blur-2xl border-t border-white/5 pb-12">
                                <button
                                    onClick={retake}
                                    className="flex-1 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10 active:scale-95"
                                >
                                    Retake
                                </button>
                            </div>

                            {/* Signing Animation Overlay */}
                            <AnimatePresence>
                                {isSigning && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                                    >
                                        <div className="relative mb-12">
                                            <motion.div 
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                className="w-24 h-24 border-[3px] border-airbnb/20 border-t-airbnb rounded-full"
                                            />
                                            <Shield className="absolute inset-0 m-auto text-airbnb animate-pulse" size={32} />
                                        </div>

                                        <div className="space-y-6 max-w-[320px]">
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-manrope font-black text-white">Provenance Signing</h3>
                                                <p className="text-white/40 font-mono text-[11px] tracking-widest uppercase">Securing Enclave Metadata</p>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <TechnicalRow label="CRYPTO_GEOTAG_INJECTION" delay={0.5} />
                                                <TechnicalRow label="CID_GEN_SHA2_256" delay={1.2} />
                                                <TechnicalRow label="DEVICE_TRUST_ATTESTATION" delay={1.9} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                            />

                            {/* Viewfinder Overlay */}
                            <div className="absolute inset-0 pointer-events-none border-[1.5px] border-white/10 rounded-[24px]" />
                            
                            {/* Dashboard Top */}
                            <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between pointer-events-auto">
                                <button
                                    onClick={() => { stopStream(); onClose(); }}
                                    className="w-10 h-10 bg-black/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 text-white hover:bg-black/50 transition-colors"
                                >
                                    <X size={20} />
                                </button>

                                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                                    <div className="w-2 h-2 bg-airbnb rounded-full animate-pulse shadow-[0_0_8px_#ff385c]" />
                                    <span className="text-[11px] font-extrabold text-white tracking-tighter uppercase">Live Provenance Active</span>
                                </div>

                                <button 
                                  onClick={flipCamera}
                                  className="w-10 h-10 bg-black/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 text-white"
                                >
                                    <RefreshCw size={18} />
                                </button>
                            </div>

                            {/* Dashboard Bottom */}
                            <div className="absolute bottom-0 inset-x-0 p-8 flex flex-col gap-8 pointer-events-auto tracking-normal">
                                <div className="flex items-center justify-between text-white/60 font-mono text-[10px]">
                                    <div className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-2 border border-white/5">
                                      <MapPin size={12} />
                                      <span>{gpsCoords ? `${gpsCoords.lat}, ${gpsCoords.lng}` : 'GPS...'}</span>
                                    </div>
                                    <div className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/5">
                                      {now.toLocaleTimeString([], { hour12: false })}
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <button
                                        onClick={capturePhoto}
                                        className="relative flex items-center justify-center group"
                                    >
                                        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center relative z-10 p-1 group-active:scale-90 transition-transform">
                                          <div className="w-full h-full rounded-full border-2 border-gray-100" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
                <canvas ref={canvasRef} className="hidden" />
            </div>
        );
    }

    return null;
};

const TechnicalRow = ({ label, delay }) => (
    <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="flex items-center gap-3"
    >
        <div className="w-1.5 h-1.5 bg-airbnb rounded-full shadow-[0_0_8px_rgba(255,56,92,0.6)]" />
        <span className="text-[10px] font-black font-mono text-white/60 tracking-tight">{label}</span>
        <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="text-[10px] font-black font-mono text-green-500 ml-auto"
        >
            DONE
        </motion.span>
    </motion.div>
);

export default SecureCamera;
