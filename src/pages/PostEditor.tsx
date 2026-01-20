import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Send, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { apiGet, apiPost, apiPut, apiUpload } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { Category } from "../types";

export function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    type: "research" as "research" | "field_study" | "opinion",
    category_id: "",
    author_name: "",
    featured_image_url: "",        // manual URL
    document_url: "",              // manual single PDF URL
    document_urls: [] as string[], // uploaded PDFs
  });

  /* ===============================
     LOAD
  ================================ */

  useEffect(() => {
    loadCategories();
    if (id) loadPost();
  }, [id]);

  const loadCategories = async () => {
    const data = await apiGet("/categories");
    setCategories(data || []);
  };

  const loadPost = async () => {
    const data = await apiGet(`/posts/${id}`);
    setFormData({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || "",
      type: data.type,
      category_id: data.category_id || "",
      author_name: data.author_name || "",
      featured_image_url: data.featured_image_url || "",
      document_url: data.document_url || "",
      document_urls: data.document_urls || [],
    });
  };

  /* ===============================
     CLOUDINARY UPLOADS
  ================================ */

  const uploadImage = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    setUploadingImage(true);

    const res = await apiUpload<{ url: string }>("/media/upload", form);

    setFormData(prev => ({
      ...prev,
      featured_image_url: res.url,
    }));

    setUploadingImage(false);
  };

  const uploadPdf = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    setUploadingPdf(true);

    const res = await apiUpload<{ url: string }>("/media/upload", form);

    setFormData(prev => ({
      ...prev,
      document_urls: [...prev.document_urls, res.url],
    }));

    setUploadingPdf(false);
  };

  const removePdf = (index: number) => {
    setFormData(prev => ({
      ...prev,
      document_urls: prev.document_urls.filter((_, i) => i !== index),
    }));
  };

  const movePdf = (index: number, dir: "up" | "down") => {
    const list = [...formData.document_urls];
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    setFormData(prev => ({ ...prev, document_urls: list }));
  };

  /* ===============================
     SAVE
  ================================ */

  const handleSave = async (status: "draft" | "submitted") => {
  if (!profile) return navigate("/login");

  setLoading(true);

  try {
    // 1️⃣ CREATE POST FIRST
    const postRes = id
      ? await apiPut(`/posts/${id}`, { ...formData, status })
      : await apiPost("/posts", { ...formData, status });

    const postId = postRes.post.id;

    // 2️⃣ UPLOAD PDFs WITH post_id
    for (const file of pdfFiles) {
      const form = new FormData();
      form.append("file", file);
      form.append("post_id", postId);

      await apiUpload("/media/upload", form);
    }

    // 3️⃣ CLEAR PDFs
    setPdfFiles([]);

    navigate("/dashboard");
  } catch (err) {
    console.error(err);
    alert("Failed to save post");
  } finally {
    setLoading(false);
  }
};



  /* ===============================
     UI
  ================================ */

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        {id ? "Edit Post" : "Create Post"}
      </h1>

      <div className="space-y-6 bg-white p-6 rounded-xl">

        {/* TITLE */}
        <input
          className="w-full border p-3 rounded"
          placeholder="Title"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
        />

        {/* AUTHOR NAME (override) */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Author name (optional)"
          value={formData.author_name}
          onChange={e => setFormData({ ...formData, author_name: e.target.value })}
        />

        {/* EXCERPT */}
        <textarea
          className="w-full border p-3 rounded h-20"
          placeholder="Excerpt"
          value={formData.excerpt}
          onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
        />

        {/* TYPE */}
        <select
          className="w-full border p-3 rounded"
          value={formData.type}
          onChange={e =>
            setFormData({ ...formData, type: e.target.value as any })
          }
        >
          <option value="research">Research</option>
          <option value="field_study">Field Study</option>
          <option value="opinion">Opinion</option>
        </select>

        {/* CATEGORY */}
        <select
          className="w-full border p-3 rounded"
          value={formData.category_id}
          onChange={e =>
            setFormData({ ...formData, category_id: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* CONTENT */}
        <textarea
          className="w-full border p-3 rounded h-48"
          placeholder="Content"
          value={formData.content}
          onChange={e => setFormData({ ...formData, content: e.target.value })}
        />

        {/* FEATURED IMAGE URL */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Featured Image URL"
          value={formData.featured_image_url}
          onChange={e =>
            setFormData({ ...formData, featured_image_url: e.target.value })
          }
        />

        {/* FEATURED IMAGE UPLOAD */}
        <input type="file" accept="image/*" onChange={e =>
          e.target.files && uploadImage(e.target.files[0])
        } />

        {/* PDF URL */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Document PDF URL"
          value={formData.document_url}
          onChange={e =>
            setFormData({ ...formData, document_url: e.target.value })
          }
        />

        {/* PDF UPLOAD */}
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={e => {
            if (e.target.files) {
              setPdfFiles(Array.from(e.target.files));
            }
          }}
        />

        {/* PDF PREVIEW */}
                    {pdfFiles.map((file, i) => {
              const previewUrl = URL.createObjectURL(file);

              return (
                <div key={i} className="border rounded mt-3 p-2">
                  <p className="text-sm font-semibold mb-1">📄 {file.name}</p>

                  <iframe
                    src={previewUrl}
                    className="w-full h-64 border"
                  />

                  <button
                    className="mt-2 text-red-600 text-sm"
                    onClick={() =>
                      setPdfFiles(prev => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    Remove PDF
                  </button>
                </div>
              );
            })}

        {/* ACTIONS */}
        <div className="flex gap-4">
          <button onClick={() => handleSave("draft")}><Save /> Draft</button>
          <button onClick={() => handleSave("submitted")}><Send /> Submit</button>
        </div>
      </div>
    </div>
  );
}
