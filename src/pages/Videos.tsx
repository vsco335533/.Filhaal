
import { useState, useEffect } from "react";
import { Play, Clock, Trash2, Check } from "lucide-react";
import { apiGet, apiPost, apiDelete } from "../lib/api";
import { Media } from "../types";
import { useAuth } from "../contexts/AuthContext";

export function Videos() {
  const [videos, setVideos] = useState<Media[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const data = await apiGet("/media?type=video");
    setVideos(data || []);
    setLoading(false);
  };

  const submitVideo = async () => {
    if (!youtubeUrl) return alert("Paste YouTube URL");

    setSubmitting(true);
    try {
      await apiPost("/media/upload", {
        type: "video",
        youtube_url: youtubeUrl,
        title: "YouTube Video",
      });
      setYoutubeUrl("");
      loadVideos();
    } catch {
      alert("Invalid YouTube URL");
    } finally {
      setSubmitting(false);
    }
  };

  const approveVideo = async (id: string) => {
    await apiPost(`/media/${id}/approve`, {});
    loadVideos();
  };

  const deleteVideo = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    await apiDelete(`/media/${id}`);
    loadVideos();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* ADMIN ADD VIDEO */}
      {isAdmin && (
        <div className="mb-6 flex gap-2">
          <input
            className="flex-1 border p-2 rounded"
            placeholder="Paste YouTube URL"
            value={youtubeUrl}
            onChange={e => setYoutubeUrl(e.target.value)}
          />
          <button
            onClick={submitVideo}
            disabled={submitting}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Add Video
          </button>
        </div>
      )}

      {/* VIDEO GRID */}
      {loading ? (
        <p>Loading…</p>
      ) : videos.length === 0 ? (
        <p>No videos yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <div key={video.id} className="bg-white border rounded-xl">
              <iframe
                src={video.url}
                className="w-full aspect-video rounded-t-xl"
                allowFullScreen
              />

              <div className="p-4">
                <h3 className="font-bold">{video.title}</h3>

                <div className="flex justify-between mt-3">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(video.created_at).toLocaleDateString()}
                  </span>

                  {isAdmin && (
                    <div className="flex gap-2">
                      {video.status === "pending" && (
                        <button
                          onClick={() => approveVideo(video.id)}
                          className="bg-green-600 text-white px-2 rounded"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteVideo(video.id)}
                        className="bg-red-600 text-white px-2 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
