import React from 'react';

const SuccessModal = ({ isOpen, onClose, title, message, buttonText, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with premium blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose} 
      />

      {/* Modal Card with Glassmorphism */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-zinc-950/75 border border-white/10 backdrop-blur-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center transform transition-all duration-300 animate-[fadeInUp_0.4s_ease-out] z-10">
        
        {/* Glow effect in background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Green Checkmark Wrapper */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden animated-checkmark-bg">
            <svg 
              className="w-12 h-12 text-[#26bc71]" 
              viewBox="0 0 52 52" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle 
                className="animated-checkmark-circle" 
                cx="26" 
                cy="26" 
                r="25" 
                strokeLinecap="round" 
              />
              <path 
                className="animated-checkmark-check" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M14.1 27.2l7.1 7.2 16.7-16.8" 
              />
            </svg>
          </div>
        </div>

        {/* Modal Info */}
        <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">
          {title || "Thành công!"}
        </h2>
        <p className="text-gray-300 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
          {message || "Yêu cầu của bạn đã được thực hiện thành công."}
        </p>

        {/* Button */}
        <button
          onClick={onConfirm || onClose}
          className="w-full py-3 px-6 bg-gradient-to-r from-[#26bc71] to-[#1fa05f] hover:from-[#32d583] hover:to-[#26bc71] text-white font-semibold rounded-xl transition duration-300 shadow-[0_4px_20px_rgba(38,188,113,0.3)] hover:shadow-[0_6px_24px_rgba(38,188,113,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide"
        >
          {buttonText || "Đóng"}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
