import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import CollageWithPreview from "../components/Collage";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const captureIntervalsSeconds = 3;

const Booth: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [numPhotos, setNumPhotos] = useState(1);
  const [isCapturing, setIsCapturing] = useState(false);
  const [finalCollage, setFinalCollage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    if (photos.length === numPhotos && numPhotos > 1) {
      generateCollage();
    }
  }, [photos]);

  const startCapture = () => {
    if (isCapturing) return;
    setPhotos([]);
    setIsCapturing(true);
    setFinalCollage(null);
    capturePhotoSequence(0);
  };

  const capturePhotoSequence = (index: number) => {
    if (index >= numPhotos) {
      setIsCapturing(false);
      setCountdown(null);
      return;
    }

    let countdownNum = 3;
    setCountdown(countdownNum);
    const countdownInterval = setInterval(async () => {
      countdownNum -= 1;
      if (countdownNum > 0) {
        setCountdown(countdownNum);
      } else {
        clearInterval(countdownInterval);
        setCountdown(null);

        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 200);

        const rawImage = webcamRef.current?.getScreenshot() || "";
        const transformedImage = await transformImage(rawImage);
        setPhotos((prev) => [...prev, transformedImage]);

        setTimeout(() => {
          capturePhotoSequence(index + 1);
        }, (captureIntervalsSeconds - 1) * 1000);
      }
    }, 1000);
  };

  function transformImage(base64: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0, img.width, img.height);
        resolve(canvas.toDataURL());
      };
    });
  }

  async function generateCollage() {
    const loadedImages = await Promise.all(
      photos.map(
        (src) =>
          new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
          })
      )
    );

    

    const cols = 2;
    const rows = Math.ceil(loadedImages.length / cols);
    const imgWidth = loadedImages[0].width;
    const imgHeight = loadedImages[0].height;
    const gap = 20;

    const canvas = document.createElement("canvas");
    canvas.width = cols * imgWidth + (cols - 3) * gap;
    canvas.height = rows * imgHeight + (rows - 3) * gap;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    loadedImages.forEach((img, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * (imgWidth + gap);
      const y = row * (imgHeight + gap);
      ctx.drawImage(img, x, y, imgWidth, imgHeight);
    });

    setFinalCollage(canvas.toDataURL());
  }

  let token=0;
  async function saveToGallery(imageData: string | null) {
  if (!imageData) {
    alert("No collage to save!");
    return;
  }

  setIsSaving(true);

  try {
    const res = await fetch("http://localhost:5000/api/gallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Replace with actual token logic
      },
      body: JSON.stringify({ image: imageData }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Collage saved to gallery!");
    } else {
      alert(data.message || "Failed to save collage");
    }
  } catch (err) {
    console.error("Error saving collage:", err);
    alert("An error occurred while saving.");
  } finally {
    setIsSaving(false);
  }
}

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-6 font-sans">
      <h1 className="text-4xl font-bold text-neutral-900 mb-8">
        📸 Photo Booth
      </h1>

      <div className="flex space-x-3 mb-6">
        {[1, 4, 6, 8].map((count) => (
          <button
            key={count}
            onClick={() => setNumPhotos(count)}
            disabled={isCapturing}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition 
              ${
                numPhotos === count
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-200 hover:bg-neutral-300 text-neutral-800"
              }`}
          >
            {count} Photo{count > 1 ? "s" : ""}
          </button>
        ))}
      </div>

      <div className="relative border rounded-xl overflow-hidden shadow-md">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="rounded shadow-lg transform scale-x-[-1] h-80"
        />

        {countdown && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-6xl font-bold">
            {countdown}
          </div>
        )}

        {isFlashing && <div className="absolute inset-0 bg-white opacity-90" />}
      </div>

      <button
        onClick={startCapture}
        disabled={isCapturing}
        className="mt-8 px-10 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition disabled:opacity-40"
      >
        {isCapturing ? "Capturing..." : "Start Capture"}
      </button>

      {finalCollage && (
        <div className="mt-10 w-full flex justify-center">
          <img
            src={finalCollage}
            alt="Collage"
            className="rounded-lg border max-w-full h-auto"
          />
        </div>
      )}

      {photos.length > 0 && numPhotos === 1 && (
        <div className="mt-10 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
          <CollageWithPreview images={photos} />
        </div>
      )}

      {finalCollage && (
  <button
    onClick={() => saveToGallery(finalCollage)}
    disabled={isSaving}
    className={`mt-6 px-6 py-2 rounded transition ${
      isSaving
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 text-white"
    }`}
  >
    {isSaving ? "Saving..." : "Add to Gallery"}
  </button>
)}

    </div>
  );
};

export default Booth;
