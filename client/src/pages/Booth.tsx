import React, { useRef, useState } from "react";
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

  const startCapture = () => {
    if (isCapturing) return;
    setPhotos([]);
    setIsCapturing(true);
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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-6 font-sans">
      <h1 className="text-4xl font-bold text-neutral-900 mb-8">📸 Photo Booth</h1>

      <div className="flex space-x-3 mb-6">
        {[1, 4, 6, 8].map((count) => (
          <button
            key={count}
            onClick={() => setNumPhotos(count)}
            disabled={isCapturing}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition 
              ${numPhotos === count
                ? "bg-neutral-900 text-white"
                : "bg-neutral-200 hover:bg-neutral-300 text-neutral-800"}`}
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
          className="w-[320px] sm:w-[480px] md:w-[640px] aspect-video object-cover transform scale-x-[-1] mx-auto  "
        />

        {countdown && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white text-6xl font-bold">
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

      {photos.length > 0 && (
        <div className="mt-10 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
          <CollageWithPreview images={photos} />
        </div>
      )}
    </div>
  );
};

export default Booth;
