import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PublicSettings } from '../types';

interface FloatingWhatsAppProps {
  settings: PublicSettings;
  hideWhenModalOpen?: boolean;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  settings,
  hideWhenModalOpen = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If WhatsApp is explicitly disabled by admin, do not render
  if (settings.whatsappEnabled === false) {
    return null;
  }

  // If a modal is currently open on top of the screen, hide to prevent overlap
  if (hideWhenModalOpen) {
    return null;
  }

  const rawNumber = settings.whatsappNumber || '+923098569707';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  const defaultMessage = encodeURIComponent(
    'Hello Smart Developer! I am interested in purchasing website source code / requesting custom web development.'
  );

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${defaultMessage}`;

  const buttonContent = (
    <div
      id="smart-developer-whatsapp-floating"
      className="smart-whatsapp-floating-container fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-[9990] flex items-center justify-center pointer-events-auto select-none print:hidden"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 9990,
      }}
    >
      {/* Desktop Quick Tooltip on Hover (Facing inward to the right) */}
      {showTooltip && (
        <div className="hidden sm:block absolute left-16 bottom-2 whitespace-nowrap px-3 py-1.5 bg-[#0e111d] border border-white/15 rounded-xl shadow-2xl text-xs text-white animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
          <div className="font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
            <span>Chat on WhatsApp</span>
          </div>
          <div className="text-[10px] text-slate-400">Direct developer support</div>
        </div>
      )}

      {/* Floating Circular WhatsApp Button Matching Exact Reference Image */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 shadow-2xl shadow-emerald-500/40 border border-white/20 transition-all duration-200 cursor-pointer group"
        aria-label="Contact Developer on WhatsApp"
        title="Chat on WhatsApp"
      >
        {/* Subtle breathing ambient aura */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 blur-sm animate-pulse group-hover:bg-[#25D366]/60 transition-all pointer-events-none"></span>

        {/* WhatsApp Official Clean White Icon */}
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 text-white fill-current relative z-10 transition-transform duration-200 group-hover:scale-110"
        >
          <path d="M16 2a13.9 13.9 0 0 0-12 21L2 30l7.2-1.9A13.9 13.9 0 1 0 16 2zm0 25.5a11.6 11.6 0 0 1-5.9-1.6l-.4-.3-4.4 1.2 1.2-4.3-.3-.4A11.6 11.6 0 1 1 16 27.5zm6.4-8.7c-.4-.2-2.1-1-2.4-1.2-.4-.1-.6-.2-.9.2s-1 1.2-1.2 1.5c-.2.2-.5.3-.9.1a11.3 11.3 0 0 1-5.6-4.9c-.4-.7.4-.7 1.2-2.3 0-.3 0-.5-.1-.7s-.9-2.1-1.2-2.9c-.3-.8-.7-.7-.9-.7h-.8c-.3 0-.7.1-1.1.5s-1.5 1.5-1.5 3.6c0 2.1 1.5 4.2 1.7 4.5.3.3 3 4.6 7.3 6.4 1 .4 1.8.7 2.5.9 1.1.3 2 .3 2.8.2.9-.1 2.7-1.1 3.1-2.2.4-1 .4-1.9.3-2.1-.2-.2-.5-.3-.9-.5z" />
        </svg>

        {/* Top-Right Notification / Online Circle Indicator (Matching Image Badge) */}
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#00ff87] border-2 border-[#08090E] flex items-center justify-center z-20 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-950"></span>
        </span>
      </a>
    </div>
  );

  // When client has mounted and document.body is accessible, portal to document.body
  if (mounted && typeof document !== 'undefined' && document.body) {
    return createPortal(buttonContent, document.body);
  }

  // Fallback initial render
  return buttonContent;
};
