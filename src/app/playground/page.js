'use client';

import ExperienceLab from '@/components/playground/ExperienceLab';
import DeviceWarningModal from '@/components/ui/DeviceWarningModal';
import { motion } from 'framer-motion';

export default function PlaygroundPage() {
  return (
    <>
      <DeviceWarningModal />
      <div className="pt-16 md:pt-20 pb-8 sm:pb-12">
        <div className="max-w-[95vw] sm:max-w-[98vw] lg:max-w-[95vw] mx-auto px-2 sm:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4">
              Experience Lab
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
              Select interactive demos and apply them to a realistic landing page preview
            </p>
          </motion.div>

          <div className="w-full">
            <ExperienceLab />
          </div>
        </div>
      </div>
    </>
  );
}
