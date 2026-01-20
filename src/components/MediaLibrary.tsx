import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";
import { X, FileText, ImageIcon } from "lucide-react";

type MediaType = "image" | "pdf";

interface Media {
  id: string;
  title: string;
  type: MediaType;
  url: string;
  created_at: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, type: MediaType) => void;
}

export default function MediaLibrary({ open, onClose, onSelect }: Props) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<MediaType>("image");

  useEffect(() => {
    if (open) loadMedia();
  }, [open, filter]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await apiGet<Media[]>(`/media?type=${filter}`);
      setMedia(data || []);
    } catch {
      alert("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Media Library</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* FILTER */}
        <div className="px-6 py-3 flex gap-4 border-b">
          <button
            onClick={() => setFilter("image")}
            className={`px-4 py-2 rounded ${
              filter === "image"
                ? "bg-gray-800 text-white"
                : "border"
            }`}
          >
            Images
          </button>

          <button
            onClick={() => setFilter("pdf")}
            className={`px-4 py-2 rounded ${
              filter === "pdf"
                ? "bg-gray-800 text-white"
                : "border"
            }`}
          >
            PDFs
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && <p>Loading media...</p>}

          {!loading && media.length === 0 && (
            <p className="text-gray-500">No media found</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {media.map(item => (
              <div
                key={item.id}
                className="border rounded-lg p-2 cursor-pointer hover:shadow"
                onClick={() => {
                  onSelect(item.url, item.type);
                  onClose();
                }}
              >
                {/* PREVIEW */}
                <div className="h-32 flex items-center justify-center bg-gray-100 rounded">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="h-full object-cover rounded"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-600">
                      <FileText size={36} />
                      <span className="text-xs mt-1">PDF</span>
                    </div>
                  )}
                </div>

                {/* TITLE */}
                <p className="text-sm mt-2 truncate">{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
