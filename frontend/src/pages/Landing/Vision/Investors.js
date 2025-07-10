import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const investors = [
  {
    name: "John Doe",
    role: "Angel Investor",
    desc: "John has been a key supporter of our vision, providing invaluable guidance and resources.",
    image: "https://via.placeholder.com/300x300.png?text=John+Doe",
  },
  {
    name: "Jane Smith",
    role: "Venture Capitalist",
    desc: "Jane brings years of experience in scaling businesses and has been instrumental in our growth.",
    image: "https://via.placeholder.com/300x300.png?text=Jane+Smith",
  },
  {
    name: "Michael Lee",
    role: "Strategic Partner",
    desc: "Michael’s strategic insights and investments have helped us expand our global reach.",
    image: "https://via.placeholder.com/300x300.png?text=Michael+Lee",
  },
  {
    name: "Emily Davis",
    role: "Tech Investor",
    desc: "Emily’s passion for technology and innovation aligns perfectly with our mission.",
    image: "https://via.placeholder.com/300x300.png?text=Emily+Davis",
  },
  {
    name: "David Brown",
    role: "Seed Investor",
    desc: "David believed in our potential from the very beginning and has been a constant supporter.",
    image: "https://via.placeholder.com/300x300.png?text=David+Brown",
  },
  {
    name: "Sophia Wilson",
    role: "Impact Investor",
    desc: "Sophia focuses on sustainable and impactful investments, driving our eco-friendly initiatives.",
    image: "https://via.placeholder.com/300x300.png?text=Sophia+Wilson",
  },
];

export default function Investors() {
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
          alt="Investors Hero"
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
            Meet Our Investors
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl mb-8 max-w-2xl text-white text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            The driving force behind our success and innovation.
          </motion.p>
        </div>
      </section>

      {/* Investors Grid */}
      <section className="w-full flex justify-center items-center py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {investors.map((investor, idx) => (
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
                src={investor.image}
                alt={investor.name}
                className="w-32 h-32 rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-bold">{investor.name}</h3>
              <p className="text-blue-800 dark:text-blue-300 font-semibold">
                {investor.role}
              </p>
              <p className="mt-2 text-gray-700 dark:text-gray-200">
                {investor.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}