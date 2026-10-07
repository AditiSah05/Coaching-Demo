import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileStickyBar } from './MobileStickyBar';
import { MessageCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const PublicLayout = () => {
  const location = useLocation();
  const { settings } = useData();
  const whatsappClean = (settings?.whatsapp || '').replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-ink relative pb-16 md:pb-0">
      <Navbar />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <MobileStickyBar />

      {/* Desktop Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappClean}?text=Hello%20Pacific%20Marine%20Academy,%20I%20want%20information%20about%20Merchant%20Navy%20Coaching.`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="hidden md:flex fixed bottom-6 right-6 z-40 w-14 h-14 bg-seagreen text-white rounded-full items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute right-16 bg-navy-dark text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
          Chat With Admission Counselor
        </span>
      </a>
    </div>
  );
};
