'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import Button from './Button';
import { Monitor, Smartphone, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeviceWarningModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if device is small (mobile/tablet)
    const checkDevice = () => {
      const width = window.innerWidth;
      // Show modal on devices smaller than 1024px (lg breakpoint)
      if (width < 1024) {
        setIsOpen(true);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleGoHome}
      size="md"
      showCloseButton={false}
    >
      <div className="text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="mx-auto w-20 h-20 mb-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center"
        >
          <Monitor className="text-white" size={40} />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold mb-4 text-foreground"
        >
          Better Experience on Larger Screen
        </motion.h2>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mb-8"
        >
          <p className="text-muted-foreground text-lg">
            For the best experience with Tech Playground, we recommend using a laptop or desktop computer.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex flex-col items-center text-muted-foreground">
              <Smartphone size={32} className="mb-2 opacity-50" />
              <span className="text-sm">Current Device</span>
            </div>
            <div className="text-2xl">→</div>
            <div className="flex flex-col items-center text-primary">
              <Monitor size={32} className="mb-2" />
              <span className="text-sm font-semibold">Recommended</span>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Go to Home
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}

