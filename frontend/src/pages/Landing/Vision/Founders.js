import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

// Import images
import NishantImage from "../../../assets/founders/N.png";
import GunjanImage from "../../../assets/founders/G.jpeg";

const founders = [
  {
    name: "Nishant",
    role: "Co-Founder & CEO",
    desc: "Nishant is a visionary leader with a passion for innovation and growth. He drives the company’s mission to empower businesses worldwide.",
    image: NishantImage,
  },
  {
    name: "Gunjan",
    role: "Co-Founder & CTO",
    desc: "Gunjan is a tech enthusiast and problem solver. She leads the development of cutting-edge solutions to transform businesses.",
    image: GunjanImage,
  },
];

export default function Founders() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const heroRef = useRef(null);
  const [heroStyle, setHeroStyle] = useState({
    opacity: 1,
    transform: "scale(1) translateY(0px)",
  });

  useEffect(() => {
    const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkThemeQuery.matches);
    const handleThemeChange = (e) => setIsDarkMode(e.matches);
    darkThemeQuery.addEventListener("change", handleThemeChange);
    return () =>
      darkThemeQuery.removeEventListener("change", handleThemeChange);
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (!heroRef.current) return;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const fadeEnd = windowHeight * 0.7;
      let progress = Math.min(1, Math.max(0, scrollY / fadeEnd));
      setHeroStyle({
        opacity: 1 - progress,
        transform: `scale(${1 - progress * 0.1}) translateY(-${progress * 80}px)`,
      });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen font-eudoxus transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex flex-col justify-center items-center min-h-[80vh] w-full overflow-hidden"
        style={{
          ...heroStyle,
          transition: "opacity 0.4s, transform 0.4s",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80"
          alt="Founders Hero"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{
            filter: isDarkMode ? "brightness(0.7)" : "brightness(0.85)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
        <div className="relative z-20 flex flex-col items-center w-full px-4 py-12">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 bg-clip-text text-transparent text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Meet Our Founders
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl mb-8 max-w-2xl text-white text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            The visionaries behind our success.
          </motion.p>
        </div>
      </section>

      {/* Founders Grid */}
      <section className="w-full flex justify-center items-center py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {founders.map((founder, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className={`bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 flex flex-col items-center text-center h-full transition-transform`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 * idx }}
            >
              <img
                src={founder.image}
                alt={founder.name}
                className="w-32 h-32 rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-bold">{founder.name}</h3>
              <p className="text-blue-800 dark:text-blue-300 font-semibold">
                {founder.role}
              </p>
              <p className="mt-2 text-gray-700 dark:text-gray-200">
                {founder.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}