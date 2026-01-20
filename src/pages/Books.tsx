import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  img?: string; // data URL or path
  createdAt: string;
}

const STORAGE_KEY = "filhaal_books";

function loadBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Book[];
  } catch (e) {
    console.error("Failed to load books:", e);
    return [];
  }
}

function saveBooks(list: Book[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function Books() {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);

  // form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [imgData, setImgData] = useState<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setBooks(loadBooks());
  }, []);

  const handleImage = (file?: File) => {
    if (!file) return setImgData(undefined);
    const r = new FileReader();
    r.onload = () => setImgData(String(r.result));
    r.readAsDataURL(file);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !price) return alert("Please fill all fields");

    const book: Book = {
      id: Date.now().toString(),
      title,
      author,
      price: Number(price),
      img: imgData,
      createdAt: new Date().toISOString(),
    };

    const next = [book, ...books];
    setBooks(next);
    saveBooks(next);

    // reset
    setTitle("");
    setAuthor("");
    setPrice("");
    setImgData(undefined);
    if (fileRef.current) fileRef.current.value = "";
  };

  const deleteBook = (id: string) => {
    if (!confirm("Delete this book? This action cannot be undone.")) return;
    const next = books.filter((x) => x.id !== id);
    setBooks(next);
    saveBooks(next);
  };

  // Razorpay checkout (client-only demo). For production create orders on server.
  const openRazorpay = (book: Book) => {
    const key = import.meta.env.VITE_RAZORPAY_KEY as string | undefined;
    if (!key) {
      alert("Razorpay key not configured. Set VITE_RAZORPAY_KEY in your .env file.");
      return;
    }

    // ensure script present
    if (!(window as any).Razorpay) {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      s.onload = () => launch();
      document.body.appendChild(s);
    } else {
      launch();
    }

    function launch() {
      const options: any = {
        key,
        amount: Math.round(book.price * 100),
        name: book.title,
        description: `Purchase: ${book.title}`,
        image: book.img || undefined,
        handler: function (response: any) {
          alert("Payment successful. Payment ID: " + response.razorpay_payment_id);
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#B91C1C",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Filhaal Books</h1>

      {isAdmin && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Add New Book</h2>
          <form onSubmit={onSubmit} className="bg-white border rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Book Name</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Author Name</label>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price (INR)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")} className="mt-1 block w-40 border rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} className="mt-1" />
              {imgData && <img src={imgData} alt="preview" className="mt-2 w-32 h-40 object-cover rounded border" />}
            </div>

            <div>
              <button className="px-4 py-2 bg-red-700 text-white rounded">Submit</button>
            </div>
          </form>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-4">Available Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {books.length === 0 && <div className="text-gray-500">No books available.</div>}
          {books.map((b) => (
            <div key={b.id} className="bg-white border rounded-lg p-4 flex gap-4 items-center">
              <div className="w-24 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {b.img ? <img src={b.img} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}
              </div>

              <div className="flex-1">
                <div className="font-semibold text-lg">{b.title}</div>
                <div className="text-sm text-gray-500">{b.author}</div>
                <div className="mt-2 font-bold text-red-600">₹{b.price}</div>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => openRazorpay(b)} className="px-3 py-1 bg-gray-800 text-white rounded text-sm">Buy</button>
                  {isAdmin && (
                    <button onClick={() => deleteBook(b.id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Books;
