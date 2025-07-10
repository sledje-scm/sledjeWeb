import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Footer from "../../../components/Footer";
import SplitText from "../../Utilities/SplitText";
import kiranaShop from "../../../assets/945.png"; // Replace with relevant image
import Money from "../../../assets/HomeMoney.png"; // Replace with relevant image

const features = [
  {
    title: "Fast Onboarding",
    desc: "Get started quickly with minimal paperwork.",
    img: "https://via.placeholder.com/600x300"
  },
  {
    title: "Real-Time Tracking",
    desc: "Track your deliveries and earnings live.",
    img: "https://via.placeholder.com/600x300"
  },
  {
    title: "Flexible Scheduling",
    desc: "Choose your own working hours and routes.",
    img: "https://via.placeholder.com/600x300"
  },
  {
    title: "Instant Payouts",
    desc: "Receive your earnings instantly after delivery.",
    img: "https://via.placeholder.com/600x300"
  },
  {
    title: "Support & Training",
    desc: "Access 24/7 support and training resources.",
    img: "https://via.placeholder.com/600x300"
  },
  {
    title: "Rewards Program",
    desc: "Earn bonuses and rewards for top performance.",
    img: "https://via.placeholder.com/600x300"
  }
];

function useScrollReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
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

export default function DeliveryPartners() {
  const heroRef = useRef(null);
  const [heroWidth, setHeroWidth] = useState(100);
  const [heroRadius, setHeroRadius] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Section visibility hooks
  const [whyInViewRef, whyInView] = useScrollReveal();
  const [featuresInViewRef, featuresInView] = useScrollReveal();
  const [pricingInViewRef, pricingInView] = useScrollReveal();
  const [newsletterInViewRef, newsletterInView] = useScrollReveal();

  useEffect(() => {
    const darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkThemeQuery.matches);
    const handleThemeChange = (e) => setIsDarkMode(e.matches);
    darkThemeQuery.addEventListener('change', handleThemeChange);
    return () => darkThemeQuery.removeEventListener('change', handleThemeChange);
  }, []);

  // Hero scroll animation
  useEffect(() => {
    let ticking = false;
    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const start = 0;
            const end = -windowHeight * 1.2;
            let progress = 0;
            if (rect.top < start) {
              progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
            }
            const width = Math.round((100 - 15 * progress) * 100) / 100;
            const radius = Math.round(progress * 48 * 100) / 100;
            heroRef.current.style.width = `${width}vw`;
            heroRef.current.style.borderRadius = `${radius}px`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const flipVariants = {
    initial: { opacity: 0, y: 40 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <div className="min-h-screen font-eudoxus bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <motion.section
      ref={heroRef}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="max-w-full mx-auto py-16 px-4"
      >
        <h1 className=" pl-16 text-4xl md:text-6xl mt-16 font-bold mb-4 bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 bg-clip-text text-transparent">
          Delivery Partners
        </h1>
        <p className="pl-16 text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300">
          Join Sledge as a delivery partner and unlock new earning opportunities with flexible hours, instant payouts, and a supportive community.
        </p>
        <div className=" grid grid-cols-1 md:grid-cols-3 gap-6 ml-16 mr-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-gray-900 text-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">Flexible Hours</h2>
            <p>Work when you want, as much as you want.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-gray-900 text-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">Instant Payouts</h2>
            <p>Get paid quickly after every delivery.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-gray-900 text-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">Supportive Team</h2>
            <p>We’re here to help you succeed every step of the way.</p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}