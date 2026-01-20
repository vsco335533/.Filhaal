import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Eye, TrendingUp } from "lucide-react";
import { apiGet } from "../lib/api";
import { PostWithAuthor } from "../types";

export function Home() {
  const [latestPosts, setLatestPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestPosts();
  }, []);

  const loadLatestPosts = async () => {
    try {
      const data = await apiGet("/posts?limit=6");
      setLatestPosts(data || []);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Manual book image sources.
  // You can set these to your image paths directly (or edit the <img src=.../> lines below).
  // Examples: '/src/assets/books/Book1.webp' or new URL(import.meta.url) style imports.
  const BOOK1_SRC = '/src/assets/Book1.webp';
  const BOOK2_SRC = '/src/assets/Book2.webp';
  const BOOK3_SRC = '/src/assets/Book3.webp';
  const BOOK4_SRC = '/src/assets/Book4.webp';

  return (
    <div className="min-h-screen bg-blue-50">  

      {/* Main: three column layout - left books, center research posts, right videos */}
      <main className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left sidebar - Books/ads */}
        <aside className="lg:col-span-3 order-1">
          <h3 className="text-lg font-semibold mb-4">Books</h3>
          <div className="space-y-4">
            {/* Book 1 - editable block */}
            <div className="bg-white border rounded-lg p-4 flex gap-4 items-center">
              <div className="w-20 h-28 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                {BOOK1_SRC ? (
                  <img src={BOOK1_SRC} alt="Book 1" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold">इन्कलाब ज़िन्दाबाद</div>
                <div className="text-sm text-gray-500">राजेश उपाध्याय</div>
                <div className="mt-2 font-bold text-red-600">₹249</div>
                <div className="mt-2">
                  <button className="text-xs px-3 py-1 bg-gray-800 text-white rounded">Buy</button>
                </div>
              </div>
            </div>

            {/* Book 2 - editable block */}
            <div className="bg-white border rounded-lg p-4 flex gap-4 items-center">
              <div className="w-20 h-28 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                {BOOK2_SRC ? (
                  <img src={BOOK2_SRC} alt="Book 2" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold">अर्थशास्त्र कैसे पढ़ें? कैसे पढ़ाएं?</div>
                <div className="text-sm text-gray-500">अमित भादुड़ी</div>
                <div className="mt-2 font-bold text-red-600">₹299</div>
                <div className="mt-2">
                  <button className="text-xs px-3 py-1 bg-gray-800 text-white rounded">Buy</button>
                </div>
              </div>
            </div>

            {/* Book 3 - editable block */}
            <div className="bg-white border rounded-lg p-4 flex gap-4 items-center">
              <div className="w-20 h-28 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                {BOOK3_SRC ? (
                  <img src={BOOK3_SRC} alt="Book 3" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold">क्या सही थे मार्क्स</div>
                <div className="text-sm text-gray-500">टेरी इगलटन</div>
                <div className="mt-2 font-bold text-red-600">₹349</div>
                <div className="mt-2">
                  <button className="text-xs px-3 py-1 bg-gray-800 text-white rounded">Buy</button>
                </div>
              </div>
            </div>

            {/* Book 4 - editable block */}
            <div className="bg-white border rounded-lg p-4 flex gap-4 items-center">
              <div className="w-20 h-28 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                {BOOK4_SRC ? (
                  <img src={BOOK4_SRC} alt="Book 4" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold">सआदत हसन मंटो : चचा सैम के नाम</div>
                <div className="text-sm text-gray-500">सआदत हसन मंटो</div>
                <div className="mt-2 font-bold text-red-600">₹399</div>
                <div className="mt-2">
                  <button className="text-xs px-3 py-1 bg-gray-800 text-white rounded">Buy</button>
                </div>
              </div>
            </div>
          </div>
          {/* More Books Button */}
          <div className="mt-6 text-left   ">
            <Link
              to="/books"
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-700 text-red-700 font-semibold rounded hover:bg-red-700 hover:text-white transition"
            >
              More Books <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </aside>

        {/* Center - Research posts */}
        <section className="lg:col-span-6 order-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
              <p className="text-gray-600">Recent publications</p>
            </div>

            <Link to="/research" className="text-gray-600 font-medium flex gap-2 items-center">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-6 bg-white border rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : latestPosts.length === 0 ? (
            <p className="text-center text-gray-500">No published posts yet.</p>
          ) : (
            <div className="space-y-6">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.slug}`}
                  className="bg-white rounded-xl border hover:shadow-lg transition overflow-hidden flex"
                >
                  {post.featured_image_url && (
                    <div className="w-40 h-32 flex-shrink-0">
                      <img src={post.featured_image_url} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="p-4 flex-1">
                    <div className="flex gap-2 mb-2">
                      <span className="px-3 py-1 bg-gray-50 text-gray-700 text-xs rounded-full">
                        {post.type.replace("_", " ").toUpperCase()}
                      </span>
                      {post.categories && <span className="text-xs text-gray-500">{post.categories.name}</span>}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>

                    <div className="flex justify-between text-sm text-gray-500 mt-3">
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{formatDate(post.published_at)}</div>
                      <div className="flex items-center gap-2"><Eye className="w-4 h-4" />{post.view_count}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Right sidebar - Videos */}
        <aside className="lg:col-span-3 order-3">
          <h3 className="text-lg font-semibold mb-4">Videos</h3>
          <div className="space-y-4">
            {["0M4qtvjYft8","IzgSW-Lid_M","qhUeh5Sy-q4"].map((id) => (
              <div key={id} className="bg-white border rounded-lg overflow-hidden">
                <iframe
                  title={id}
                  src={`https://www.youtube.com/embed/${id}`}
                  className="w-full h-40"
                  allowFullScreen
                />
                <div className="p-3">
                  <div className="font-semibold">Featured Video</div>
                  <div className="text-sm text-gray-500">Watch more on our Videos page</div>
                </div>
              </div>
            ))}
          </div>
          {/* More Videos Button */}
          <div className="mt-6 text-right">
            <Link
              to="/videos"
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-700 text-red-700 font-semibold rounded hover:bg-red-700 hover:text-white transition"
            >
              More Videos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </aside>
      </main>

      {/* FEATURES */}
      {/* <section className="bg-white py-16 border-y">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl">Cutting-Edge Research</h3>
            <p className="text-gray-600 mt-2">
              Access the latest findings from global researchers.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl">Field Studies</h3>
            <p className="text-gray-600 mt-2">
              Explore real-world environmental observations.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl">Expert Opinions</h3>
            <p className="text-gray-600 mt-2">
              Read deep analysis from leading experts.
            </p>
          </div>
        </div>
      </section> */}
    </div>
  );
}
