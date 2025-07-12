import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Predictive Insights",
    desc: "Leverage AI to forecast sales and inventory needs.",
    img: "https://via.placeholder.com/600x300"
  },
  {
    title: "Customer Trends",
    desc: "Understand buying patterns and optimize offerings.",
    img: "https://via.placeholder.com/600x300"
  },
  {
    title: "Automated Reports",
    desc: "Get actionable analytics delivered automatically.",
    img: "https://via.placeholder.com/600x300"
  },
  {
    title: "Smart Alerts",
    desc: "Receive instant notifications for key business events.",
    img: "https://via.placeholder.com/600x300"
  }
];

function useScrollReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

export default function AiDrivenAnalytics() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featuresInViewRef, featuresInView] = useScrollReveal();
  const heroRef = useRef(null);
  const [heroStyle, setHeroStyle] = useState({
    opacity: 1,
    transform: "scale(1) translateY(0px)"
  });

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
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex flex-col justify-center items-center min-h-[90vh] w-full overflow-hidden"
        style={{
          ...heroStyle,
          transition: "opacity 0.4s, transform 0.4s"
        }}
      >
        {/* Hero Image */}
        <img
          src="https://www.apple.com/v/imac/u/images/overview/product-stories/apple-intelligence/lifestyle_1__ccnm7cq3bhjm_large.jpg"
          alt="Billing Credit Management Hero"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ filter: isDarkMode ? "brightness(0.7)" : "brightness(0.85)" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
        {/* Content */}
        <div className="relative z-20 flex flex-col items-start w-full px-8 py-16 pl-16">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Customer Automation
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl mb-8 max-w-2xl text-white"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Unlock the power of artificial intelligence to drive smarter business decisions and growth.
          </motion.p>
          <motion.button
            className="px-8 py-3 rounded-full bg-white text-black font-semibold shadow-lg hover:bg-gray-200 transition"
            whileHover={{ scale: 1.05 }}
          >
            Get Started
          </motion.button>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresInViewRef}
        className={`w-full relative flex flex-col justify-center overflow-hidden mx-auto pt-8 md:pt-8 px-4 md:pl-16 pr-4 md:pr-16 transition-all duration-1000 ease-out ${
          featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        } ${isDarkMode ? 'bg-gray-900' : 'bg-black'}`}
        style={{
          width: "100vw",
          minHeight: "60vh",
          borderRadius: "0px",
        }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 mb-8 md:mb-16">
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className={`text-white p-8 rounded-2xl shadow-xl cursor-pointer flex flex-col justify-between h-[250px] ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-900 hover:bg-gray-800'
              }`}
              style={{
                transition: `all 800ms cubic-bezier(0.4,0,0.2,1)`,
                transitionDelay: featuresInView ? `${200 + idx * 100}ms` : '0ms',
              }}
              onClick={() => setSelectedFeature(idx)}
            >
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal Overlay for Feature Details */}
      {selectedFeature !== null && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedFeature(null)}
        >
          <div
            className={`relative rounded-2xl p-4 md:p-6 w-full max-w-2xl bg-white text-gray-900`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedFeature(null)}
              className="absolute top-2 right-4 text-2xl hover:text-red-500"
            >
              &times;
            </button>
            <img
              src={features[selectedFeature].img}
              alt={features[selectedFeature].title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{features[selectedFeature].title}</h2>
            <p className="text-base">{features[selectedFeature].desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}