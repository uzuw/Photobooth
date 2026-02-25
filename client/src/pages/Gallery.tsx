import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PhotoModal from "../components/PhotoModal"; // Import the new component

interface Photo {
  _id: string;
  url: string;
  createdAt: string;
}

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchPhotos();
  }, [token]);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/gallery", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPhotos(data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanent delete?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p._id !== id));
        setSelectedPhoto(null);
      }
    } catch (err) { console.error(err); } 
    finally { setDeletingId(null); }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-16 px-6 font-sans overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-16">
          <h1 className="text-5xl font-black tracking-tighter italic">GALLERY</h1>
          <button onClick={() => navigate("/booth")} className="px-8 py-3 bg-black text-white rounded-full text-[10px] font-black tracking-widest">
            + CAPTURE
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {photos.map((photo) => (
              <motion.div
                key={photo._id}
                layoutId={photo._id}
                onClick={() => setSelectedPhoto(photo)}
                className="cursor-zoom-in group bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-[1.8rem]">
                  <img src={photo.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Session" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Logic for showing the separated component */}
      <AnimatePresence>
        {selectedPhoto && (
          <PhotoModal 
            photo={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
            onDelete={handleDelete}
            isDeleting={deletingId === selectedPhoto._id}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;