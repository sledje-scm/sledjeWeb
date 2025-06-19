import { motion, useAnimation, useInView } from "framer-motion";
import { BarChart, CreditCard, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
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



export default function LandingPage() {
  const heroRef = useRef(null);
  const [heroWidth, setHeroWidth] = useState("100vw");
  const [heroRadius, setHeroRadius] = useState("0px");
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);


  // Sledge Software Solutions section
  const sledgeRef = useRef(null);
  const [sledgeScale, setSledgeScale] = useState(1);
  const [sledgeTranslate, setSledgeTranslate] = useState(0);
  const [bgReveal, setBgReveal] = useState(0); // 0 = hidden, 1 = fully revealed

  // Why Do We Exist section
  const whyExistRef = useRef(null);
  const [whyExistScale, setWhyExistScale] = useState(1);

  // WHy Sledge Ref Section
  const whySledgeRef = useRef(null);
  const [whySledgeWidth, setwhySledgeWidth] = useState("100vw");
  const [whySledgeRadius, setwhySledgeRadius] = useState("0px");


  useEffect(() => {
    function handleScroll() {
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
        const width = 100 - 15 * progress;
        const radius = progress * 48;
        heroRef.current.style.width = `${width}vw`;
        heroRef.current.style.borderRadius = `${radius}px`;
      }
      // WHY SLEDGE REF SECTION ANIMATION ---
      if (whySledgeRef.current) {
        const rect = whySledgeRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const start = 0;
        const end = -windowHeight * 1.2;
        let progress = 0;
        if (rect.top < start) {
          progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
        }
        const width = 100 - 15 * progress;
        const radius = progress * 48;
        whySledgeRef.current.style.width = `${width}vw`;
        whySledgeRef.current.style.borderRadius = `${radius}px`;
      }

      // --- SLEDGE SECTION ANIMATION ---
      if (sledgeRef.current) {
        const rect = sledgeRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const start = windowHeight * 0.3;
        const end = -windowHeight * 0.2;
        let progress = 0;
        if (rect.top < start) {
          progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
        }
        // Text shrinks and moves up
        setSledgeScale(1 - 0.3 * progress);
        setSledgeTranslate(-350 * progress);

        // Background reveal: from white to image, reveal from bottom
        setBgReveal(progress);
      }

      // --- WHY DO WE EXIST SECTION ANIMATION ---
      if (whyExistRef.current) {
        const rect = whyExistRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const start = windowHeight * 0.3;
        const end = -windowHeight * 0.5;
        let progress = 0;
        if (rect.top < start) {
          progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
        }
        setWhyExistScale(1 - 0.15 * progress); // Shrink a bit less than hero
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-eudoxus ">
      {/* Hero Section with animated width and border radius */}
      <section
        ref={heroRef}
        className="relative flex flex-col justify-center overflow-hidden p-0 m-0 mx-auto transition-all duration-[0ms] ease-linear"
        style={{
          width: heroWidth,
          height: "100vh",
          borderRadius: heroRadius,
          background: "#fff",
          boxShadow: heroRadius !== "0px" ? "0 8px 32px 0 rgba(36,41,54,0.13)" : undefined,
        }}
      >
        {/* Fullscreen Video - only covers the hero section */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          style={{ minHeight: "100vh", minWidth: "100vw", borderRadius: heroRadius, transition: "border-radius 0.5s cubic-bezier(0.4,0,0.2,1)" }}
        >
          <source src="https://www.onelineage.com/sites/default/files/2023-05/main_page_032323_web.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Subtle dark gradient overlay from left */}
        <div
          className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, rgba(20,30,48,0.7) 40%, rgba(20,30,48,0.2) 70%, rgba(20,30,48,0) 100%)",
            minHeight: "100vh",
            minWidth: "100vw",
            borderRadius: heroRadius,
            transition: "border-radius 0.5s cubic-bezier(0.4,0,0.2,1)"
          }}
        />
        {/* Content aligned to left and above the video */}
        <div className="max-w-4xl relative z-20 flex flex-col items-start px-7 md:px-12 ml-16 md:ml-8">
          <SplitText
            text="Bridging Retailers"
            className="text-5xl md:text-6xl py-2 font-bold leading-tight mb-6 tracking-tight text-white md:tracking-tight text-left"
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
            className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight text-white md:tracking-tight text-left"
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
            className="mt-8 px-10 py-3 border border-white text-white rounded-full bg-white bg-opacity-0 backdrop-sm font-medium transition hover:bg-opacity-20 text-bold"
            style={{
              font:"Eudoxus Sans",
              fontWeight: 400,
              boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)"
            }}
          >
            Learn more
          </button>
        </div>
      </section>
        {/* Why Do We Exist Section */}
        <section
          ref={whyExistRef}
          className="flex justify-between items-centre py-14 bg-white pl-2 pr-2 w-full"
        >
          <div
            className="w-full justify-between items-centre bg-white rounded-2xl  p-0 flex flex-col items-start overflow-hidden"
            style={{
              transform: `scale(${whyExistScale})`,
              transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)", // match hero section
              willChange: "transform"
            }}
          >
            <h2 className="text-7xl md:text-5xl font-bold leading-tight mb-6 tracking-tight text-left pl-16 pt-12">
              <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 bg-clip-text text-transparent font-eudoxus">
                Why Do We Exist
              </span>
            </h2>
            <div className="text-xl text-gray-600 mb-10  text-left pl-16 mb-8 font-eudoxus w-full pr-16">
              We exist to empower retailers and distributors with modern, efficient, and elegant software solutions that bridge the gap in the supply chain, enabling growth and clarity for every business.
            </div>
            {/* <img
              src={Earth}
              alt="Why Do We Exist"
              className="w-full object-cover shadow"
              style={{ height: "30rem " }}
            /> */}
          </div>
        </section>

      {/* Sledge Software Solutions Section */}    
      <section
        ref={sledgeRef}
        className="text-center px-6 py-28 md:py-40 max-w-5xl mx-auto relative overflow-hidden"
        style={{ minHeight: "60vh" }}
      >
        {/* Background reveal: white to image, revealed from bottom */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          {/* White background always */}
          <div className="absolute inset-0 bg-white" />
          {/* Image revealed from bottom as you scroll */}
          <img
            src={kiranaShop}
            alt="Background"
            className="absolute left-0 bottom-0 w-full object-cover transition-all duration-500"
            style={{
              height: `${bgReveal * 100}%`,
              opacity: bgReveal,
              filter: `blur(${10 - 10 * bgReveal}px)`,
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
          <h1 className="text-7xl md:text-5xl font-bold leading-tight mb-6 tracking-tight ">
            Sledge 
          </h1>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight text-blue-400">
            Software Solutions
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            A premium UI crafted with Eudoxus Sans for clarity, elegance, and modern appeal. Designed for forward-thinkers.
          </p>
          <button className="bg-black text-white px-8 py-3 text-lg rounded-full hover:bg-gray-900 transition-all">
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
          className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setSelectedFeature(null)}
        >
          <div
            className="relative bg-white rounded-2xl p-6 w-[90%] md:w-[150vh] h-[95vh] overflow-auto"
            onClick={(e) => e.stopPropagation()} // prevent close on inner click
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedFeature(null)}
              className="absolute top-3 right-4 text-2xl text-gray-600 hover:text-red-500"
            >
              &times;
            </button>

            {/* Image */}
            <img
              src={kiranaShop}
              alt={features[selectedFeature].title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />

            {/* Title & Description */}
            <h2 className="text-3xl font-bold mb-2 text-blue-900">
              {features[selectedFeature].title}
            </h2>
            <p className="text-gray-800 text-lg">{features[selectedFeature].desc}</p>
          </div>
        </div>
      )}

      {/* Section */}
      <section ref={whySledgeRef}
        className="relative flex flex-col justify-center overflow-hidden p-0 m-0 mx-auto transition-all duration-[0ms] ease-linear bg-black pl-16 pr-16"
        style={{
          width: heroWidth,
          height: "130vh",
          borderRadius: heroRadius,
          background: "black",
          boxShadow: heroRadius !== "0px" ? "0 8px 32px 0 rgba(36,41,54,0.13)" : undefined,
        }}>
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 mb-16">
          Why Choose Sledge
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
          {features.map((feature, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedFeature(idx)}
              className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform flex flex-col justify-between h-[250px]"
            >
              <div className="flex-grow flex items-end">
                <h3 className="text-2xl font-semibold text-center w-full">
                  {feature.title}
                </h3>
              </div>
              <p className="mt-4 text-white text-base text-center">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="w-full bg-white py-24 px-8 md:px-32">
  <h2 className="text-7xl md:text-5xl font-bold leading-tight mb-6 tracking-tight ">
    Low On Margins, We Care Too
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 items-center">
    {/* Left Content */}
    <div>
      <h1 className="text-8xl font-extrabold leading-none text-black mb-6 font-arial pl-12">99</h1>
      <p className="text-2xl text-gray-700 leading-snug max-w-md">
        the cost for all this because,<br />
        <span className="font-semibold"> Sledge is never a burden.</span>
      </p>
    </div>

    {/* Right Image Placeholder */}
    <div className="w-full h-[400px] md:h-[400px]  bg-gray-200 rounded-2xl flex justify-end">
      {/* Replace src with your image */}
      <img
        src={Money}
        alt="Sledge Pricing Visual"
        className="object-cover w-full h-full justify-end rounded-2xl md:rounded-3xl"
      />
    </div>
  </div>
</section>
{/* Subscribe to Newsletter Section */}
<div className="w-full bg-white py-20 flex flex-col items-center justify-center text-center px-4">
  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Subscribe to Our Newsletter</h2>
  <p className="text-lg text-gray-600 max-w-xl mb-8">
    Stay updated with the latest features, business tools, and tips to grow with Sledge.
  </p>

  <form className="w-1/3 max-w-md flex flex-col sm:flex-col gap-4">
    <input
      type="email"
      placeholder="Name"
      className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
    />
    <input
      type="email"
      placeholder="Email"
      className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
    />
    
  </form>
  <button
      type="submit"
      className="px-6 py-4 bg-black text-white font-semibold rounded-full hover:opacity-90 transition duration-300 mt-2"
    >
      Subscribe
    </button>
</div>
    </div>
  );
}
