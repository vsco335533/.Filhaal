import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, FileText, Clock, Eye } from "lucide-react";
import { apiGet } from "../lib/api";
import { PostWithAuthor, Category } from "../types";

export function Research() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    loadCategories();
    loadPosts();
  }, []);

  const loadCategories = async () => {
    const data = await apiGet("/categories");
    setCategories(data || []);
  };

  const loadPosts = async () => {
    try {
      const data = await apiGet("/posts");
      setPosts(data || []);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory || post.category_id === selectedCategory;

    const matchesType = !selectedType || post.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-black to-gray-800 text-white py-12">
        {/* "bg-gradient-to-br from-black to-red-700 text-white py-12" */}
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-3">Research Library</h1>
          <p className="text-lg text-gray-100">
            Browse research articles, field studies, and opinions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* FILTER BAR */}
        <div className="bg-white rounded-xl border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SEARCH */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* CATEGORY DROPDOWN */}
            <select
              className="border rounded-lg px-4 py-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* TYPE DROPDOWN */}
            <select
              className="border rounded-lg px-4 py-2"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="research">Research Article</option>
              <option value="field_study">Field Study</option>
              <option value="opinion">Opinion</option>
            </select>
          </div>
        </div>

        {/* RESULTS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 border rounded-xl animate-pulse">
                <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No matching articles found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/posts/${post.slug}`}
                className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition"
              >
                {post.featured_image_url && (
                  <div className="aspect-video">
                    <img
                      src={post.featured_image_url}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full">
                      {post.type.replace("_", " ").toUpperCase()}
                    </span>
                    {post.categories && (
                      <span className="text-xs text-gray-500">
                        {post.categories.name}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg group-hover:text-gray-600">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex justify-between items-center text-gray-500 text-xs mt-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(post.published_at)}
                    </div>

                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.view_count}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
