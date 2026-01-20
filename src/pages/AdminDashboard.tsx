import { useState, useEffect } from "react";
import { Users, FileText, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { apiGet, apiPost } from "../lib/api";
import { Post, Profile } from "../types";

interface Letter {
  id: string;
  name: string;
  email?: string;
  subject?: string;
  message: string;
  createdAt: string;
}

export function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [researchers, setResearchers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] =
    useState<"overview" | "posts" | "researchers" | "letters">("overview");
  const [lettersEditor, setLettersEditor] = useState<Letter[]>([]);
  const [lettersFilhaal, setLettersFilhaal] = useState<Letter[]>([]);
  const [contactsList, setContactsList] = useState<Letter[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  

  const loadData = async () => {
    try {
      const postsData = await apiGet("/posts?status=submitted,under_review");
      const researchersData = await apiGet("/users?role=researcher");
      setPosts(postsData || []);
      setResearchers(researchersData || []);

      // load letters from backend (admin-only endpoint) and separate by category
      try {
        const contacts = await apiGet("/contact");
        const list = (contacts || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          subject: c.subject,
          message: c.message,
          createdAt: c.created_at || c.createdAt,
          category: (c.category || "").toLowerCase(),
        }));

        setLettersEditor(list.filter((l: any) => l.category === "letter_to_editor"));
        setLettersFilhaal(list.filter((l: any) => l.category === "write_in_filhaal"));
        setContactsList(list.filter((l: any) => !["letter_to_editor", "write_in_filhaal"].includes(l.category)));
      } catch (e) {
        console.error("Failed to load letters from backend:", e);
        setLettersEditor([]);
        setLettersFilhaal([]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePost = async (postId: string) => {
    try {
      await apiPost(`/posts/${postId}/approve`, {});
      
        
      loadData();
    } catch (error) {
      console.error("Error approving post:", error);
      alert("Failed to approve post");
    }
  };

  const handleRejectPost = async (postId: string) => {
    const feedback = prompt("Provide feedback for rejection:");
    if (!feedback) return;

    try {
      await apiPost(`/posts/${postId}/reject`, { feedback });
      loadData();
    } catch (error) {
      console.error("Error rejecting post:", error);
      alert("Failed to reject post");
    }
  };

  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p) => p.status === "published").length,
    pendingPosts: posts.filter((p) =>
      ["submitted", "under_review"].includes(p.status)
    ).length,
    totalResearchers: researchers.length,
    totalViews: posts.reduce((sum, p) => sum + (p.view_count || 0), 0),
  };

 


  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "submitted":
        return "bg-gray-100 text-gray-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage researchers, content, and platform settings
          </p>
        </div>

        <div className="mb-6">
          <nav className="flex items-center gap-2">
            <button onClick={() => setActiveTab("overview")} className={`px-3 py-1 rounded ${activeTab==="overview"?"bg-red-700 text-white":"bg-white text-gray-700 border"}`}>Overview</button>
            <button onClick={() => setActiveTab("posts")} className={`px-3 py-1 rounded ${activeTab==="posts"?"bg-red-700 text-white":"bg-white text-gray-700 border"}`}>Posts</button>
            <button onClick={() => setActiveTab("researchers")} className={`px-3 py-1 rounded ${activeTab==="researchers"?"bg-red-700 text-white":"bg-white text-gray-700 border"}`}>Researchers</button>
            <button onClick={() => setActiveTab("letters")} className={`px-3 py-1 rounded ${activeTab==="letters"?"bg-red-700 text-white":"bg-white text-gray-700 border"}`}>Responses</button>
          </nav>
        </div>

        {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Total Posts</span>
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalPosts}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Published</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.publishedPosts}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Pending</span>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.pendingPosts}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Researchers</span>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalResearchers}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Total Views</span>
                <Eye className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalViews}
              </p>
            </div>
          </div>
          )}

        {/* Pending Approval Table */}
        {activeTab === "letters" ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="p-2 border-b mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Submissions</h2>
                </div>

                <div className="space-y-6 ">
                  <div className="border rounded p-4 bg-green-200">
                    <h3 className="text-lg font-semibold mb-2 ">Contact Form Submissions :</h3>
                    {contactsList.length === 0 ? (
                      <div className="text-gray-500">No contact form submissions.</div>
                    ) : (
                      <div className="space-y-4">
                        {contactsList.map((l) => (
                          <div key={l.id} className="border rounded p-4 bg-white">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-semibold">{l.subject || "Contact"}</div>
                                <div className="text-sm text-gray-600">By {l.name} {l.email && <span>&middot; {l.email}</span>}</div>
                              </div>
                              <div className="text-xs text-gray-500">{new Date(l.createdAt).toLocaleString()}</div>
                            </div>
                            <div className="mt-3 text-gray-700 whitespace-pre-wrap">{l.message}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border rounded p-4 bg-red-200">
                    <h3 className="text-lg font-semibold mb-2">Letters to Editor Responses :</h3>
                    {lettersEditor.length === 0 ? (
                      <div className="text-gray-500">No letters to Editor submitted.</div>
                    ) : (
                      <div className="space-y-4">
                        {lettersEditor.map((l) => (
                          <div key={l.id} className="border rounded p-4 bg-white">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-semibold">{l.subject || "Letter"}</div>
                                <div className="text-sm text-gray-600">By {l.name} {l.email && <span>&middot; {l.email}</span>}</div>
                              </div>
                              <div className="text-xs text-gray-500">{new Date(l.createdAt).toLocaleString()}</div>
                            </div>
                            <div className="mt-3 text-gray-700 whitespace-pre-wrap">{l.message}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border rounded p-4 bg-blue-200">
                    <h3 className="text-lg font-semibold mb-2">Write in Filhaal Responses :</h3>
                    {lettersFilhaal.length === 0 ? (
                      <div className="text-gray-500">No Write in Filhaal submissions.</div>
                    ) : (
                      <div className="space-y-4">
                        {lettersFilhaal.map((l) => (
                          <div key={l.id} className="border rounded p-4 bg-white">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-semibold">{l.subject || "Submission"}</div>
                                <div className="text-sm text-gray-600">By {l.name} {l.email && <span>&middot; {l.email}</span>}</div>
                              </div>
                              <div className="text-xs text-gray-500">{new Date(l.createdAt).toLocaleString()}</div>
                            </div>
                            <div className="mt-3 text-gray-700 whitespace-pre-wrap">{l.message}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Pending Approval</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
            </div>
          ) : posts.filter((p) =>
                  ["submitted", "under_review"].includes(p.status)
                ).length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No posts pending approval
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {posts
                  .filter((p) =>
                    ["submitted", "under_review"].includes(p.status)
                  )
                  .map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}

                            <p className="text-xs text-gray-500">Status: {post.status}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                          

                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {post.type.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            post.status
                          )}`}
                        >
                          {post.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {post.status === "submitted" && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApprovePost(post.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>

                              <button
                                onClick={() => handleRejectPost(post.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          )}
                        </td>

                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
