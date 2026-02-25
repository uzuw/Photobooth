import React from "react";
import { motion } from "framer-motion";

interface Photo {
  _id: string;
  url: string;
  createdAt: string;
}

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose, onDelete, isDeleting }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      {/* Blurred Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-white/60 backdrop-blur-xl cursor-zoom-out"
      />

      {/* Content Container */}
      <motion.div 
        layoutId={photo._id}
        className="relative w-full max-w-lg bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-[3rem] overflow-hidden flex flex-col"
      >
        {/* Image Display */}
        <div className="w-full overflow-hidden bg-neutral-50 flex items-center justify-center">
          <img 
            src={photo.url} 
            alt="Enlarged Booth Capture" 
            className="w-full h-auto max-h-[70vh] object-contain" 
          />
        </div>

        {/* Controls Footer */}
        <div className="p-8 flex items-center justify-between border-t border-neutral-50">
          <div>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Captured On</p>
            <p className="text-sm font-bold text-neutral-900">
              {new Date(photo.createdAt).toLocaleDateString(undefined, {
                month: 'long', day: 'numeric', year: 'numeric'
              })}
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => onDelete(photo._id)}
              disabled={isDeleting}
              className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90"
              title="Delete Memory"
            >
              {isDeleting ? (
                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
            <button 
              onClick={onClose}
              className="px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black tracking-widest uppercase hover:opacity-80 transition-opacity active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PhotoModal;