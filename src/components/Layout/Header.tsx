import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Home, FileText, Video, Image, LayoutDashboard, MoreVertical } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import logo from "../../assets/image(-1).png";

const categories = [
  "Editor's Letter",
  "Discussions & Debates",
  "Membership",
  // "issues"

];  

export function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const el = menuRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-white">
      {/* Top black nav */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex itechatms-center justify-between h-10 text-sm">
            <div className="flex items-center gap-6">
              <Link to="/" className="hover:underline">Home</Link>
              <Link to="/about" className="hover:underline">About</Link>
              <Link to="/donations" className="hover:underline">Donations</Link>
              <Link to="/write-in-filhaal" className="hover:underline">Write in Filhaal</Link>
              <Link to="/contact" className="hover:underline">Contact</Link>
              {/* <Link to="/issues" className="hover:underline">contants</Link> */}
            </div>

            <div className="flex items-center gap-4 relative">
              <input
                placeholder="Search"
                className="hidden sm:inline-block px-2 py-1 rounded bg-gray-600 text-sm"
              />
              {!user ? (
                <Link to="/login" className="ml-2 px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded text-sm">
                  Sign In
                </Link>
              ) : (
                <div className="ml-2 relative">
                  <button
                    onClick={() => setMenuOpen((s) => !s)}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm flex items-center gap-2"
                    aria-expanded={menuOpen}
                    aria-label="Open menu"
                  >
                    <MoreVertical size={16} />
                  </button>
                  
                  {menuOpen && (
                    <div ref={menuRef} className="absolute right-0 mt-2 w-44 bg-gray-700 border rounded shadow-lg z-40">
                      <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-black-50">Dashboard</Link>
                      {profile?.role === 'super_admin' && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-black-50">Admin Panel</Link>
                      )}
                      <button onClick={handleSignOut} className="w-full text-left px-4 py-2 hover:bg-black-50">Sign Out</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center">
          <img src={logo} alt="Magazine" className="h-20 md:h-24 w-auto object-contain" draggable="false" />
        </div>
      </div>

      {/* Category tabs like magazine — also include Research, Videos, Images */}
      <div className="bg-black rounded shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  
          <div className="flex items-center gap-4 overflow-x-auto py-3">
            {categories.map((cat) => {
              const key = cat;
              const lower = cat.toLowerCase();
              // Map specific legacy categories to internal routes
              const to = lower.includes("editor")
                ? "/letter-to-editor"
                : lower.includes("membership")
                ? "/donations"
                : lower.includes("currently")
                ? "/write-in-filhaal"
                : `/category/${encodeURIComponent(lower)}`;

              return (
                <Link
                  key={key}
                  to={to}
                  className="flex-none px-4 py-2 font-semibold bg-red-800 text-white rounded-sm hover:opacity-90"
                >
                  {cat}
                </Link>
              );
            })}

            <Link to="/research" className="flex-none px-4 py-2 font-semibold bg-red-800 text-white rounded-sm hover:opacity-90">
              Latest Articles
            </Link>
            <Link to="/videos" className="flex-none px-4 py-2 font-semibold bg-red-800 text-white rounded-sm hover:opacity-90">
              Videos
            </Link>
            <Link to="/gallery" className="flex-none px-4 py-2 font-semibold bg-red-800 text-white rounded-sm hover:opacity-90">
              Images
            </Link>
            <Link to="/books" className="flex-none px-4 py-2 font-semibold bg-red-800 text-white rounded-sm hover:opacity-90">
              Filhaal Books
            </Link>
            <Link to="/previous-editions" className="flex-none px-4 py-2 font-semibold bg-red-800 text-white rounded-sm hover:opacity-90">All issues</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
