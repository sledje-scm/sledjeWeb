import { useEffect, useRef, useState } from "react";
import GunjanImage from "../assets/founders/G.jpeg";
import { Trash, Check, CircleCheck, CreditCard, Phone } from "lucide-react";

// Carousel card images
import Card1 from "../assets/carousel/Card1.png";
import Card2 from "../assets/carousel/Card2.png";
import Card3 from "../assets/carousel/Card3.png";
import Card4 from "../assets/carousel/Card4.png";

export default function You() {
  const favoriteDistributors = [
    { name: "Hindustan Distributors", contact: "+91 9876543210" },
    { name: "Bharat Traders", contact: "+91 9123456789" },
    { name: "Agro India Supplies", contact: "+91 9988776655" },
    { name: "Dairy Fresh Distributors", contact: "+91 8877665544" },
    { name: "Global Wholesale", contact: "+91 7766554433" },
  ];

  const carouselItems = [
    {
      title: "Slege Delivery Solutions",
      description: "Forget the hectic: from loading to unloading: All Covered.",
      image: Card1,
    },
    {
      title: "Slege Billing Solutions",
      description: "1 Click and Done: No tangling in bills.",
      image: Card2,
    },
    {
      title: "Slege Business IOT Solutions",
      description: "We build, you enjoy.",
      image: Card3,
    },
    {
      title: "Slege Black ALL-IN-ONE",
      description: "Everything everywhere all at once.",
      image: Card4,
    },
  ];

  // Carousel auto-scroll logic
  const carouselRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const container = carouselRef.current;
        const cardWidth = container.offsetWidth / 2;
        const maxScroll = container.scrollWidth - container.offsetWidth;

        const newPos = scrollPos + cardWidth;
        container.scrollTo({
          left: newPos >= maxScroll ? 0 : newPos,
          behavior: "smooth",
        });
        setScrollPos(newPos >= maxScroll ? 0 : newPos);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [scrollPos]);

  return (
    <div className="min-h-screen bg-blue-100 p-6 flex gap-6">
      {/* Your Account Section */}
      <div className="flex-1 bg-blue-600 text-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Your Account</h1>

        {/* Account Areas */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="flex items-center bg-blue-700 p-4 rounded-lg shadow">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <CircleCheck className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Your Orders History</h3>
              <p className="text-sm text-gray-200">View and manage your past orders.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-4 rounded-lg shadow">
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Login and Security</h3>
              <p className="text-sm text-gray-200">Update your password and account settings.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-4 rounded-lg shadow">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <Trash className="w-8 h-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Your Addresses</h3>
              <p className="text-sm text-gray-200">Manage your saved delivery addresses.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-4 rounded-lg shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Your Cards and Payments</h3>
              <p className="text-sm text-gray-200">Manage your saved cards and payment methods.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-4 rounded-lg shadow col-span-2">
            <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-pink-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Contact Us</h3>
              <p className="text-sm text-gray-200">Reach out to us for support or inquiries.</p>
            </div>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Discover More with Slege</h2>
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth"
            style={{ scrollBehavior: "smooth" }}
          >
            {carouselItems.map((item, idx) => (
              <div
                key={idx}
                className="min-w-[45%] max-w-[45%] bg-blue-100 rounded-xl shadow-md p-4 flex-shrink-0"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-28 w-full object-cover rounded-lg mb-3"
                />
                <h3 className="text-lg font-bold text-blue-800">{item.title}</h3>
                <p className="text-sm text-blue-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Details Section */}
      <div className="w-2/5 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Personal Details</h2>
        <div className="flex items-center bg-blue-50 p-4 rounded-lg shadow mb-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
            <img src={GunjanImage} alt="Owner" className="w-full h-full object-cover" />
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-blue-800">Gunjan Sharma</h3>
            <p className="text-gray-600">Owner : Hindu Pharma</p>
            <p className="text-gray-600">Email: akash2244@gmail.com</p>
            <p className="text-gray-600">Phone: +91 9876543210</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Favourite Distributors</h3>
          <div className="overflow-y-auto" style={{ maxHeight: "150px" }}>
            {favoriteDistributors.map((distributor, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow mb-2"
              >
                <p className="text-blue-800 font-medium">{distributor.name}</p>
                <p className="text-gray-600">{distributor.contact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}