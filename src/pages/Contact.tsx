import { useState } from "react";
import { apiPost } from "../lib/api";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost("/contact", { name, email, message });
      alert("Thanks — your message was sent.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      alert(err.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-4xl font-bold mb-6">CONTACT US</h2>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white-300 p-6 rounded">
            <label className="block text-sm text-black-300">NAME</label>
            <input className="w-full p-3 rounded bg-gray-200 text-black" value={name} onChange={e => setName(e.target.value)} />

            <label className="block text-sm text-black-300">EMAIL</label>
            <input className="w-full p-3 rounded bg-gray-200 text-black" value={email} onChange={e => setEmail(e.target.value)} />

            <label className="block text-sm text-black-300">MESSAGE</label>
            <textarea className="w-full p-3 rounded bg-gray-200 text-black h-40" value={message} onChange={e => setMessage(e.target.value)} />

            <button type="submit" className="w-full bg-gray-600 text-black p-3 rounded" disabled={loading}>{loading ? 'Sending...' : 'Submit'}</button>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">OUR ADDRESS</h3>
          <div className="bg-white p-6 rounded text-gray-800 space-y-4">
            <p><strong>Email:</strong> contact@filhaal.in, filhaalpatna@gmail.com</p>
            <p><strong>Address:</strong>L 164, Road No. 23, Sri Krishna Nagar, Patna. Pin – 800001  Phone: +91 94720 48408</p>
            <div>
              <h4 className="font-semibold mt-4">WE ARE SOCIAL</h4>
              <div className="flex gap-3 mt-2">
                <a href="https://www.facebook.com/hindi.filhaal/" className="px-3 py-2 border rounded">in</a>
                <a href="#" className="px-3 py-2 border rounded">ig</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
