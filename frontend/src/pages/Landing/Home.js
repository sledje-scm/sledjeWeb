import { motion, useAnimation, useInView, useTransform, useScroll } from "framer-motion";
import { BarChart, CreditCard, Package, ShoppingCart, TrendingUp, Users, Moon, Sun, ArrowRight, Star, CheckCircle, X, Sparkles } from "lucide-react";
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
import BG2 from "../../assets/Background2.png";
import CardSwap, { Card } from '../Utilities/CardSwap/cardSwap'

import { useRef, useEffect, useState,} from "react";


const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};


const testimonials = [
  {
    name: 'Jane Doe',
    role: 'Product Designer',
    quote: 'This product has completely transformed the way we work. Simple, elegant, and powerful.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
  },
  {
    name: 'John Smith',
    role: 'Software Engineer',
    quote: 'Fast, intuitive and polished — couldn’t ask for more.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4,
  },
  {
    name: 'Alicia Keys',
    role: 'Business Analyst',
    quote: 'Saved us hours of manual work. The simplicity is genius.',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'CTO, TechLabs',
    quote: 'Reliable, elegant and extremely efficient. Highly recommended!',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    rating: 5,
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

const Modalfeatures = [
  {
    title: "Inventory Management",
    desc: "Managing stock shouldn’t be a guessing game. Our Inventory Management system gives you real-time updates on what’s in stock, what’s running low, and what’s moving fast—so you can make smart, data-driven decisions. From barcode tracking to automated low-stock alerts, you’ll never have to worry about overordering or missing a sale. Whether you’re running a warehouse, retail store, or supply hub, the interface is intuitive and scalable to fit your operations. Say goodbye to outdated spreadsheets and hello to seamless stock control. Your business deserves a smarter, smoother way to manage inventory—this is it.",
    img: "https://support.apple.com/content/dam/edam/applecare/images/en_US/psp/psp_heroes/hero-banner-support-home.image.small_2x.jpg"
  },
  {
    title: "Billing Solutions",
    desc: "Billing should be fast, reliable, and professional—and that’s exactly what we deliver. With our comprehensive billing tools, you can generate invoices, send them instantly to customers, track payments, and set up recurring billing without a hitch. The system integrates seamlessly with your sales and customer data, giving you a full view of your financials in one place. Accept multiple payment modes and get notified when payments are delayed. Every invoice you send reflects your brand with customizable layouts and logos. Whether it’s a one-time transaction or a monthly subscription, billing has never been this easy or elegant.",
    img: "https://support.apple.com/content/dam/edam/applecare/images/en_US/psp/psp_heroes/hero-banner-support-home.image.small_2x.jpg"
  },
  {
    title: "Business Credit Management",
    desc: "Extend credit with confidence using our advanced business credit management system. Easily set credit limits for customers, monitor outstanding balances, and automate friendly payment reminders. Designed with transparency and accountability in mind, our tools help you maintain strong business relationships while protecting your bottom line. Detailed credit reports and real-time repayment tracking help you spot risks early and take action quickly. Whether you’re managing dozens of customers or just starting to offer credit, the system scales with your growth. Build trust, increase sales, and manage debt effectively—all from one centralized dashboard that puts you in control.",
    img: "https://support.apple.com/content/dam/edam/applecare/images/en_US/psp_heros/psp-hero-banner-watch.image.small_2x.jpg"
  },
  {
    title: "Supply Chain Management",
    desc: "Your supply chain is the backbone of your business—and we make sure it runs smoothly. Our supply chain management tools offer full visibility across procurement, warehousing, shipping, and delivery. Monitor supplier performance, reduce lead times, and forecast inventory needs with intelligent suggestions. You can track each order in real-time and resolve bottlenecks before they impact your customers. With built-in collaboration features, everyone from vendors to logistics managers stays in sync. Whether you’re handling simple deliveries or complex networks, this platform brings order and clarity to the chaos of supply. Get control, stay ahead, and keep everything moving efficiently.",
    img: "https://images.unsplash.com/photo-1605902711912-cfb43c4437e3?auto=format&fit=crop&w=1400&q=80"
  },
  {
    title: "Growth & Analytics",
    desc: "Data is only useful if it drives action. Our analytics dashboard turns complex numbers into clear, beautiful insights that help you grow faster. Track customer behavior, product performance, revenue trends, and operational KPIs—all in real time. Our tools help you identify what’s working, fix what isn’t, and uncover opportunities you didn’t even know existed. Use filters, visualizations, and comparison tools to go deep into your metrics. Whether you're preparing a pitch, tracking a campaign, or optimizing a workflow, our analytics help you move forward with confidence. It's not just about numbers—it's about smarter decisions and sustainable success.",
    img: "https://support.apple.com/content/dam/edam/applecare/images/en_US/psp_heros/psp-hero-banner-watch.image.small_2x.jpg"
  },
  {
    title: "Curated Business Support",
    desc: "Behind every successful business is a great support system. We go beyond software by offering personalized guidance, industry connections, and human expertise tailored to your unique needs. Whether you're seeking funding, improving operations, or expanding into new markets, our network of advisors and curated tools helps you get there faster. You can book strategy sessions, access expert content, or simply chat with a specialist who understands your space. Business is a journey—and you shouldn’t walk it alone. With our support, you gain a team that grows with you, every step of the way.",
    img: "https://support.apple.com/content/dam/edam/applecare/images/en_US/psp/psp_heroes/hero-banner-support-home.image.small_2x.jpg"
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
  const heroRef = useRef(null);
  const [heroWidth, setHeroWidth] = useState(100);
  const [heroRadius, setHeroRadius] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  // Newsletter Section
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  
  // Sledge Software Solutions section
  const sledgeRef = useRef(null);
  const [sledgeScale, setSledgeScale] = useState(1);
  const [sledgeTranslate, setSledgeTranslate] = useState(0);
  const [bgReveal, setBgReveal] = useState(0);
  const [isSledgeVisible, setIsSledgeVisible] = useState(false);
  const sledgeImageRef = useRef(null);

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

    // Newsletter Working Logic
    
      useEffect(() => {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                setIsNewsletterVisible(true);
              }
            },
            { threshold: 0.1 }
          );

          if (newsletterRef.current) {
            observer.observe(newsletterRef.current);
          }

          return () => observer.disconnect();
        }, []);

      useEffect(() => {
          const handleMouseMove = (e) => {
            if (newsletterRef.current) {
              const rect = newsletterRef.current.getBoundingClientRect();
              setMousePosition({ 
                x: e.clientX - rect.left, 
                y: e.clientY - rect.top 
              });
            }
          };

        const section = newsletterRef.current;
            if (section) {
              section.addEventListener('mousemove', handleMouseMove);
              return () => section.removeEventListener('mousemove', handleMouseMove);
            }
  }, []);

        const handleSubmit = async (e) => {
          e.preventDefault();
          if (!formData.name || !formData.email) return;
          
          setIsSubmitting(true);
          
          // Simulate API call - replace with your actual API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          setIsSubmitting(false);
          setShowThankYou(true);
          setFormData({ name: '', email: '' });
        };

        const handleInputChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const closeThankYou = () => {
          setShowThankYou(false);
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

  // Function for smooth scrolling
 const handleSmoothScroll = (id, duration = 700) => {
  const element = document.getElementById(id);
  if (!element) return;

  const targetY = element.getBoundingClientRect().top + window.pageYOffset;
  const startY = window.pageYOffset;
  const diff = targetY - startY;
  let start;

  function step(timestamp) {
    if (!start) start = timestamp;
    const time = timestamp - start;
    // Ease in-out
    const percent = Math.min(time / duration, 1);
    const ease = percent < 0.5
      ? 2 * percent * percent
      : -1 + (4 - 2 * percent) * percent;
    window.scrollTo(0, startY + diff * ease);
    if (time < duration) {
      window.requestAnimationFrame(step);
    }
  }
  window.requestAnimationFrame(step);
};


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
            const radius = Math.round(progress * 48 * 100) / 100; // Fixed: multiply by 100 for proper rounding
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
            const start = windowHeight * 1;
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

//Scroll Parallax
    let {scrollYProgress} = useScroll();
    let scrolly = useTransform(scrollYProgress, [0,1], ["0%","100%"]);


  
  return (
   <div className={`min-h-screen font-eudoxus transition-colors duration-300 overflow-x-hidden -mb-16 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div>


      {/* Hero Section with animated width and border radius */}
      <motion.section
          ref={heroRef}
          className="relative flex flex-col justify-center overflow-hidden p-0 m-0 mx-auto"
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
            
          }}
      >
        {/* Fullscreen Video - only covers the hero section */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          style={{ 
            minHeight: "100vh", 
            minWidth: "100vw", 
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
            minHeight: "100vh",
            minWidth: "100vw",
            borderRadius: `${heroRadius}px`,
            transform: "translateZ(0)", // Force hardware acceleration
            willChange: "border-radius", // Optimize for changes
          }}
        />
        {/* Content aligned to left and above the video */}
        <div 
          className="max-w-4xl relative z-20 flex flex-col items-start px-4 md:px-7 lg:px-12 ml-4 md:ml-16 lg:ml-8" // Reverted max-w-full, mx-auto, text-center
          style={{
            transform: "translateZ(0)", // Force hardware acceleration to prevent wobbling
          }}
        >
          <SplitText
            text="Bridging Retailers"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl py-2 font-bold leading-tight mb-3 md:mb-6 tracking-tight text-white text-left md:text-left" // Added md:text-left
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6 tracking-tight text-white text-left md:text-left" // Added md:text-left
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
            onClick={() => handleSmoothScroll('why-sledge-section')} // Smooth scroll to Why Choose Sledge
            className="mt-4 md:mt-8 px-6 md:px-10 py-2 md:py-3 border border-white text-white rounded-full bg-white bg-opacity-0 backdrop-sm font-medium transition hover:bg-opacity-20 text-sm md:text-base"
            style={{
              font:"Eudoxus Sans",
              fontWeight: 400,
              boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)"
            }}
          >
            Learn more
          </button>
        </div>
      </motion.section>     



      {/* Why Do We Exist Section */}
      <section
        ref={ExistRef}
        className={`flex flex-col md:flex-row justify-between items-center py-8 md:py-14 px-4 md:px-16 w-full transition-all duration-1000 ease-out transform ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        } ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
        style={{
          transitionDelay: isInView ? '200ms' : '0ms' // Added delay for later appearance
        }}
      >
        <div className={`w-full flex flex-col items-center md:items-start overflow-hidden md:ml-2 ml-0${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}> {/* Reverted items-center for mobile */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6 tracking-tight text-left md:text-left md:pr-20 pt-6 md:pt-12"> {/* Reverted text-center for mobile */}
            <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 bg-clip-text text-transparent font-eudoxus">
              Why Do We Exist
            </span>
          </h2>
          <div className={`text-sm md:text-xl text-center md:text-left pl-0 md:mt-4 font-eudoxus w-full ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}> {/* Reverted text-center for mobile */}
            To empower retailers and distributors with modern, efficient, and elegant software solutions 
          </div>
          <div className={`text-sm md:mt-2 md:text-xl text-center md:text-left pl-0 mb-4 md:mb-8 font-eudoxus w-full ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}> {/* Reverted text-center for mobile */}
             in the supply chain, enabling growth and clarity for every business.
          </div>
        </div>
      </section>


      </div>


      {/* Sledge Software Solutions Section */}    
      <section
      ref={sledgeRef}
      className={`text-center px-4 md:mb-8 py-16 md:py-28 lg:py-60 rounded-3xl w-full max-w-xl md:max-w-7xl mx-auto relative overflow-hidden transition-all duration-1000 ease-out transform ${ // Reverted max-w-full to max-w-7xl
      isSledgeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      style={{
      transitionDelay: isSledgeVisible ? '300ms' : '0ms',
       minHeight: '70vh' // force enough height to keep content in view on mobile
       
      }}
      >
        {/* Apple Background Image */}
        <motion.div
          className=" absolute inset-0 w-full h-full pointer-events-none select-none z-0"
          style={{
            backgroundImage: `url(${BG2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.8,
            filter: isDarkMode ? 'brightness(0.6) contrast(1.1)' : "brightness(0.7) contrast(1.3)",
          }}
        />

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 z-1" />

        {/* Your existing background reveal logic (optional - remove if not needed) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-2 overflow-hidden">
        {/* Background always */}
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} opacity-0`} />
        {/* Image revealed from bottom as you scroll */}
        <img
        src={kiranaShop}
        alt="Background"
        className="md:mt-32 absolute left-0 bottom-0 w-full object-cover transition-all duration-500 md:mt-16"
        style={{
        height: `${bgReveal * 95}%`,
        opacity: 1, // Reduced opacity so it blends with Apple background
        filter: `blur(${10 - 10 * bgReveal}px) ${isDarkMode ? 'brightness(0.6) contrast(1.1)' : ''}`,
        transition: "height 0.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 1s ease-out, filter 1s ease-out"
        }}
        />
      </div>

      <div
      className="relative z-10 transition-all duration-300"
      style={{
      transform: `scale(${sledgeScale}) translateY(${sledgeTranslate}px)`,
      transition: "height 0.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 1s ease-out, filter 1s ease-out"
      }}
      >
      <h1 className="text-7xl mt-[150px] md:mt-0 sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight md:mb-6 tracking-tight text-white drop-shadow-lg">
      Sledge
      </h1>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2 md:mb-6 tracking-tight text-blue-400 drop-shadow-lg">
      Software Solutions
      </h1>
      <p className="text-base md:text-xl mb-6 md:mb-10 max-w-2xl mx-auto px-4 text-gray-200 drop-shadow-lg">
      A premium UI crafted with Eudoxus Sans for clarity, elegance, and modern appeal. Designed for forward-thinkers.
      </p>
      <button 
        onClick={() => handleSmoothScroll('explore-section')} // Smooth scroll to ExploreSection
        className="px-6 md:px-8 py-2 md:py-3 text-base md:text-lg rounded-full transition-all bg-white text-gray-900 hover:bg-gray-100 shadow-lg">
      Explore Now
      </button>
      </div>
      </section>



      {/* --- Fullscreen Scrollable Rounded Rectangles Section --- */}
      <div id="explore-section"> {/* Added ID for smooth scrolling */}
          <ExploreSection />
      </div>
        
        
      {/* Why Choose Sledge Section */}
      <section
        ref={whySledgeRef}
        id="why-sledge-section"
        className={`w-full relative flex flex-col justify-center overflow-hidden mx-auto pt-8 md:pt-8 px-4 md:px-16 transition-all duration-1000 ease-out ${
          isWhySledgeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        } ${isDarkMode ? 'bg-gray-800' : 'bg-black'}`}
        style={{
          width: "100vw", // will be overridden dynamically
          height: "auto", // Changed to auto for responsiveness
          minHeight: "100vh", // Ensure it takes at least full viewport height
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 mb-8 md:mb-16 text-center md:text-left"> {/* Reverted text-center for mobile */}
            Why Choose Sledge
          </h2>

   {/* Mobile: Vertical stacked features with vertical scroll */}
        <div className="block md:hidden max-h-[calc(140vh-150px)] gap-2 overflow-y-auto px-0 space-y-4 pb-8"> {/* Adjusted max-h for better spacing */}
          {features.map((feature, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedFeature(idx)}
              className={`text-white p-6 rounded-3xl shadow-xl cursor-pointer hover:scale-105 transition-transform flex flex-col justify-between ${
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
              <p className="mt-3 text-white text-sm text-center mb-2">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>


          {/* Desktop: Grid layout */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Added lg:grid-cols-3 for larger screens */}
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

                  <button
                    type="button"
                    className="mt-4 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors focus:outline-none"
                    onClick={() => setSelectedFeature(idx)}
                  >
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Modal Overlay */}
        {selectedFeature !== null && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto"
            onClick={() => setSelectedFeature(null)}
          >
            <div
              className={`mx-auto relative rounded-2xl p-4 md:p-6 w-full max-w-7xl h-[95vh] md:h-[90vh] overflow-auto ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
              onClick={(e) => e.stopPropagation()} // prevent close on inner click
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedFeature(null)}
                className={`absolute top-2 md:top-1 right-3 md:right-1 text-xl md:text-4xl hover:text-red-500 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                &times;
              </button>

              {/* Image */}
              <img
              src={Modalfeatures[selectedFeature].img}
              alt={Modalfeatures[selectedFeature].title}
              className=" bg-white w-full h-64 md:h-[400px] object-cover rounded-xl mb-4 mt-4"
              style={{
                filter: isDarkMode ? 'brightness(0.9)' : 'none'
              }}
            />


              {/* Title & Description */}
              <h2 className={`text-2xl md:text-5xl font-bold mb-8 mt-8 pt-4 text-left pl-4 md:pl-16  ${isDarkMode ? 'text-blue-400' : 'text-blue-900'}`}>
                {Modalfeatures[selectedFeature].title}
              </h2>
              <div className={`rounded-3xl pt-3 pb-3 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
              <p className={`text-base md:text-2xl mt-4 px-4 py-8 tracking-wide ${isDarkMode ? 'text-gray-100' : 'text-gray-500'}`}>
                {Modalfeatures[selectedFeature].desc}
              </p>
              </div>
            </div>
          </div>
        )}



      {/* AI */}
      <section 
        ref={pricingRef}
        className={`w-full  md:py-0 px-4 md:px-8 lg:px-2 transition-all duration-1000 ease-out transform ${
          isPricingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        } ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
        style={{
          transitionDelay: isPricingVisible ? '500ms' : '0ms'
        }}
      >
      
      <div className="flex flex-row  md:flex-row items-left justify-top md:gap-4 gap-0 px-4 md:px-12 lg:px-20 md:pb-4">
        {/* Left Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left md:mt-64 mt-32">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Still Managing Manually</h2>
          <p className="text-gray-600 md:text-2xl mb-6">
           Innovation meets AI
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
            Learn More
          </button>
        </div>

        {/* Right CardSwap Section */}
        <div style={{ height: '600px', position: 'relative' }} className="w-full md:w-1/2 md:-mt-24 mb-32">
      <CardSwap
        cardDistance={60}
        verticalDistance={70}
        delay={2500}
        pauseOnHover={false}
      >
        {/* Card 1 */}
        <Card>
          <div className={`border  shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-2">
                Automated Orders
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                AI-powered analytics to help you stay ahead of the curve.
              </p>
            </div>
            <img
              src="https://www.apple.com/v/watch/br/images/overview/consider/feature_health__b2yo83wkzoaa_small_2x.jpg"
              alt="Insights"
              className="w-full h-72 object-cover"
            />
          </div>
        </Card>

        {/* Card 2 */}
        <Card>
          <div className={`border shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-2">
                In Sights
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                AI-powered analytics to help you stay ahead of the curve.
              </p>
            </div>
            <img
              src="https://www.apple.com/v/watch/br/images/overview/consider/feature_fitness__b5owsglf0ieu_small_2x.jpg"
              alt="Insights"
              className="w-full h-72 object-cover"
            />
          </div>
        </Card>

        {/* Card 3 */}
        <Card>
          <div className={`border shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-2">
                Automatic Leads
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                AI-powered analytics to help you stay ahead of the curve.
              </p>
            </div>
            <img
              src="https://www.apple.com/v/watch/br/images/overview/consider/feature_connectivity__cwtqydvy2laq_small.jpg"
              alt="Insights"
              className="w-full h-72 object-cover"
            />
          </div>
        </Card>

        {/* Card 4 */}
        <Card>
          <div className={`border shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-2">
                AI Inventory Control
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                AI-powered analytics to help you stay ahead of the curve.
              </p>
            </div>
            <img
              src="https://www.apple.com/v/watch/br/images/overview/consider/feature_health__b2yo83wkzoaa_small_2x.jpg"
              alt="Insights"
              className="w-full h-72 object-cover"
            />
          </div>
        </Card>
      </CardSwap>
    </div>
      </div>
       </section>



        {/* Pricing Section */}
        <section className={`px-4 md:mt-8 mt-4 md:pt-40 pt-32 md:ml-0 ml-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
          <div className="max-w-7xl mx-auto flex flex-row lg:flex-row items-center justify-between gap-4 md:gap-12 md:mt-0 mt-16">

            {/* Left Section - Pricing Card */}
            <div className="w-full lg:w-1/2 md:w-1/2 w-[600px] h-[300px] md:h-2/3 pt-16">
              <div className={`rounded-3xl shadow-xl p-10 md:p-10 hover:shadow-2xl transition duration-300 ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-200 border border-gray-200'
              }`}>
                
                {/* Price */}
                <div className="flex justify-center items-end gap-2 mb-4">
                  <span className={`text-5xl sm:text-6xl md:text-7xl font-extrabold ${
                    isDarkMode ? 'text-white' : 'text-gray-700'
                  }`}>
                    ₹99
                  </span>
                  <span className={`text-base mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>/month</span>
                </div>

                {/* Features */}
                <ul className={`text-sm md:text-base space-y-4 mb-10 text-center pr-8 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <li> Unlimited access to all features</li>
                  <li> AI-powered automation tools</li>
                  <li>24/7 support & updates</li>
                  <li> Instant onboarding</li>
                </ul>

                {/* CTA Button */}
                <div className="flex justify-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-4 py-3 rounded-full transition duration-300 shadow-md hover:shadow-lg md:w-1/3 w-auto">
                    Get Started Now
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section - Text */}
            <div className="w-full lg:w-1/2 text-left pt-40 md:pt-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                Low on Margins,
              </h2>
              <p className="text-2xl md:text-2xl mb-6">
                We care too..
              </p>
              <p className={`text-sm md:text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Whether you're scaling your business or just starting out, got you covered.
              </p>
            </div>

          </div>
        </section>





      {/* Highlight Section */}
      <section className={`w-full py-16 md:pt-40 pt-40 pl-8 -ml-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-[90%] mx-auto md:h-[80vh] h-[60vh] flex flex-row lg:flex-row md:gap-8 gap-4">

          {/* Left Subsection */}
          <div className={`w-full lg:w-1/2 relative rounded-3xl overflow-hidden flex items-start justify-center p-6 md:p-10 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>

            {/* Text content (top 40%) */}
            <div className="z-10 w-full text-center mt-2 md:mt-8">
              <h3 className={`text-2xl md:text-3xl font-semibold tracking-tight ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Built for Modern World
              </h3>
              <p className={`mt-2 text-sm md:text-base mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Experience design and efficiency like never before.
              </p>
            </div>

            {/* Background image at bottom 60% */}
            <div
              className="absolute bottom-0 left-0 w-full h-[70%] z-0"
              style={{
                backgroundImage: `url('https://www.apple.com/v/watch/br/images/overview/essentials/banner_bands__cd5m1690azaq_medium.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
          </div>

          {/* Right Subsection */}
          <div
            className="w-full lg:w-1/2 relative rounded-3xl overflow-hidden flex items-center justify-center p-6 md:p-10"
            style={{
              backgroundImage: `url('https://www.apple.com/v/watch/br/images/overview/essentials/banner_airpods__dc2h7dg71l0m_large.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: isDarkMode ? '#1f2937' : '#e5e7eb' // Tailwind: gray-800 / gray-200
            }}
          >
            <div className="bg-transparent rounded-xl px-6 py-2 text-center mb-16">
              <h3 className={`text-3xl md:text-4xl font-bold tracking-tight ${
                isDarkMode ? 'text-gray-900' : 'text-gray-900'
              }`}>
                Security at Peak
              </h3>
              <p className={`mt-3 mb-16 text-base md:text-lg ${
                isDarkMode ? 'text-gray-900' : 'text-gray-700'
              }`}>
                AI powered Security mechanism
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* Testimonials */}
      <section className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} px-4 py-20`}>
        <div className="max-w-6xl mx-auto">
          
          {/* Section Heading */}
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-16 text-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            What People Say
          </h2>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((t, index) => (
              <div
                key={index}
                className={`rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-gray-200'
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                {/* Avatar and Name */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className={`text-sm font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {t.name}
                    </div>
                    <div className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {t.role}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <p className={`text-sm leading-relaxed italic mb-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  “{t.quote}”
                </p>

                {/* Star Rating */}
                <div className="flex items-center">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.122-6.545L.487 6.91l6.562-.955L10 0l2.951 5.955 6.562.955-4.757 4.635 1.122 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      
          {/* Subscribe to Newsletter Section */}
          <section 
            ref={newsletterRef}
            className={`relative min-h-screen py-20 overflow-hidden ${
              isDarkMode ? 'bg-black' : 'bg-white'
            }`}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Dynamic Gradient Orbs */}
              <div 
                className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"
                style={{
                  top: '20%',
                  left: '10%',
                  transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                  transition: 'transform 0.3s ease-out'
                }}
              />
              <div 
                className="absolute w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"
                style={{
                  top: '60%',
                  right: '15%',
                  animationDelay: '1s',
                  transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
                  transition: 'transform 0.3s ease-out'
                }}
              />
              <div 
                className="absolute w-64 h-64 bg-gradient-to-r from-violet-500/25 to-indigo-500/25 rounded-full blur-3xl animate-pulse"
                style={{
                  top: '40%',
                  left: '50%',
                  animationDelay: '2s',
                  transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
                  transition: 'transform 0.3s ease-out'
                }}
              />
              
              {/* Floating Particles */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-1 h-1 rounded-full ${isDarkMode ? 'bg-white/20' : 'bg-black/10'} animate-pulse`}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 1}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              ))}
            </div>

            {/* Newsletter Content */}
            <div
              className={`relative z-10 w-full flex flex-col items-center justify-center text-center px-4 md:px-8 transition-all duration-1000 ease-out transform ${
                isNewsletterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'
              }`}
              style={{
                transitionDelay: isNewsletterVisible ? '200ms' : '0ms'
              }}
            >
              <div className="max-w-6xl mx-auto space-y-12">
                {/* Hero Text */}
                <div className="space-y-8">
                  <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Newsletter
                    </span>
                  </div>
                  
                  <h2 className={`text-4xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight transition-all duration-700 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <span className="block">Subscribe to </span>
                    <span className="block bg-gradient-to-r from-blue-600 via-blue-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                      Sledge
                    </span>
                    <span className="block text-xl md:text-3xl lg:text-4xl font-light mt-4 opacity-70">
                      Stay ahead of tomorrow
                    </span>
                  </h2>
                  
                  <p className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Exclusive insights, breakthrough innovations, and the future of business.
                    <span className="block mt-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-medium">
                      Delivered with precision.
                    </span>
                  </p>
                </div>

                {/* Form Container */}
                <div className={`relative max-w-2xl mx-auto p-8 md:p-12 rounded-3xl backdrop-blur-2xl transition-all duration-500 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-white/5 border border-white/10 shadow-2xl shadow-purple-500/10' 
                    : 'bg-black/5 border border-black/10 shadow-2xl shadow-black/10'
                }`}>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 space-y-8">
                    <div className="space-y-6">
                      <div className="relative group">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-8 py-6 text-lg rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:scale-105 placeholder:text-lg ${
                            isDarkMode
                              ? 'border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:border-purple-400 focus:bg-gray-900/70 focus:shadow-2xl focus:shadow-purple-500/20'
                              : 'border-gray-300 bg-white/70 text-gray-900 placeholder-gray-600 focus:border-purple-500 focus:bg-white focus:shadow-2xl focus:shadow-purple-500/20'
                          }`}
                          placeholder="Your name"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                      </div>

                      <div className="relative group">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-8 py-6 text-lg rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:scale-105 placeholder:text-lg ${
                            isDarkMode
                              ? 'border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:border-purple-400 focus:bg-gray-900/70 focus:shadow-2xl focus:shadow-purple-500/20'
                              : 'border-gray-300 bg-white/70 text-gray-900 placeholder-gray-600 focus:border-purple-500 focus:bg-white focus:shadow-2xl focus:shadow-purple-500/20'
                          }`}
                          placeholder="your@email.com"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !formData.name || !formData.email}
                      className={`group w-full px-12 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-purple-600 via-blue-600 to-blue-400 text-white hover:from-purple-500 hover:via-blue-400 hover:to-purple-500 hover:shadow-blue-500/50 ${
                        isSubmitting ? 'animate-pulse' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-3">
                          <div className=" text-2xl w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Joining the future...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-3">
                          <span>Join</span>
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className={`flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>No spam, ever</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Unsubscribe anytime</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Premium content</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thank You Popup */}
            {showThankYou && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
                <div className={`relative max-w-lg w-full rounded-3xl p-12 shadow-2xl transition-all duration-500 transform scale-100 ${
                  isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  {/* Confetti Effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 0.5}s`,
                          animationDuration: `${0.2 + Math.random()}s`
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={closeThankYou}
                    className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                      isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="relative z-10 text-center space-y-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30 animate-pulse">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className={`text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>
                        Welcome to the Future!
                      </h3>
                      <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        You're now part of an exclusive community of innovators and visionaries.
                      </p>
                      <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                        <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          🚀 What's next?
                        </p>
                        <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Check your inbox for your welcome gift and exclusive early access to our newest features.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
          </div>

  );
}