// import { useState, useEffect } from "react";
// import { Image as ImageIcon } from "lucide-react";
// import { apiGet } from "../lib/api";
// import { Media } from "../types";

// export function Gallery() {
//   const [images, setImages] = useState<Media[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadImages();
//   }, []);

//   const loadImages = async () => {
//     try {
//       // Backend → GET /api/media?type=image
//       const data = await apiGet("/media?type=image");

//       setImages(data || []);
//     } catch (error) {
//       console.error("Error loading images:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-gradient-to-br from-gray-900 to-white-400 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h1 className="text-4xl font-bold mb-4">Photo Gallery</h1>
//           <p className="text-xl text-white-100">
//             Visual documentation from field studies and research activities
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {[...Array(8)].map((_, i) => (
//               <div
//                 key={i}
//                 className="aspect-square bg-gray-200 rounded-xl animate-pulse"
//               ></div>
//             ))}
//           </div>
//         ) : images.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//             <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
           

//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {images.map((image) => (
//               <div
//                 key={image.id}
//                 className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
//               >
//                 <img
//                   src={image.url}
//                   alt={image.title}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
//                   <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
//                     <h3 className="font-semibold mb-1 line-clamp-2">{image.title}</h3>
//                     {image.description && (
//                       <p className="text-sm text-gray-200 line-clamp-1">
//                         {image.description}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { Image as ImageIcon, Clock } from "lucide-react";
// import { apiGet, apiPost } from "../lib/api";
// import { Media } from "../types";
// import { useAuth } from "../contexts/AuthContext";

// export function Gallery() {
//   const [images, setImages] = useState<Media[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { isAdmin } = useAuth();

//   useEffect(() => {
//     loadImages();
//   }, []);

//   const loadImages = async () => {
//     try {
//       const data = await apiGet("/media?type=image");
//       setImages(data || []);
//     } catch (error) {
//       console.error("Error loading images:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const approveImage = async (id: string) => {
//     await apiPost(`/media/${id}/approve`, {});
//     loadImages(); // refresh after approve
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* HEADER */}
//       <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <h1 className="text-4xl font-bold mb-4">Image Gallery</h1>
//           <p className="text-lg text-blue-100">
//             Browse approved images uploaded by researchers and admins
//           </p>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {loading ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {[...Array(8)].map((_, i) => (
//               <div
//                 key={i}
//                 className="aspect-square bg-gray-200 rounded-xl animate-pulse"
//               ></div>
//             ))}
//           </div>
//         ) : images.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-xl border">
//             <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500">No images available yet.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {images.map((image) => (
//               <div
//                 key={image.id}
//                 className="bg-white rounded-xl border hover:shadow-lg transition overflow-hidden"
//               >
//                 {/* IMAGE */}
//                 <div className="aspect-square bg-gray-100">
//                   <img
//                     src={image.url}
//                     alt={image.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 {/* INFO */}
//                 <div className="p-3">
//                   <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
//                     {image.title}
//                   </h3>

//                   {image.description && (
//                     <p className="text-xs text-gray-600 line-clamp-2 mb-2">
//                       {image.description}
//                     </p>
//                   )}

//                   <div className="flex items-center justify-between text-xs text-gray-500">
//                     <div className="flex items-center gap-1">
//                       <Clock className="w-3 h-3" />
//                       {new Date(image.created_at).toLocaleDateString()}
//                     </div>

//                     {/* ADMIN APPROVAL */}
//                     {isAdmin && image.status === "pending" && (
//                       <button
//                         onClick={() => approveImage(image.id)}
//                         className="bg-green-600 text-white px-2 py-1 rounded"
//                       >
//                         Approve
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Image as ImageIcon, Clock, Upload, Trash2 } from "lucide-react";
import { apiGet, apiPost, apiDelete } from "../lib/api";
import { Media } from "../types";
import { useAuth } from "../contexts/AuthContext";

export function Gallery() {
  const [images, setImages] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadImages();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [imageName, setImageName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [descriptionText, setDescriptionText] = useState("");

  useEffect(() => {
    // load categories for dropdown
    (async () => {
      try {
        const cats = await apiGet('/image-categories');
        setCategoriesList(cats || []);
      } catch (e) {
        console.error('Failed to load image categories:', e);
      }
    })();
  }, []);

  const loadImages = async () => {
    try {
      // Only load images that are not attached to posts and were uploaded by admins
      const data = await apiGet("/media?type=image&unattached=1&admin_uploads=1");
      setImages(data || []);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveImage = async (id: string): Promise<void> => {
    try {
      await apiPost(`/media/${id}/approve`, {});
      loadImages();
    } catch {
      alert("Failed to approve image");
    }
  };

  const deleteImage = async (id: string) => {
    if (!id) return alert("Invalid media ID");
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      // ✅ IMPORTANT FIX — send media type
      await apiDelete(`/media/${id}?type=image`);
      loadImages();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete image");
    }
  };

  const handleUploadImage = async (file: File) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("type", "image");

    try {
      setUploading(true);

      const res = await fetch("http://localhost:5000/api/media/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        let msg = `Upload failed (${res.status})`;
        try {
          const payload = await res.json();
          msg = payload?.error || payload?.message || msg;
        } catch (e) {}
        throw new Error(msg);
      }

      await loadImages();
    } catch (error) {
      console.error("Image upload failed:", error);
        alert(error?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-black to-red-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Image Gallery</h1>
          <p className="text-lg text-blue-100">
            Browse approved images uploaded by admins
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin && (
          <div className="mb-6">
            {!showForm ? (
              <div>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>
              </div>
            ) : (
              <div className="bg-white border rounded p-6">
                <h3 className="text-lg font-semibold mb-4">Image Upload</h3>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">Image Name (optional)</label>
                  <input value={imageName} onChange={(e) => setImageName(e.target.value)} placeholder="Enter image name" className="mt-1 block w-full border rounded px-3 py-2" />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">Create Image Category (optional)</label>
                  <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Enter new category" className="mt-1 block w-full border rounded px-3 py-2" />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">Select Image Category</label>
                  <select value={selectedCategory || ""} onChange={(e) => setSelectedCategory(e.target.value || null)} className="mt-1 block w-full border rounded px-3 py-2">
                    <option value="">-- Select category --</option>
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">Image Upload</label>
                  <input type="file" accept="image/*" onChange={(e) => setFileToUpload(e.target.files?.[0] || null)} className="mt-1" />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">Image Description</label>
                  <textarea value={descriptionText} onChange={(e) => setDescriptionText(e.target.value)} placeholder="Add a description about the image" className="mt-1 block w-full border rounded px-3 py-2" rows={4} />
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={async () => {
                    // validate
                    if (!fileToUpload) return alert('Please choose an image file');

                    try {
                      setUploading(true);

                      let categoryId = selectedCategory;
                      if (newCategory && newCategory.trim()) {
                        // create new image category
                        const res = await apiPost('/image-categories', { name: newCategory.trim(), description: '' });
                        categoryId = res?.category?.id;
                        // update local list
                        if (res?.category) setCategoriesList((s) => [res.category, ...s]);
                      }

                      const token = localStorage.getItem('token');
                      if (!token) return alert('Not authenticated');

                      const formData = new FormData();
                      formData.append('file', fileToUpload as File);
                      formData.append('title', (imageName && imageName.trim()) ? imageName.trim() : (fileToUpload as File).name);
                      formData.append('description', descriptionText || '');
                      formData.append('type', 'image');
                      if (categoryId) formData.append('image_category_id', categoryId);

                      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/media/upload`, {
                        method: 'POST',
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                      });

                      if (!res.ok) {
                        let msg = `Upload failed (${res.status})`;
                        try {
                          const payload = await res.json();
                          msg = payload?.error || payload?.message || msg;
                        } catch (e) {}
                        throw new Error(msg);
                      }

                      // reset form
                      setImageName('');
                      setNewCategory('');
                      setSelectedCategory(null);
                      setFileToUpload(null);
                      setDescriptionText('');
                      setShowForm(false);

                      await loadImages();
                    } catch (err) {
                      console.error('Upload failed:', err);
                      alert(err?.message || 'Failed to upload image');
                    } finally {
                      setUploading(false);
                    }
                  }} className="px-4 py-2 bg-blue-600 text-white rounded">{uploading ? 'Uploading...' : '+ Add Image'}</button>

                  <button onClick={() => { setShowForm(false); }} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No images available yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/** Render categories in order, grouping images by category_id */}
            {categoriesList.map((cat) => {
              const items = images.filter((img) => (img.image_category_id || null) === cat.id);
              return (
                <div key={cat.id} className="bg-white rounded-xl border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{cat.name}</h2>
                    <div className="text-sm text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''}</div>
                  </div>

                  {items.length === 0 ? (
                    <div className="py-6 border rounded text-center text-gray-500">No images in this category.</div>
                  ) : (
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {items.map((image) => (
                        <div key={image.id} className="w-56 bg-white rounded-lg border flex-none overflow-hidden">
                          <div className="aspect-video bg-gray-100">
                            <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-3">
                            <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">{image.title}</h3>
                            {image.description && <p className="text-xs text-gray-600 line-clamp-2">{image.description}</p>}

                            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(image.created_at).toLocaleDateString()}
                              </div>
                              {isAdmin && (
                                <div className="flex gap-2">
                                  {image.status === "pending" && (
                                    <button onClick={() => approveImage(image.id)} className="bg-green-600 text-white px-2 py-1 rounded">Approve</button>
                                  )}
                                  <button onClick={() => deleteImage(image.id)} className="bg-red-600 text-white px-2 py-1 rounded"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/** Add new tile inside the category row (admins only) */}
                      {isAdmin && (
                        <div className="w-56 flex-none flex items-center justify-center border-dashed border-2 border-gray-300 rounded-lg">
                          <button onClick={() => { setShowForm(true); setSelectedCategory(cat.id); }} className="flex items-center gap-2 text-gray-700 px-4 py-3">
                            <div className="w-8 h-8 rounded-full border flex items-center justify-center">+</div>
                            <span>Add new</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/** Uncategorized section for images without a category */}
            {images.filter((img) => !img.image_category_id).length > 0 && (
              <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Uncategorized</h2>
                  <div className="text-sm text-gray-500">{images.filter((img) => !img.image_category_id).length} item(s)</div>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {images.filter((img) => !img.image_category_id).map((image) => (
                    <div key={image.id} className="w-56 bg-white rounded-lg border flex-none overflow-hidden">
                      <div className="aspect-video bg-gray-100">
                        <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">{image.title}</h3>
                        {image.description && <p className="text-xs text-gray-600 line-clamp-2">{image.description}</p>}
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(image.created_at).toLocaleDateString()}
                          </div>
                          {isAdmin && (
                            <div className="flex gap-2">
                              {image.status === "pending" && (
                                <button onClick={() => approveImage(image.id)} className="bg-green-600 text-white px-2 py-1 rounded">Approve</button>
                              )}
                              <button onClick={() => deleteImage(image.id)} className="bg-red-600 text-white px-2 py-1 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isAdmin && (
                    <div className="w-56 flex-none flex items-center justify-center border-dashed border-2 border-gray-300 rounded-lg">
                      <button onClick={() => { setShowForm(true); setSelectedCategory(null); }} className="flex items-center gap-2 text-gray-700 px-4 py-3">
                        <div className="w-8 h-8 rounded-full border flex items-center justify-center">+</div>
                        <span>Add new</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

