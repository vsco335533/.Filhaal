import { useState } from "react";
import { apiPost } from "../lib/api";

export function MediaUpload({ type }: { type: "image" | "video" }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const upload = async () => {
    if (!file) return alert("Select a file");

    const form = new FormData();
    form.append("file", file);
    form.append("title", title);
    form.append("type", type);

    await apiPost("/media", form);
    alert("Uploaded. Awaiting approval if researcher.");
  };

  return (
    <div className="mb-6">
      <input type="text" placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <input type="file" accept={type === "image" ? "image/*" : "video/*"} onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={upload}>Upload</button>
    </div>
  );
}
