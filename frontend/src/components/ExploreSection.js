import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const ExploreSection = () => {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount:0.25 });
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView]);

  const cards = [
    { img: "https://www.apple.com/v/iphone/home/cb/images/overview/consider/apple_intelligence__gbh77cvflkia_large.jpg", title: "Shop" },
    { img: "https://www.apple.com/v/iphone/home/cb/images/overview/consider/camera__exi2qfijti0y_large.jpg", title: "Inventory" },
    { img: "https://www.apple.com/v/iphone/home/cb/images/overview/consider/privacy__ckc0wa30o55y_large_2x.jpg", title: "Orders" },
    { img: "https://www.apple.com/v/iphone/home/cb/images/overview/consider/safety__bwp7rsowtjiu_large.jpg", title: "Shelf" },
    { img: "https://www.apple.com/v/iphone/home/cb/images/overview/consider/apple_intelligence__gbh77cvflkia_large.jpg", title: "You" }
  ];

  const containerVariants = {
    hidden: { y: 50 },
    visible: {
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.25,
        duration: 0.8,
        staggerChildren: 0.12
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, scale: 0.98 },
    visible: {
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 22
      }
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      className="w-full relative z-30 flex flex-col items-center pt-24"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <h2 className="text-5xl font-eudoxus font-bold tracking-tight mb-8 text-left w-full px-4 md:pl-16">
        Explore Our Platform
      </h2>

      <motion.div
        className="w-full h-[70vh] overflow-x-auto flex space-x-4 md:space-x-8 px-4 md:px-8 py-8 ml-24"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          overflowY: "hidden"
        }}
      >
        {cards.map((card, idx) => {
          const isSelected = selectedCard === idx;

          return (
            <motion.div
              key={idx}
              className="flex-shrink-0 rounded-3xl shadow-lg flex items-center justify-center overflow-hidden relative cursor-pointer"
              onClick={() => setSelectedCard(isSelected ? null : idx)}
              variants={cardVariants}
              style={{
                width: isSelected ? "95vw" : "22vw",
                minWidth: isSelected ? "95vw" : "22vw",
                maxWidth: isSelected ? "95vw" : "22vw",
                height: "70vh",
                scrollSnapAlign: "start",
                zIndex: isSelected ? 20 : 1,
                transform: isSelected ? "scale(1.01)" : "none",
                transition: "transform 0.4s ease-in-out"
              }}
            >
              <img
                src={card.img}
                alt={card.title}
                className="object-cover w-full h-full rounded-3xl"
                draggable={false}
                loading="lazy"
              />

              {/* Overlay text */}
              <div className="absolute top-0 left-0 p-5 z-10 text-white drop-shadow-lg">
                <div className="font-eudoxus text-3xl font-bold tracking-tight">
                  {card.title}
                </div>
                <div className="text-base font-medium text-blue-200">
                  {card.title} section
                </div>
              </div>

              {isSelected && (
                <div
                  className="absolute bottom-6 left-6 right-6 z-10 bg-white/80 backdrop-blur-md rounded-xl p-4 text-gray-900"
                >
                  <p>This is the detailed description of the {card.title} section.</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
};

export default ExploreSection;
