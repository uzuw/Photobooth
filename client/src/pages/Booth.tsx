import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion"; // Added for interactivity
import { useUser } from "../context/UserContext";

const Booth: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user, token, isLoggedIn } = useUser();
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [numPhotos, setNumPhotos] = useState(4);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [flash, setFlash] = useState(false);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const createCollage = (capturedPhotos: string[]): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas || !canvas.getContext) return resolve("");
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve("");

      const images: HTMLImageElement[] = [];
      let loadedCount = 0;

      // OPTIMIZED SIZE: 480x360 keeps the file small but sharp
      const w = 480; 
      const h = 360;
      const cols = 2;
      const rows = Math.ceil(capturedPhotos.length / cols);

      canvas.width = w * cols;
      canvas.height = h * rows;

      capturedPhotos.forEach((src, i) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === capturedPhotos.length) {
            images.forEach((image, index) => {
              const x = (index % cols) * w;
              const y = Math.floor(index / cols) * h;
              ctx.drawImage(image, x, y, w, h);
            });
            // Quality 0.6 is the "Sweet Spot" for Cloudinary uploads
            resolve(canvas.toDataURL("image/jpeg", 0.6));
          }
        };
        images.push(img);
      });
    });
  };

  const startSession = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setPhotos([]);
    const tempPhotos: string[] = [];
    
    for (let i = 1; i <= numPhotos; i++) {
      for (let c = 3; c > 0; c--) {
        setCountdown(c);
        await delay(1000);
      }
      setCountdown(null);
      setFlash(true);
      setTimeout(() => setFlash(false), 100);
      
      const image = webcamRef.current?.getScreenshot();
      if (image) {
        tempPhotos.push(image);
        setPhotos([...tempPhotos]);
      }
      await delay(600); 
    }

    const collageBase64 = await createCollage(tempPhotos);
    setPhotos([collageBase64]); 
    setIsCapturing(false);
  };

  const saveToGallery = async () => {
    if (!isLoggedIn || !user || photos.length === 0) return;
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/gallery/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ photos, userId: user.id, sessionId: `session_${Date.now()}` })
      });
      if (res.ok) {
        setPhotos([]);
        alert("Memory Saved! ✨");
      }
    } catch (err) {
      alert("Upload failed. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center py-10 px-4 font-sans text-neutral-900">
      <canvas ref={canvasRef} className="hidden" />
      
      <motion.h1 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="text-5xl font-black mb-10 tracking-tighter italic"
      >
        BOOTH
      </motion.h1>

      {/* Mode Selector */}
      <AnimatePresence>
        {!isCapturing && photos.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-2 mb-8 bg-white p-2 rounded-full shadow-sm border border-neutral-100"
          >
            {[1, 4, 6, 8].map(n => (
              <button 
                key={n} 
                onClick={() => setNumPhotos(n)} 
                className={`px-6 py-2 rounded-full text-[10px] font-black transition-all ${numPhotos === n ? 'bg-black text-white' : 'bg-transparent text-neutral-400 hover:text-black'}`}
              >
                {n} {n === 1 ? 'SHOT' : 'SHOTS'}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Viewfinder */}
      <div className="relative group w-full max-w-2xl aspect-video bg-black rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-[16px] border-white">
        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" mirrored className="w-full h-full object-cover" />
        
        {/* Flash Overlay */}
        <AnimatePresence>
          {flash && (
            <motion.div 
              initial={{ opacity: 1 }} 
              animate={{ opacity: 0 }} 
              className="absolute inset-0 bg-white z-50" 
            />
          )}
        </AnimatePresence>

        {/* Counter Overlay */}
        {isCapturing && (
          <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-xl text-white px-4 py-2 rounded-2xl text-xs font-bold border border-white/20">
             Frame {photos.length + (countdown ? 1 : 0)} of {numPhotos}
          </div>
        )}

        {/* Big Countdown */}
        <AnimatePresence>
          {countdown && (
            <motion.div 
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <span className="text-white text-[12rem] font-black drop-shadow-2xl">{countdown}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 h-24 flex items-center">
        {!isCapturing && photos.length === 0 && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startSession} 
            className="bg-black text-white px-16 py-5 rounded-full font-black text-xl shadow-xl"
          >
            START SESSION
          </motion.button>
        )}

        {photos.length > 0 && !isCapturing && (
          <div className="flex gap-6">
            <motion.button 
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              onClick={saveToGallery} 
              disabled={isSaving}
              className="bg-black text-white px-12 py-5 rounded-[2rem] font-bold shadow-lg disabled:bg-neutral-300"
            >
              {isSaving ? "UPLOADING..." : "SAVE TO CLOUD"}
            </motion.button>
            <motion.button 
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              onClick={() => setPhotos([])} 
              className="bg-neutral-100 text-neutral-500 px-12 py-5 rounded-[2rem] font-bold border border-neutral-200"
            >
              RETAKE
            </motion.button>
          </div>
        )}
      </div>

      {/* Modern Collage Preview */}
      <AnimatePresence>
        {photos.length === 1 && !isCapturing && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-16 w-full max-w-[320px] flex flex-col items-center"
          >
             <div className="bg-white p-4 pb-12 shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
                <img src={photos[0]} alt="Result" className="w-full grayscale hover:grayscale-0 transition-all duration-700 cursor-crosshair" />
                <div className="mt-6 flex flex-col items-center">
                   <div className="w-8 h-8 rounded-full bg-neutral-100 mb-2 border border-neutral-200 flex items-center justify-center text-[8px] font-bold">
                     {user?.name?.charAt(0)}
                   </div>
                   <p className="text-[10px] text-neutral-300 font-black tracking-widest uppercase">
                     {new Date().toLocaleDateString()}
                   </p>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Booth;