import { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ merchant: "", status: "", date: "" });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("/api/transactions");
        const sorted = res.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setPayments(sorted);
      } catch (err) {
        setError("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((p) => {
    const matchesMerchant = filters.merchant
      ? p.merchant?.toLowerCase().includes(filters.merchant.toLowerCase())
      : true;
    const matchesStatus = filters.status
      ? p.status?.toLowerCase() === filters.status.toLowerCase()
      : true;
    const matchesDate = filters.date
      ? new Date(p.timestamp).toISOString().slice(0, 10) === filters.date
      : true;
    return matchesMerchant && matchesStatus && matchesDate;
  });

  const groupByDate = (payments) => {
    const grouped = {};
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    payments.forEach((payment) => {
      const date = new Date(payment.timestamp);
      const key = date.toDateString() === today.toDateString()
        ? "Today"
        : date.toDateString() === yesterday.toDateString()
        ? "Yesterday"
        : date.toDateString();

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(payment);
    });

    return grouped;
  };

  const groupedPayments = groupByDate(filteredPayments);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Received Payments</h1>

      {/* Filter Toggle Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-gray-200 rounded shadow hover:bg-gray-300"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters Menu */}
      {showFilters && (
        <div className="mb-6 border p-4 rounded-md bg-gray-50">
          <ul className="flex flex-col md:flex-row gap-4 list-none">
            <li className="w-full md:w-1/3">
              <input
                type="text"
                placeholder="Filter by Merchant"
                className="border p-2 rounded w-full"
                value={filters.merchant}
                onChange={(e) => setFilters({ ...filters, merchant: e.target.value })}
              />
            </li>
            <li className="w-full md:w-1/4">
              <select
                className="border p-2 rounded w-full"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </li>
            <li className="w-full md:w-1/4">
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              />
            </li>
          </ul>
        </div>
      )}

      {loading ? (
        <p>Loading payments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredPayments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedPayments).map(([date, payments]) => (
            <div key={date}>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">{date}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-sm">
                      <th className="p-3 border">Order ID</th>
                      <th className="p-3 border">Amount</th>
                      <th className="p-3 border">Merchant</th>
                      <th className="p-3 border">Status</th>
                      <th className="p-3 border">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-50">
                        <td className="p-3 border">{payment.orderId}</td>
                        <td className="p-3 border">₹{payment.amount}</td>
                        <td className="p-3 border">{payment.merchant || "N/A"}</td>
                        <td
                          className={`p-3 border font-medium ${
                            payment.status === "success"
                              ? "text-green-600"
                              : payment.status === "failed"
                              ? "text-red-500"
                              : "text-yellow-600"
                          }`}
                        >
                          {payment.status}
                        </td>
                        <td className="p-3 border text-sm text-gray-600">
                          {new Date(payment.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
