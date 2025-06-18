import React, { useState } from "react";

interface CollageWithPreviewProps {
  images: string[];
}

const CollageWithPreview: React.FC<CollageWithPreviewProps> = ({ images }) => {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Collage grid: fixed 2 columns on all screen sizes */}
      <div className="grid grid-cols-2 gap-4">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Photo ${i + 1}`}
            className="rounded shadow-md cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => setPreviewIndex(i)}
          />
        ))}
      </div>

      {/* Preview modal */}
      {previewIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setPreviewIndex(null)} // click outside to close
        >
          <div
            className="relative max-w-4xl max-h-full p-4"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking image container
          >
            <img
              src={images[previewIndex]}
              alt={`Preview ${previewIndex + 1}`}
              className="rounded max-w-full max-h-[80vh] object-contain"
            />
            <button
              onClick={() => setPreviewIndex(null)}
              className="absolute top-2 right-2 text-white bg-gray-700 rounded-full p-2 hover:bg-gray-800"
              aria-label="Close preview"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollageWithPreview;
