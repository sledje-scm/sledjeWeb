import React, { useState } from "react";
import { Trash, Check, FileText, ArrowDown, ArrowUp, PlusCircle, X } from "lucide-react";

const dummyOrders = [
	{
		customerName: "Shop A",
		orderId: "ORD123",
		items: [
			{ id: 1, item: "Product A", brand: "Brand X", quantity: 2, rate: 100 },
			{ id: 2, item: "Product B", brand: "Brand Y", quantity: 1, rate: 150 },
			{ id: 3, item: "Product C", brand: "Brand Z", quantity: 3, rate: 80 },
			{ id: 4, item: "Product D", brand: "Brand X", quantity: 2, rate: 90 },
		],
	},
	{
		customerName: "Shop B",
		orderId: "ORD456",
		items: [
			{ id: 5, item: "Product E", brand: "Brand X", quantity: 1, rate: 120 },
			{ id: 6, item: "Product F", brand: "Brand Y", quantity: 2, rate: 70 },
			{ id: 7, item: "Product G", brand: "Brand Z", quantity: 3, rate: 60 },
			{ id: 8, item: "Product H", brand: "Brand X", quantity: 1, rate: 200 },
		],
	},
];

const Shop = () => {
	const [upcomingOrders, setUpcomingOrders] = useState(dummyOrders);
	const [paymentOrders, setPaymentOrders] = useState([]);
	const [expandedCards, setExpandedCards] = useState({});
	const [showReports, setShowReports] = useState(false);
	const [completedOrders, setCompletedOrders] = useState([]);
	const [showOrderModal, setShowOrderModal] = useState(false);
	const [newOrder, setNewOrder] = useState({ customerName: "", orderId: "", items: [] });
	const [sortMode, setSortMode] = useState("none");

	const toggleExpand = (orderId) => {
		setExpandedCards((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
	};

	const moveToPayment = (orderId) => {
		const order = upcomingOrders.find((o) => o.orderId === orderId);
		setPaymentOrders((prev) => [...prev, order]);
		setUpcomingOrders((prev) => prev.filter((o) => o.orderId !== orderId));
	};

	const deleteOrderCard = (orderId) => {
		if (window.confirm("Are you sure to delete this order?")) {
			setUpcomingOrders((prev) => prev.filter((o) => o.orderId !== orderId));
		}
	};

	const deleteItem = (orderId, itemId) => {
		setUpcomingOrders((prev) =>
			prev.map((o) =>
				o.orderId === orderId
					? { ...o, items: o.items.filter((item) => item.id !== itemId) }
					: o
			)
		);
	};

	const handlePayment = (orderId, mode) => {
		const now = new Date();
		const order = paymentOrders.find((o) => o.orderId === orderId);
		const bill = {
			...order,
			mode,
			date: now.toLocaleDateString(),
			time: now.toLocaleTimeString(),
		};
		console.log("Generated Bill:", bill);
		if (mode === "credit") {
			alert("Credit bill generated. Redirect to borrower's page...");
		} else {
			alert("Paid bill generated.");
		}
		setPaymentOrders((prev) => prev.filter((o) => o.orderId !== orderId));
		setCompletedOrders((prev) => [...prev, bill]);
	};

	const calculateTotal = (items) =>
		items.reduce((acc, item) => acc + item.quantity * item.rate, 0);

	const calculateRevenue = () => {
		return completedOrders.reduce((total, order) => {
			return total + calculateTotal(order.items);
		}, 0);
	};

	const calculateProfit = () => {
		return calculateRevenue() * 0.2;
	};

	const sortedUpcomingOrders = [...upcomingOrders].sort((a, b) => {
		const totalA = calculateTotal(a.items);
		const totalB = calculateTotal(b.items);
		if (sortMode === "asc") return totalA - totalB;
		if (sortMode === "desc") return totalB - totalA;
		return 0;
	});

	const renderOrderCard = (order, isPayment = false) => (
		<div key={order.orderId} className="min-w-[280px] max-w-xs bg-white rounded-lg shadow-md p-4 mx-2">
			<div className="flex justify-between items-center mb-2">
				<h2 className="text-md font-bold">{order.customerName || "Custom"}</h2>
				<Trash
					className="w-4 h-4 text-red-500 cursor-pointer"
					onClick={() => deleteOrderCard(order.orderId)}
				/>
			</div>
			<div>
				{(expandedCards[order.orderId] ? order.items : order.items.slice(0, 3)).map((item) => (
					<div key={item.id} className="flex justify-between items-center text-sm border-b py-1">
						<div>
							<p>
								{item.item} ({item.brand})
							</p>
							{!isPayment && (
								<input
									type="number"
									min="1"
									value={item.quantity}
									onChange={(e) => {
										const quantity = parseInt(e.target.value);
										setUpcomingOrders((prev) =>
											prev.map((o) =>
												o.orderId === order.orderId
													? {
															...o,
															items: o.items.map((i) =>
																i.id === item.id ? { ...i, quantity } : i
															),
													  }
													: o
											)
										);
									}}
									className="w-12 border rounded px-1 text-xs"
								/>
							)}
						</div>
						{!isPayment && (
							<Trash
								className="w-3 h-3 text-red-400 cursor-pointer"
								onClick={() => deleteItem(order.orderId, item.id)}
							/>
						)}
					</div>
				))}
				{order.items.length > 3 && (
					<button
						className="text-xs text-blue-500 mt-1"
						onClick={() => toggleExpand(order.orderId)}
					>
						{expandedCards[order.orderId] ? "View Less" : "View More"}
					</button>
				)}
				<p className="mt-2 text-sm font-semibold">Total: ₹{calculateTotal(order.items)}</p>
				<p className="text-xs text-gray-500">Order ID: {order.orderId}</p>
				{!isPayment ? (
					<Check
						className="w-5 h-5 text-green-600 cursor-pointer mt-2"
						onClick={() => moveToPayment(order.orderId)}
					/>
				) : (
					<div className="flex gap-2 mt-2">
						{["cash", "upi", "credit"].map((mode) => (
							<button
								key={mode}
								onClick={() => handlePayment(order.orderId, mode)}
								className="text-xs px-2 py-1 bg-black text-white rounded-full"
							>
								{mode.toUpperCase()}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);

	const handleOrderInput = (field, value) => {
		setNewOrder((prev) => ({ ...prev, [field]: value }));
	};

	const handleAddNewOrder = () => {
		if (!newOrder.customerName || !newOrder.orderId) {
			alert("Please enter customer name and order ID.");
			return;
		}
		const orderWithItems = {
			...newOrder,
			items:
				newOrder.items.length > 0
					? newOrder.items
					: [
							{ id: Date.now(), item: "Sample Product", brand: "Brand X", quantity: 1, rate: 100 },
					  ],
		};
		setUpcomingOrders((prev) => [...prev, orderWithItems]);
		setShowOrderModal(false);
		setNewOrder({ customerName: "", orderId: "", items: [] });
	};

	return (
		<div className="pt-20 pb-16 px-6 space-y-8 bg-white min-h-screen">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Shop Dashboard</h1>
				<button
					onClick={() => setShowOrderModal(true)}
					className="flex items-center bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
				>
					<PlusCircle className="mr-2 w-4 h-4" /> Create Order
				</button>
			</div>

			{showOrderModal && (
				<div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
						<button
							className="absolute top-2 right-2 text-gray-600 hover:text-black"
							onClick={() => setShowOrderModal(false)}
						>
							<X className="w-5 h-5" />
						</button>
						<h2 className="text-lg font-semibold mb-4">Take Order</h2>
						<div className="space-y-4">
							<input
								type="text"
								placeholder="Customer Name"
								className="w-full px-3 py-2 border rounded"
								value={newOrder.customerName}
								onChange={(e) => handleOrderInput("customerName", e.target.value)}
							/>
							<input
								type="text"
								placeholder="Order ID"
								className="w-full px-3 py-2 border rounded"
								value={newOrder.orderId}
								onChange={(e) => handleOrderInput("orderId", e.target.value)}
							/>
							<button
								onClick={handleAddNewOrder}
								className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
							>
								Add Order
							</button>
						</div>
					</div>
				</div>
			)}

			<section>
				<h2 className="text-xl font-semibold mb-2">Upcoming Orders</h2>
				<div className="flex items-center gap-2 mb-2">
					<button
						onClick={() => setSortMode(sortMode === "asc" ? "desc" : "asc")}
						className="flex items-center bg-gray-200 px-3 py-1 text-sm rounded hover:bg-gray-300"
					>
						Sort by Total{" "}
						{sortMode === "asc" ? (
							<ArrowUp className="w-4 h-4 ml-1" />
						) : (
							<ArrowDown className="w-4 h-4 ml-1" />
						)}
					</button>
				</div>
				<div className="flex overflow-x-auto pb-2">
					{upcomingOrders.length === 0 ? (
						<p className="text-gray-500">No upcoming orders.</p>
					) : (
						<div className="flex">
							{sortedUpcomingOrders.map((order) => renderOrderCard(order))}
						</div>
					)}
				</div>
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-2">Payment Section</h2>
				<div className="flex overflow-x-auto pb-2">
					{paymentOrders.length === 0 ? (
						<p className="text-gray-500">No orders in payment section.</p>
					) : (
						<div className="flex">
							{paymentOrders.map((order) => renderOrderCard(order, true))}
						</div>
					)}
				</div>
			</section>

			<section>
				<button
					onClick={() => setShowReports(!showReports)}
					className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
				>
					<FileText className="inline-block mr-2" /> Reports
				</button>
				{showReports && (
					<div className="mt-4 border p-4 rounded-xl bg-gray-100">
						<h3 className="text-lg font-semibold mb-2">Business Summary</h3>
						<p>Total Revenue Today: ₹{calculateRevenue()}</p>
						<p>Profit Today: ₹{calculateProfit()}</p>
						<p>Monthly Revenue: ₹{calculateRevenue()}</p>
						<p>Monthly Profit: ₹{calculateProfit()}</p>
						<div className="mt-4">
							<h4 className="font-semibold mb-2">Completed Orders</h4>
							{completedOrders.length === 0 ? (
								<p className="text-gray-500">No completed orders.</p>
							) : (
								<ul className="text-sm text-gray-700 space-y-2">
									{completedOrders.map((order) => (
										<li key={order.orderId}>
											<strong>{order.customerName || "Custom"}</strong> - #{order.orderId} - ₹
											{calculateTotal(order.items)} - {order.mode.toUpperCase()} on{" "}
											{order.date} at {order.time}
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				)}
			</section>
		</div>
	);
};

export default Shop;
