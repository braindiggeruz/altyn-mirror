'use client';
import { motion } from 'framer-motion';

export function OrbitMark({ className = 'w-[210px] h-[210px]' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      {/* glow */}
      <div className="absolute inset-0 rounded-full animate-pulse-gold"
        style={{ background: 'radial-gradient(closest-side, rgba(206,160,58,0.45), rgba(206,160,58,0) 70%)' }} />
      {/* rings */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="ringG" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f3e3b0" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#cea03a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#5e1822" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="92" stroke="url(#ringG)" strokeWidth="1" fill="none" opacity="0.65" />
        <circle cx="100" cy="100" r="74" stroke="url(#ringG)" strokeWidth="0.6" fill="none" opacity="0.45" />
        <circle cx="100" cy="100" r="56" stroke="url(#ringG)" strokeWidth="0.5" fill="none" opacity="0.35" />
      </svg>

      {/* rotating dot ring 1 */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        <span className="orbit-dot" style={{ transform: 'translate(-50%, -50%) translateY(-92px)' }} />
      </motion.div>
      {/* rotating dot ring 2 */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
      >
        <span className="orbit-dot" style={{ width: 6, height: 6, transform: 'translate(-50%, -50%) translateY(-74px)' }} />
      </motion.div>

      {/* center mirror */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[58px] h-[58px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #fff5d0, #cea03a 55%, #4b3408 100%)',
            boxShadow: '0 0 40px rgba(206,160,58,0.45), inset 0 0 18px rgba(255,240,200,0.35)',
          }}
        />
      </div>
    </div>
  );
}
