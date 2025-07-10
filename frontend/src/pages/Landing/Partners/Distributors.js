import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const features = [
	{
		title: "Smart Inventory",
		desc: "Track and manage your stock in real-time with ease.",
		img: "https://via.placeholder.com/600x300",
	},
	{
		title: "Easy Billing",
		desc: "Generate invoices and manage transactions effortlessly.",
		img: "https://via.placeholder.com/600x300",
	},
	{
		title: "Customer Insights",
		desc: "Understand your customers and boost loyalty.",
		img: "https://via.placeholder.com/600x300",
	},
	{
		title: "Growth Analytics",
		desc: "Get actionable insights to grow your retail business.",
		img: "https://via.placeholder.com/600x300",
	},
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

export default function Distributors() {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [selectedFeature, setSelectedFeature] = useState(null);
	const [featuresInViewRef, featuresInView] = useScrollReveal();

	useEffect(() => {
		const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
		setIsDarkMode(darkThemeQuery.matches);
		const handleThemeChange = (e) => setIsDarkMode(e.matches);
		darkThemeQuery.addEventListener("change", handleThemeChange);
		return () => darkThemeQuery.removeEventListener("change", handleThemeChange);
	}, []);

	return (
		<div
			className={`min-h-screen font-eudoxus transition-colors duration-300 ${
				isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
			}`}
		>
			{/* Hero Section */}
			<section className="relative flex flex-col justify-center items-start min-h-[10vh] px-8 py-24 pl-16">
				<motion.h1
					className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 bg-clip-text text-transparent"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
				>
					
          Distributors
				</motion.h1>
				<motion.p
					className="text-lg md:text-2xl mb-8 max-w-2xl"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.2 }}
				>
					Empowering distributors with modern tools for inventory, billing, and
					customer relationships.
				</motion.p>
				<motion.button
					className="px-8 py-3 rounded-full bg-black text-white font-semibold shadow-lg hover:bg-gray-800 transition"
					whileHover={{ scale: 1.05 }}
				>
					Join as Distributor
				</motion.button>
			</section>

			{/* Features Section */}
			<section
				ref={featuresInViewRef}
				className={`w-fullrelative flex flex-col justify-center overflow-hidden mx-auto md:pt-8 px-4 md:pl-16 pr-4 md:pr-16 transition-all duration-1000 ease-out ${
					featuresInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
				} ${isDarkMode ? "bg-gray-900" : "bg-black"}`}
				style={{
					width: "100vw",
					minHeight: "10vh",
					borderRadius: "0px",
				}}
			>
				<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 mb-8 md:mb-16">
					A Glance
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
					{features.map((feature, idx) => (
						<motion.div
							key={idx}
							whileHover={{ scale: 1.05 }}
							className={`text-white p-8 rounded-2xl shadow-xl cursor-pointer flex flex-col justify-between h-[250px] ${
								isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-900 hover:bg-gray-800"
							}`}
							style={{
								transition: `all 800ms cubic-bezier(0.4,0,0.2,1)`,
								transitionDelay: featuresInView ? `${200 + idx * 100}ms` : "0ms",
							}}
							onClick={() => setSelectedFeature(idx)}
						>
							<div>
								<h3 className="text-xl md:text-2xl font-bold text-white mb-2">
									{feature.title}
								</h3>
								<p className="text-gray-300 text-base md:text-lg leading-relaxed">
									{feature.desc}
								</p>
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
						<h2 className="text-2xl font-bold mb-2">
							{features[selectedFeature].title}
						</h2>
						<p className="text-base">
							{features[selectedFeature].desc}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}