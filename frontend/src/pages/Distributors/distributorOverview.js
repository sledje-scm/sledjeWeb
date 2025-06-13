import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function DistributorOverview() {
  // Dummy data — replace with backend data fetching later
  const stats = [
    { label: "Total Products", value: 56 },
    { label: "Total Retailers", value: 24 },
    { label: "Orders Today", value: 12 },
    { label: "Pending Shipments", value: 7 },
    { label: "Revenue This Month", value: "₹2,40,000" },
  ];

  const retailerActivities = [
    { name: "Retail Mart", value: "₹10,200", date: "5 June", status: "Delivered" },
    { name: "QuickBuy", value: "₹3,500", date: "4 June", status: "Pending" },
    { name: "MegaStore", value: "₹12,000", date: "3 June", status: "On Way" },
  ];

  const topRetailers = [
    { name: "MegaStore", total: "₹1,20,000" },
    { name: "Retail Mart", total: "₹90,000" },
    { name: "QuickBuy", total: "₹75,000" },
  ];

  const lowStockProducts = [
    { name: "Parle-G", stock: 12 },
    { name: "Amul Milk", stock: 5 },
    { name: "Colgate", stock: 7 },
  ];

  const chartData = [
    { name: "1 Jun", revenue: 5000 },
    { name: "2 Jun", revenue: 12000 },
    { name: "3 Jun", revenue: 8000 },
    { name: "4 Jun", revenue: 18000 },
    { name: "5 Jun", revenue: 15000 },
  ];

  return (
    <div className="p-4 md:p-8 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Distributor Overview
      </h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 shadow hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xl font-semibold text-blue-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Activity + Top Retailers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-4">
            Recent Retailer Orders
          </h2>
          <ul>
            {retailerActivities.map((act, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center py-2 border-b last:border-none text-sm"
              >
                <span className="font-medium">{act.name}</span>
                <span>{act.value}</span>
                <span>{act.date}</span>
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    act.status === "Delivered"
                      ? "bg-green-500"
                      : act.status === "Pending"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                >
                  {act.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-4">
            Top Retailers by Revenue
          </h2>
          <ul className="text-sm">
            {topRetailers.map((r, i) => (
              <li
                key={i}
                className="flex justify-between py-2 border-b last:border-none"
              >
                <span>
                  {i + 1}. {r.name}
                </span>
                <span className="font-semibold">{r.total}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Low Stock + Revenue Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-4">Low Stock Products</h2>
          <ul className="text-sm">
            {lowStockProducts.map((p, i) => (
              <li
                key={i}
                className="flex justify-between items-center py-2 border-b last:border-none"
              >
                <span>{p.name}</span>
                <span className="text-red-600 font-medium">
                  {p.stock} left
                </span>
                <button className="text-sm text-blue-500 hover:underline">
                  Restock
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
