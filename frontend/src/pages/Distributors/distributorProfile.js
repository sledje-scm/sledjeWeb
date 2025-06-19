import { useEffect, useRef, useState } from "react";
import NishantImage from "../../assets/founders/N.png";
import { Package, Settings, MapPin, CreditCard, Phone } from "lucide-react";

import Card1 from "../../assets/carousel/Card1.png";
import Card2 from "../../assets/carousel/Card2.png";
import Card3 from "../../assets/carousel/Card3.png";
import Card4 from "../../assets/carousel/Card4.png";

export default function DistributorProfile() {
  const topRetailers = [
    { name: "Retail Mart", contact: "+91 9876543210" },
    { name: "QuickBuy", contact: "+91 9123456789" },
    { name: "MegaStore", contact: "+91 9988776655" },
    { name: "Daily Fresh", contact: "+91 8877665544" },
    { name: "Smart Retailers", contact: "+91 7766554433" },
  ];

  const carouselItems = [
    {
      title: "Slege Distributor Insights",
      description: "Track retailers, sales, orders all in one place.",
      image: Card1,
    },
    {
      title: "Automated Billing",
      description: "Focus on business, let us handle the books.",
      image: Card2,
    },
    {
      title: "Logistics Made Easy",
      description: "Plan delivery and pickups without calls.",
      image: Card3,
    },
    {
      title: "Everything Connected",
      description: "Your business. Your control. Anywhere.",
      image: Card4,
    },
  ];

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
    <div className="min-h-screen bg-blue-100 p-3 md:p-6 flex flex-col lg:flex-row gap-3 md:gap-6">
      <div className="flex-1 bg-blue-600 text-white rounded-lg shadow-lg p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Distributor Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="flex items-center bg-blue-700 p-4 rounded-lg shadow">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Manage Orders</h3>
              <p className="text-sm text-gray-200">View and fulfill incoming retailer requests.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-4 rounded-lg shadow">
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
              <Settings className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Account Settings</h3>
              <p className="text-sm text-gray-200">Configure your distributor profile and regions.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-4 rounded-lg shadow">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Delivery Zones</h3>
              <p className="text-sm text-gray-200">Set and update your delivery service areas.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-4 rounded-lg shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Payments</h3>
              <p className="text-sm text-gray-200">Track payments received from retailers.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-4 rounded-lg shadow sm:col-span-2">
            <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-pink-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Support</h3>
              <p className="text-sm text-gray-200">Need help? Get in touch with our team.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-blue-800 mb-4">What’s New</h2>
          <div ref={carouselRef} className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth">
            {carouselItems.map((item, idx) => (
              <div
                key={idx}
                className="min-w-[80%] sm:min-w-[45%] bg-blue-100 rounded-xl shadow-md p-4 flex-shrink-0"
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

      <div className="w-full lg:w-2/5 bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Your Profile</h2>
        <div className="flex flex-col sm:flex-row items-center bg-blue-50 p-4 rounded-lg shadow mb-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
            <img src={NishantImage} alt="Distributor" className="w-full h-full object-cover" />
          </div>
          <div className="sm:ml-4 text-center sm:text-left mt-3 sm:mt-0">
            <h3 className="text-xl font-semibold text-blue-800">Rajiv Mehta</h3>
            <p className="text-base text-gray-600">Owner : Mehta Distributors</p>
            <p className="text-base text-gray-600 break-all">Email: mehta.distributors@gmail.com</p>
            <p className="text-base text-gray-600">Phone: +91 9876543210</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Top Retailers</h3>
          <div className="overflow-y-auto" style={{ maxHeight: "150px" }}>
            {topRetailers.map((retailer, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-3 rounded-lg shadow mb-2"
              >
                <p className="text-blue-800 font-medium text-base">{retailer.name}</p>
                <p className="text-gray-600 text-sm break-all">{retailer.contact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
