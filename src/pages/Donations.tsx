import { useState } from "react";
import { Link } from "react-router-dom";

export function Donations() {
  const [amount, setAmount] = useState<number | "">(500);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const openRazorpay = () => {
    const key = import.meta.env.VITE_RAZORPAY_KEY as string | undefined;
    if (!key) {
      alert("Razorpay key not configured. Set VITE_RAZORPAY_KEY in your .env file.");
      return;
    }

    if (!amount || Number(amount) <= 0) return alert("Enter a valid donation amount");

    // Ensure script is loaded
    if (!(window as any).Razorpay) {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      s.onload = launch;
      document.body.appendChild(s);
    } else launch();

    function launch() {
      const opts: any = {
        key,
        amount: Math.round(Number(amount) * 100),
        name: "Filhaal Trust Donation",
        description: `Donation by ${name || "Supporter"}`,
        handler: function (res: any) {
          alert("Donation successful. Payment ID: " + res.razorpay_payment_id);
        },
        prefill: {
          name,
          email,
        },
        theme: { color: "#B91C1C" },
      };

      const rzp = new (window as any).Razorpay(opts);
      rzp.open();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Support Filhaal — Donations</h1>

      <p className="text-gray-700 mb-4">Filhaal runs on reader support and donations. The Filhaal Trust accepts contributions from Indian citizens, NRIs and persons of Indian origin. Donations to the trust may be tax-exempt under applicable law.</p>

      <div className="bg-white border rounded p-6 mb-6">
        <h2 className="font-semibold mb-2">Bank Transfer (traditional)</h2>
        <p className="text-sm text-gray-700">You may transfer donations via bank transfer to the Filhaal Trust bank account:</p>
        <ul className="text-sm text-gray-700 list-disc pl-5 mt-2">
          <li>Bank: State Bank of India, Shree Krishna Nagar Branch, Patna</li>
          <li>Account No: 10223781906</li>
          <li>IFSC: SBIN</li>
        </ul>
      </div>

      <div className="bg-white border rounded p-6">
        <h2 className="font-semibold mb-3">Donate Online (Razorpay)</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700">Amount (INR)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")} className="mt-1 w-40 border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Name (optional)</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Email (optional)</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
          </div>

          <div>
            <button onClick={openRazorpay} className="px-4 py-2 bg-red-700 text-white rounded">Donate with Razorpay</button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">Note: This uses client-side Razorpay checkout for demo. For production, create orders on the server and verify payments server-side.</p>
      </div>
      <div className="mt-8">
        <Link to="/" className="text-sm text-gray-600 hover:underline">Back to home</Link>
      </div>
    </div>
  );
}

export default Donations;
