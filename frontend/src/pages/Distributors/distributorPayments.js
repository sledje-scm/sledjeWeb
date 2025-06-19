import { useState } from "react";
import { Mail, AlertTriangle, CheckCircle, MessageCircle } from "lucide-react";

export default function DistributorPayments() {
  const [retailers, setRetailers] = useState([
    {
      id: 1,
      name: "Retail Mart",
      amountDue: 2500,
      lastPaid: "2 June",
      status: "Pending",
    },
    {
      id: 2,
      name: "QuickBuy",
      amountDue: 0,
      lastPaid: "5 June",
      status: "Paid",
    },
    {
      id: 3,
      name: "MegaStore",
      amountDue: 5000,
      lastPaid: "29 May",
      status: "Overdue",
    },
  ]);

  const notifyRetailer = (id) => {
    alert(`Payment reminder sent to Retailer ID: ${id}`);
  };

  return (
    <div className="p-4 md:p-8 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Retailer Payments</h1>

      <div className="bg-white rounded-2xl shadow p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="p-3 text-left">Retailer</th>
                <th className="p-3 text-left">Amount Due</th>
                <th className="p-3 text-left">Last Paid</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {retailers.map((r) => (
                <tr
                  key={r.id}
                  className="border-b last:border-none hover:bg-blue-50"
                >
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3 text-gray-800">₹{r.amountDue}</td>
                  <td className="p-3">{r.lastPaid}</td>
                  <td className="p-3">
                    <span
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold ${
                        r.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : r.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.status === "Paid" && <CheckCircle size={14} />}
                      {r.status === "Pending" && <AlertTriangle size={14} />}
                      {r.status === "Overdue" && <AlertTriangle size={14} />}
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {r.status !== "Paid" && (
                      <button
                        onClick={() => notifyRetailer(r.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 transition"
                      >
                        <Mail size={14} /> Notify
                      </button>
                    )}
                    {r.status === "Paid" && (
                      <span className="text-gray-400 text-xs">No action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Support */}
      <div className="mt-8 bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Need Help? Contact Customer Support
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          If a retailer disputes a payment, contact our support team.
        </p>
        <a
          href="mailto:support@yourcompany.com"
          className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition"
        >
          <MessageCircle size={18} />
          Email Support
        </a>
      </div>
    </div>
  );
}
