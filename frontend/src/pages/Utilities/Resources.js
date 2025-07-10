import { motion, useAnimation, useInView, useTransform, useScroll } from "framer-motion";
import { BarChart, CreditCard, Package, ShoppingCart, TrendingUp, Users, Moon, Sun, ArrowRight, Star } from "lucide-react";
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import Footer from "../../components/Footer";
import kiranaShop from "../../assets/945.png";
import SplitText from "../Utilities/SplitText";
import Earth from "../../assets/HomeEarth.png";
import Home1 from "../../assets/Home1.png";
import Home2 from "../../assets/Home2.png";
import Home3 from "../../assets/Home3.png";
import Home4 from "../../assets/Home4.png";
import Money from "../../assets/HomeMoney.png";
import ExploreSection from "../../components/ExploreSection";

import { useRef, useEffect, useState } from "react";


const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};
const testimonials = [
    {
      quote: "This product redefined my workflow — pure excellence.",
      name: "Aarav Mehta",
      role: "UX Designer",
    },
    {
      quote: "Everything just works. Effortlessly smooth experience.",
      name: "Sara Li",
      role: "Product Manager",
    },
    {
      quote: "The design feels thoughtful. Apple-level polish, truly.",
      name: "Jordan Smith",
      role: "Developer Advocate",
    },
  ];


const features = [
  {
    title: "Inventory Management",
    desc: "Stay updated with real-time stock levels.",
    img: "https://via.placeholder.com/600x300"
  },
  {
    title: "Billing Solutions",
    desc: "Generate invoices and manage transactions effortlessly.",
    img: "https://via.placeholder.com/600x300"
  },
  {
    title: "Business Credit Management",
    desc: "Offer and track credit transactions securely.",
    img: "https://via.placeholder.com/600x300"
  },
  {
    title: "Supply Chain Management",
    desc: "Optimize and streamline supply chain operations.",
    img: "https://via.placeholder.com/600x300"
  },
  {
    title: "Growth & Analytics",
    desc: "Gain insights to scale your business effectively.",
    img: "https://via.placeholder.com/600x300"
  },
  {
    title: "Curated Business Support",
    desc: "Get expert advice and tailored support.",
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
          observer.disconnect(); // Only once
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}


export default function LandingPage() {
  const existRef = useRef(null);
  const isExistInView = useInView(existRef, { margin: "-40% 0px -40% 0px" });
  const heroRef = useRef(null);
  const [heroWidth, setHeroWidth] = useState(100);
  const [heroRadius, setHeroRadius] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  
  // Sledge Software Solutions section
  const sledgeRef = useRef(null);
  const [sledgeScale, setSledgeScale] = useState(1);
  const [sledgeTranslate, setSledgeTranslate] = useState(0);
  const [bgReveal, setBgReveal] = useState(0);
  const [isSledgeVisible, setIsSledgeVisible] = useState(false);

  // Why Sledge Ref Section
  const whySledgeRef = useRef(null);
  const [whySledgeWidth, setWhySledgeWidth] = useState(100);
  const [whySledgeRadius, setWhySledgeRadius] = useState(0);
  const [isWhySledgeVisible, setIsWhySledgeVisible] = useState(false);

  // Why exist section
  const ExistRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  // Pricing section
  const pricingRef = useRef(null);
  const [isPricingVisible, setIsPricingVisible] = useState(false);

  // Newsletter section
  const newsletterRef = useRef(null);
  const [isNewsletterVisible, setIsNewsletterVisible] = useState(false);

  const flipVariants = {
    initial: {
    opacity: 0,
    y: 40, // start from below
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20, // fade and go upward
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    };
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    };
    // Dark Theme
    useEffect(() => {
      // Detect initial system theme
      const darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(darkThemeQuery.matches);

      // Listen for system theme changes
      const handleThemeChange = (e) => {
        setIsDarkMode(e.matches);
      };

      darkThemeQuery.addEventListener('change', handleThemeChange);

      // Cleanup listener when component unmounts
      return () => darkThemeQuery.removeEventListener('change', handleThemeChange);
    }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 } // Reduced threshold for earlier trigger
    );

    if (ExistRef.current) {
      observer.observe(ExistRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Pricing section observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPricingVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (pricingRef.current) {
      observer.observe(pricingRef.current);
    }

    return () => observer.disconnect();
  }, []);
// Pricing section observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPricingVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (pricingRef.current) {
      observer.observe(pricingRef.current);
    }

    return () => observer.disconnect();
  }, []);
  // Newsletter section observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNewsletterVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (newsletterRef.current) {
      observer.observe(newsletterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Main Animations
  useEffect(() => {
  let ticking = false;
  
   function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        // --- HERO SECTION ANIMATION ---
        if (heroRef.current) {
          const rect = heroRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const start = 0.;
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

        // --- WHY SLEDGE SECTION ANIMATION --- (FIXED)
        if (whySledgeRef.current) {
          const rect = whySledgeRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Check if section is in view for visibility
          if (rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2) {
            setIsWhySledgeVisible(true);
          }
          
          // Only calculate scroll animation if section is visible
          if (rect.top <= windowHeight && rect.bottom >= 0) {
            const start = 0;
            const end = -windowHeight * 1.2;
            let progress = 0;
            if (rect.top < start) {
              progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
            }
            const width = Math.round((100 - 15 * progress) * 100) / 100;
            const radius = Math.round(progress * 48 * 100) / 100;
            whySledgeRef.current.style.width = `${width}vw`;
            whySledgeRef.current.style.borderRadius = `${radius}px`;
          }
        }

        // --- SLEDGE SECTION ANIMATION ---
        if (sledgeRef.current) {
          const rect = sledgeRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Check if section is in view for visibility
          if (rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2) {
            setIsSledgeVisible(true);
          }
          
          // Only calculate animation if section is in viewport
          if (rect.top <= windowHeight && rect.bottom >= 0) {
            const start = windowHeight * 0.3;
            const end = -windowHeight * 0.2;
            let progress = 0;
            if (rect.top < start) {
              progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
            }
            setSledgeScale(1 - 0.3 * progress);
            setSledgeTranslate(-350 * progress);
            setBgReveal(progress);
          }
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

  // Parallax Alternative
 const { scrollYProgress: heroScroll } = useScroll({
  target: heroRef,
  offset: ["start start", "end start"], // track scroll within the pinned area
  layoutEffect: false
});
const y = useTransform(heroScroll, [0,1], ["0%", "100%"]);

const { scrollYProgress} = useScroll();
const k = useTransform(heroScroll, [0,2], ["0%", "100%"]);

  return (
   <div className={`min-h-screen font-eudoxus transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <motion.div className={`sticky top-0 h-screen`}
      style={{
      backgroundImage:`url(${Earth})`,
       backgroundPositionY: k
      }}
      >
        
      </motion.div>
      {/* Hero Section with animated width and border radius */}
      <motion.section
          ref={heroRef}
          className="flex flex-col justify-center overflow-hidden p-0 m-0 mx-auto"
          initial="initial"
          animate="enter"
           exit="exit"
          variants={flipVariants}
          style={{
            width: `${heroWidth}vw`,
            height: "100vh",
            borderRadius: `${heroRadius}px`,
             transformStyle: "preserve-3d",
            perspective: 1000,
            y
          }}
      >
        {/* Fullscreen Video - only covers the hero section */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-[100vh] object-cover z-0"
          style={{ 

            minHeight: "100vh", 
            maxWidth: "100vw", 
            borderRadius: `${heroRadius}px`,
            transform: "translateZ(0)", // Force hardware acceleration
            willChange: "border-radius", // Optimize for changes
            filter: isDarkMode ? "brightness(0.7) contrast(1.1)" : "none"
          }}
        >
          <source src="https://www.onelineage.com/sites/default/files/2023-05/main_page_032323_web.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Subtle dark gradient overlay from left */}
        <div
          className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
          style={{
            background: isDarkMode 
              ? "linear-gradient(to right, rgba(10,20,35,0.85) 40%, rgba(10,20,35,0.4) 70%, rgba(10,20,35,0.1) 100%)"
              : "linear-gradient(to right, rgba(20,30,48,0.7) 40%, rgba(20,30,48,0.2) 70%, rgba(20,30,48,0) 100%)",
            minHeight: "200vh",
            minWidth: "100vw",
            borderRadius: `${heroRadius}px`,
            transform: "translateZ(0)", // Force hardware acceleration
            willChange: "border-radius", // Optimize for changes
          }}
        />
        {/* Content aligned to left and above the video */}
        <motion.div 
          className="max-w-4xl relative z-20 flex flex-col items-start px-4 md:px-7 lg:px-12 ml-4 md:ml-16 lg:ml-8"
          style={{
            transform: "translateZ(0)", // Force hardware acceleration to prevent wobbling
          }}
          animate={{
            y: isExistInView ? -80 : 0,           // move up when next section visible
            opacity: isExistInView ? 0 : 1,       // fade out when next section visible
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <SplitText
            text="Bridging Retailers"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl py-2 font-bold leading-tight mb-3 md:mb-6 tracking-tight text-white text-left"
            delay={80}
            duration={0.4}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
          <SplitText
            text="& Distributors"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6 tracking-tight text-white text-left"
            delay={80}
            duration={0.4}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
          <button
            className="mt-4 md:mt-8 px-6 md:px-10 py-2 md:py-3 border border-white text-white rounded-full bg-white bg-opacity-0 backdrop-sm font-medium transition hover:bg-opacity-20 text-sm md:text-base"
            style={{
              font:"Eudoxus Sans",
              fontWeight: 400,
              boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)"
            }}
          >
            Learn more
          </button>
        </motion.div>
      </motion.section>   
                          
      {/* Why Do We Exist Section */}
      <section
        ref={ExistRef}
        className={` relative flex justify-between items-center py-8 md:py-14 pl-4 pr-2 max-w-7xl transition-all duration-1000 ease-out transform ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        } ${isDarkMode ? 'bg-gray-900' : 'bg-transparent'}`}
        style={{
          transitionDelay: isInView ? '0ms' : '0ms' // Added delay for later appearance
        }}
      >
        <div className={`w-full rounded-2xl flex flex-col items-start overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-transparent'}`}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6 tracking-tight text-left pl-4 md:pl-64 md:ml-32 pt-6 md:pt-12">
            <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 bg-clip-text text-transparent font-eudoxus">
              Why Do We Exist
            </span>
          </h2>
          <div className={`text-base md:text-xl text-left pl-64 mb-4 md:mb-8 font-eudoxus max-w-full pr-4 md:pr-32 ${isDarkMode ? 'text-gray-300' : 'text-white'}`}>
            We exist to empower retailers and distributors with modern, efficient, and elegant software solutions that bridge the gap in the supply chain, enabling growth and clarity for every business.
          </div>
        </div>
      </section>
      {/* Sledge Software Solutions Section */}    
      <section
        ref={sledgeRef}
        className={` text-center px-2 md:px-6 py-16 md:py-28 lg:py-40 max-w-full mx-auto relative overflow-hidden transition-all duration-1000 ease-out transform ${
          isSledgeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
        style={{ 
          minHeight: "60vh",
          transitionDelay: isSledgeVisible ? '0ms' : '0ms'
        }}
      >
        {/* Background reveal: white to image, revealed from bottom */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          {/* Background always */}
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} />
          {/* Image revealed from bottom as you scroll */}
          <img
            src={kiranaShop}
            alt="Background"
            className="absolute left-0 bottom-0 w-full object-cover transition-all duration-500 md:mt-16"
            style={{
              height: `${bgReveal * 100}%`,
              opacity: bgReveal,
              filter: `blur(${10 - 10 * bgReveal}px) ${isDarkMode ? 'brightness(0.6) contrast(1.1)'  : ''}`,
              transition: "height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s, filter 0.4s"
            }}
          />
        </div>
        <div
          className="relative z-10 transition-all duration-300"
          style={{
            transform: `scale(${sledgeScale}) translateY(${sledgeTranslate}px)`,
            transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)"
          }}
        >
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6 tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Sledge 
          </h1>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6 tracking-tight text-blue-400">
            Software Solutions
          </h1>
          <p className={`text-base md:text-xl mb-6 md:mb-10 max-w-2xl mx-auto px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            A premium UI crafted with Eudoxus Sans for clarity, elegance, and modern appeal. Designed for forward-thinkers.
          </p>
          <button className={`px-6 md:px-8 py-2 md:py-3 text-base md:text-lg rounded-full transition-all ${
            isDarkMode 
              ? 'bg-white text-gray-900 hover:bg-gray-100' 
              : 'bg-black text-white hover:bg-gray-900'
          }`}>
            Explore Now
          </button>
        </div>
      </section>

      {/* --- Fullscreen Scrollable Rounded Rectangles Section --- */}
      <div>
        <ExploreSection />
      </div>
      
      {/* Modal Overlay */}
      {selectedFeature !== null && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedFeature(null)}
        >
          <div
            className={`relative rounded-2xl p-4 md:p-6 w-full max-w-4xl h-[90vh] md:h-[95vh] overflow-auto ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
            onClick={(e) => e.stopPropagation()} // prevent close on inner click
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedFeature(null)}
              className={`absolute top-2 md:top-3 right-3 md:right-4 text-xl md:text-2xl hover:text-red-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              &times;
            </button>

            {/* Image */}
            <img
              src={kiranaShop}
              alt={features[selectedFeature].title}
              className="w-full h-48 md:h-64 object-cover rounded-lg mb-4"
              style={{
                filter: isDarkMode ? 'brightness(0.9)' : 'none'
              }}
            />

            {/* Title & Description */}
            <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-900'}`}>
              {features[selectedFeature].title}
            </h2>
            <p className={`text-base md:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              {features[selectedFeature].desc}
            </p>
          </div>
        </div>
      )}

      {/* Why Choose Sledge Section */}
      <section
        ref={whySledgeRef}
        className={`w-full relative flex flex-col justify-center overflow-hidden mx-auto pt-8 md:pt-8 px-4 md:pl-16 pr-4 md:pr-16 transition-all duration-1000 ease-out ${
          isWhySledgeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        } ${isDarkMode ? 'bg-gray-800' : 'bg-black'}`}
        style={{
          width: "100vw", // will be overridden dynamically
          height: "130vh",
          borderRadius: "0px",
          boxShadow: heroRadius !== "0px" ? (isDarkMode ? "0 8px 32px 0 rgba(0,0,0,0.6)" : "0 8px 32px 0 rgba(36,41,54,0.13)") : undefined,
          transform: "translateZ(0)",
          willChange: "width, border-radius"
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            // Apply scroll-based transforms to inner container instead
            transform: isWhySledgeVisible ? 'none' : 'translateY(20px)',
            transition: 'transform 1000ms ease-out',
            transitionDelay: isWhySledgeVisible ? '400ms' : '0ms',
          }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 mb-8 md:mb-16">
            Why Choose Sledge
          </h2>

   {/* Mobile: Vertical stacked features with vertical scroll */}
        <div className="block md:hidden max-h-[100vh] overflow-y-auto px-4 space-y-4 pb-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedFeature(idx)}
              className={`text-white p-6rounded-3xl shadow-xl cursor-pointer hover:scale-105 transition-transform flex flex-col justify-between ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-900 hover:bg-gray-800'
              }`}
              style={{
                transform: isWhySledgeVisible ? 'translateY(0)' : 'translateY(30px)',
                opacity: isWhySledgeVisible ? 1 : 0,
                transition: `all 800ms ease-out`,
                transitionDelay: isWhySledgeVisible ? `${500 + idx * 100}ms` : '0ms',
              }}
            >
              <div className="flex-grow flex items-end">
                <h3 className="text-xl font-semibold text-center w-full">
                  {feature.title}
                </h3>
              </div>
              <p className="mt-3 text-white text-sm text-center">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>


          {/* Desktop: Grid layout */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`text-white p-8 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform flex flex-col justify-between h-[250px] ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-900 hover:bg-gray-800'
                }`}
                style={{
                  transform: isWhySledgeVisible ? 'translateY(0)' : 'translateY(30px)',
                  opacity: isWhySledgeVisible ? 1 : 0,
                  transition: `all 800ms ease-out`,
                  transitionDelay: isWhySledgeVisible ? `${500 + idx * 100}ms` : '0ms',
                }}
              >
               <div className="bg-gray hover:bg-gray rounded-3xl p-6 md:p-8 h-full transition-all duration-300 group-hover:shadow-purple-500/10">
                  <div className="flex items-center mb-4">
                    {idx === 0 && <Package className="w-8 h-8 text-blue-400 mr-3" />}
                    {idx === 1 && <CreditCard className="w-8 h-8 text-green-400 mr-3" />}
                    {idx === 2 && <Users className="w-8 h-8 text-purple-400 mr-3" />}
                    {idx === 3 && <TrendingUp className="w-8 h-8 text-orange-400 mr-3" />}
                    {idx === 4 && <BarChart className="w-8 h-8 text-pink-400 mr-3" />}
                    {idx === 5 && <ShoppingCart className="w-8 h-8 text-teal-400 mr-3" />}
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    {feature.desc}
                  </p>
                  <div className="mt-4 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section 
        ref={pricingRef}
        className={`w-full py-12 md:py-24 px-4 md:px-8 lg:px-16 transition-all duration-1000 ease-out transform ${
          isPricingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        } ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
        style={{
          transitionDelay: isPricingVisible ? '500ms' : '0ms'
        }}
      >
        <h2 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight  ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Low On Margins, We Care Too
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center sm:pl-64 ">
          {/* Left Content */}
          <div>
            <h1 className={`text-6xl md:text-8xl font-extrabold leading-none mb-4 md:mb-6 font-arial pl-2 md:pl-16 sm:pl-32  ${isDarkMode ? 'text-white' : 'text-black'}`}>99</h1>
            <p className={`text-lg md:text-2xl leading-snug max-w-md px-2 md:px-0  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              the cost for all this because,<br />
              <span className="font-semibold"> Sledge is never a burden.</span>
            </p>
          </div>

          {/* Right Image Placeholder */}
          <div className={`w-full h-[250px] md:h-[400px] rounded-2xl flex justify-end ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            {/* Replace src with your image */}
            <img
              src={Money}
              alt="Sledge Pricing Visual"
              className="object-cover w-full h-full justify-end rounded-2xl md:rounded-3xl"
              style={{
                filter: isDarkMode ? 'brightness(0.9) contrast(1.1)' : 'none'
              }}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-900 px-4 py-4">
          <div className="max-w-full mx-auto text-left md:pl-16 mt-16 md:text-7xl mb-16">
             <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 mb-8 md:mb-16">
               The Masses
             </h2>
             
            <div className="grid gap-8 md:grid-cols-3 md:pt-4">
              {testimonials.map((t, index) => (
                <div
                  key={index}
                  className="bg-gray-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition duration-300"
                >
                 {[...Array(testimonials.rating)].map((t, i) => (
                    <Star key={5} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <p className="text-lg text-gray-800 mb-4 italic">“{t.quote}”</p>
                  <div className="text-sm text-gray-600 font-medium">
                    {t.name}
                  </div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                    </div>
              ))}
            </div>
            <div className="grid gap-8 md:grid-cols-3 md:pt-4">
              {testimonials.map((t, index) => (
                <div
                  key={index}
                  className="bg-gray-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition duration-300"
                >
                  {[...Array(testimonials.rating)].map((t, i) => (
                    <Star key={5} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <p className="text-lg text-gray-800 mb-4 italic">“{t.quote}”</p>
                  <div className="text-sm text-gray-600 font-medium">
                    {t.name}
                  </div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                    </div>
              ))}
            </div>

          </div>
        </section>
      
      {/* Subscribe to Newsletter Section */}
      <div 
        ref={newsletterRef}
        className={`w-full py-12 md:py-20 flex flex-col items-center justify-center text-center px-4 transition-all duration-1000 ease-out transform ${
          isNewsletterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        } ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
        style={{
          transitionDelay: isNewsletterVisible ? '600ms' : '0ms'
        }}
      >
        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Subscribe to Our Newsletter</h2>
        <p className={`text-base md:text-lg max-w-xl mb-6 md:mb-8 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Stay updated with the latest features, business tools, and tips to grow with Sledge.
        </p>

        <form className="w-full max-w-sm md:max-w-md flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className={`flex-1 px-4 md:px-6 py-2 md:py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' 
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
            }`}
          />
          <input
            type="email"
            placeholder="Email"
            className={`flex-1 px-4 md:px-6 py-2 md:py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' 
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
            }`}
          />
        </form>
        <button
          type="submit"
          className={`px-6 py-3 md:py-4 font-semibold rounded-full transition duration-300 mt-2 ${
            isDarkMode 
              ? 'bg-white text-gray-900 hover:bg-gray-100' 
              : 'bg-black text-white hover:opacity-90'
          }`}
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}










