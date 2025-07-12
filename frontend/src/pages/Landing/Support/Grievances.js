import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Grievances() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const heroRef = useRef(null);
  const [heroStyle, setHeroStyle] = useState({
    opacity: 1,
    transform: "scale(1) translateY(0px)"
  });

  // Dark mode detection
  useEffect(() => {
    const darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkThemeQuery.matches);
    const handleThemeChange = (e) => setIsDarkMode(e.matches);
    darkThemeQuery.addEventListener('change', handleThemeChange);
    return () => darkThemeQuery.removeEventListener('change', handleThemeChange);
  }, []);

  // Hero scroll effect
  useEffect(() => {
    function handleScroll() {
      if (!heroRef.current) return;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const fadeEnd = windowHeight * 0.7;
      let progress = Math.min(1, Math.max(0, scrollY / fadeEnd));
      setHeroStyle({
        opacity: 1 - progress,
        transform: `scale(${1 - progress * 0.1}) translateY(-${progress * 80}px)`
      });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`min-h-screen font-eudoxus transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Hero Section with Form Over Background */}
      <section
        ref={heroRef}
        className="relative flex flex-col justify-center items-center min-h-[100vh] w-full overflow-hidden"
        style={{
          ...heroStyle,
          transition: "opacity 0.4s, transform 0.4s"
        }}
      >
        {/* Background Image */}
        <img
          src="https://support.apple.com/content/dam/edam/applecare/images/en_US/psp_heros/psp-hero-banner-macfamily-3.image.large_2x.jpg"
          alt="Grievances Hero"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ filter: isDarkMode ? "brightness(0.7)" : "brightness(0.85)" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
        {/* Content and Form */}
        <div className=" mt-16 relative z-20 flex flex-col items-center w-full px-4 py-12">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 bg-clip-text text-transparent text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Grievances
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl mb-8 max-w-2xl text-white text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Let us know your concerns, and we'll address them promptly.
          </motion.p>
          {/* Overlapping Form */}
          <motion.form
            className={`bg-white/90 dark:bg-gray-800/90 shadow-xl rounded-2xl p-8 space-y-6 w-full max-w-2xl mt-4 relative z-30 backdrop-blur`}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Grievance</label>
              <textarea
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                rows="5"
                placeholder="Describe your grievance"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 text-white py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Submit Grievance
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}