"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function IntroAnimation() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide animation after it completes
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4500); // Total duration of animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black text-white overflow-hidden cursor-pointer"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          onClick={() => setIsVisible(false)}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-black to-black opacity-50" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          
          <div className="relative z-10 flex flex-col items-center justify-center font-mono tracking-tighter">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="mb-6 relative w-48 h-48 md:w-80 md:h-80"
            >
               <Image 
                 src="/logoWhite.png" 
                 alt="Gravity Logo" 
                 fill
                 className="object-contain"
                 priority
               />
            </motion.div>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100px", opacity: 1 }}
              transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
              className="h-[1px] bg-white/20 my-8"
            />

            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.2em" }}
              transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
              className="text-xs md:text-sm uppercase text-neutral-400 tracking-[0.2em]"
            >
              Payments Reimagined
            </motion.div>
          </div>

          {/* Loading Bar */}
          <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-neutral-800 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className="h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.5, ease: "easeInOut" }}
            />
          </motion.div>
          
          {/* Skip Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-4 right-6 text-[10px] text-neutral-500 font-mono uppercase tracking-widest"
          >
            [ Click to Skip ]
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
