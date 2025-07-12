import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const goals = [
	{
		title: "Empower Businesses",
		desc: "Provide innovative tools and resources to help businesses grow and succeed.",
		icon: "🚀",
	},
	{
		title: "Drive Innovation",
		desc: "Continuously push the boundaries of technology and business solutions.",
		icon: "💡",
	},
	{
		title: "Sustainable Impact",
		desc: "Focus on solutions that are good for people, profit, and the planet.",
		icon: "🌱",
	},
	{
		title: "Global Reach",
		desc: "Expand our services and impact to communities worldwide.",
		icon: "🌍",
	},
];

export default function Goals() {
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
					src="https://support.apple.com/content/dam/edam/applecare/images/en_US/psp_heros/psp-hero-banner-macfamily-3.image.large_2x.jpg"
					alt="Vision Hero"
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
						Our Vision & Goals
					</motion.h1>
					<motion.p
						className="text-lg md:text-2xl mb-8 max-w-2xl text-white text-center"
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.2 }}
					>
						What drives us forward every day.
					</motion.p>
				</div>
			</section>

			{/* Goals Grid */}
			<section className="w-full flex justify-center items-center py-16 px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
					{goals.map((goal, idx) => (
						<motion.div
							key={idx}
							whileHover={{ scale: 1.05 }}
							className={`bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 flex flex-col items-center text-center h-full transition-transform`}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7, delay: 0.1 * idx }}
						>
							<div className="text-5xl mb-4">{goal.icon}</div>
							<h3 className="text-xl font-bold">{goal.title}</h3>
							<p className="mt-2 text-gray-700 dark:text-gray-200">
								{goal.desc}
							</p>
						</motion.div>
					))}
				</div>
			</section>
		</div>
	);
}