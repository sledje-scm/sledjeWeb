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
    <div className="p-4 md:p-8 bg-white min-h-screen md:pl-16 md:pr-16">
     <h2 className="text-4xl md:text-5xl font-bold md:leading-tight mb-6 tracking-tight text-between md:pt-4 md:pl-4">
              <span className="bg-black bg-clip-text text-transparent font-eudoxus">
                Receive Quickly, 
              </span>
              <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 bg-clip-text text-transparent font-eudoxus pl-2">
                 Payments
              </span>
            </h2>

      <div className="bg-white rounded-3xl shadow p-4 ">
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
      <div className="flex flex-col lg:flex-row gap-6 mt-10 w-full">
  {/* Customer Support Section */}
  <div className="flex-1 bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
    <h2 className="text-2xl font-semibold text-gray-900 mb-3">Need Help? Contact Support</h2>
    <p className="text-gray-600 mb-6">
      Questions or concerns about your account? Reach out and we’ll get back to you as soon as possible.
    </p>
    <a
      href="mailto:support@yourcompany.com"
      className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition"
    >
      <MessageCircle size={18} />
      Write to Us
    </a>
  </div>

  {/* Payment History Section */}
  <div className="flex-1 bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 rounded-3xl shadow-xl p-8 border border-gray-200 flex items-center justify-center opacity-60">
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-white mb-2">Payment History</h2>
      <p className="text-white">Coming Soon</p>
    </div>
  </div>
</div>

      </div>

  );
}
