import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, User, Eye } from "lucide-react";
import { apiGet } from "../lib/api";

export function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    apiGet(`/posts/${slug}`).then(setPost);
  }, [slug]);

  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {post.featured_image_url && (
        <img
          src={post.featured_image_url}
          className="w-full rounded mb-6"
        />
      )}

      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-600 mb-4">{post.excerpt}</p>

      <div className="flex gap-6 text-sm mb-6">
        <span><User /> {post.author_name || post.profiles?.full_name}</span>
        <span><Calendar /> {new Date(post.published_at).toDateString()}</span>
        <span><Eye /> {post.view_count}</span>
      </div>

      <div className="prose mb-6">
        {post.content}
      </div>

      {/* 📄 PDFs (support both legacy 'pdf' and DB 'document') */}
      {post.media.filter((m: any) => m.type === "pdf" || m.type === "document").length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Documents</h3>
          {post.media
            .filter((m: any) => m.type === "pdf" || m.type === "document")
            .map((pdf: any) => {
              const fallbackName = (pdf.url || "").split("/").pop() || "file.pdf";
              const displayName = pdf.title || fallbackName;
              const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
              const downloadHref = `${API_BASE.replace(/\/$/, '')}/media/${pdf.id}/download`;
              return (
                <a
                  key={pdf.id}
                  href={downloadHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 underline mb-2"
                >
                  📄 {displayName}
                </a>
              );
            })}
        </div>
      )}
    </div>
  );
}
