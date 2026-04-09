import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PropertyCard = ({ property, index = 0 }) => {
  const latestVerifiedPhoto = [...(property.photos || [])].reverse().find(p => p.isVerified);
  const displayImage = latestVerifiedPhoto?.url || property.image;
  const isEnclaveLive = !!latestVerifiedPhoto;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to={`/property/${property.id}`} className="flex flex-col gap-3">
        <div 
          className="relative aspect-square overflow-hidden rounded-[24px] bg-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:rounded-[32px]"
          style={{ aspectRatio: '1/1', overflow: 'hidden' }}
        >
          <img 
            src={displayImage} 
            alt={property.title}
            className="h-full w-full group-hover:scale-110 transition-transform duration-700 ease-out"
            style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
          />
          
          {/* Heart Icon */}
          <div className="absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 group-hover:bg-black/30 backdrop-blur-md">
            <HeartSvg />
          </div>

          {/* AI Verified / Live Enclave Badge */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 items-start">
            {isEnclaveLive && (
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-2 px-3.5 py-2 bg-green-500 text-white shadow-2xl rounded-full border border-white/20"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />
                <span className="text-[10px] font-black tracking-widest uppercase">Live Enclave</span>
              </motion.div>
            )}
            
            {property.forensics?.aiConfidence > 85 && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2 px-3.5 py-2 bg-red-600 text-white shadow-2xl rounded-full border border-white/20"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                <span className="text-[10px] font-black tracking-widest uppercase">Forensic Alert: AI Detected</span>
              </motion.div>
            )}

            {isEnclaveLive && !property.forensics?.aiConfidence && (
              <div className="flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-xl shadow-2xl rounded-full border border-white/20 transform group-hover:scale-105 transition-transform">
                <ShieldCheck size={14} className="text-airbnb" fill="currentColor" fillOpacity={0.15} />
                <span className="text-[11px] font-extrabold text-[#222222] tracking-wider uppercase">AI Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Info Area */}
        <div className="space-y-1 mt-1">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-[15px] truncate max-w-[80%] text-[#222222] group-hover:text-airbnb transition-colors duration-300">{property.location}</h3>
            <div className="flex items-center gap-1.5">
              <Star size={14} fill="currentColor" strokeWidth={0} />
              <span className="text-[14px] font-semibold text-[#222222]">{property.rating}</span>
            </div>
          </div>
          
          <div className="space-y-0.5">
            <p className="text-[15px] text-[#717171] leading-tight font-medium">{property.distance}</p>
            <p className="text-[15px] text-[#717171] leading-tight font-medium">Available now</p>
          </div>
          
          <p className="text-[15px] pt-2 flex items-baseline gap-1.5">
            <span className="font-extrabold text-[16px]">₹{property.price}</span>
            <span className="text-[#444444] font-medium">night</span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

const HeartSvg = () => (
  <svg 
    viewBox="0 0 32 32" 
    className="w-5 h-5 fill-transparent stroke-white" 
    strokeWidth={2.5}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16 28c7-4.733 14-10 14-17 0-3.863-3.137-7-7-7-2.31 0-4.305 1.134-5.5 2.87-1.194-1.737-3.189-2.87-5.5-2.87-3.863 0-7 3.137-7 7 0 7 7 12.267 14 17z" />
  </svg>
);

export default PropertyCard;
