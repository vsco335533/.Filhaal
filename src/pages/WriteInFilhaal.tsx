import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { apiPost } from "../lib/api";

export function WriteInFilhaal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return alert("Please write your message.");

    setLoading(true);
    try {
      await apiPost("/contact", {
        name: name.trim() || "Anonymous",
        email: email.trim() || null,
        subject: subject.trim() || null,
        message: message.trim(),
        category: "write_in_filhaal",
      });

      setSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      if (formRef.current) formRef.current.reset();
    } catch (err: any) {
      console.error("Submit failed:", err);
      alert(err?.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Write in Filhaal</h1>

      <p className="text-gray-700 mb-4">Share your feedback, a letter, or an article proposal specifically for Filhaal. Submissions are reviewed by the editorial team. Admins can view submissions from the admin panel.</p>

      <form ref={formRef} onSubmit={onSubmit} className="bg-white border rounded p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Your name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div>
          <button disabled={loading} className="px-4 py-2 bg-red-700 text-white rounded">{loading? 'Sending...' : 'Submit'}</button>
        </div>
      </form>

      {submitted && (
        <div className="mt-4 text-sm text-green-700">Thank you — your submission has been received.</div>
      )}

      <div className="mt-8">
        <Link to="/" className="text-sm text-gray-600 hover:underline">Back to home</Link>
      </div>
    </div>
  );
}

export default WriteInFilhaal;
