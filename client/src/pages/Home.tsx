import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const sampleImages = ["pc1.jpg", "pc2.jpg", "pc3.jpg", "pc4.jpg"];

const Home: React.FC = () => {
  return (
    <main
      className="min-h-screen bg-white px-6 py-16 flex flex-col items-center justify-center"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Wrapper */}
      <section className="w-full max-w-6xl flex flex-col items-center text-center space-y-12">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-semibold font-sans text-neutral-900 tracking-tight"
        >
          Photo Booth
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-gray-500 text-lg max-w-xl leading-relaxed font-mono"
        >
          Capture your memories in a clean and calming space — no distractions, just you and your moments.
        </motion.p>

        {/* Button */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            to="/booth"
            className="inline-block px-10 py-3 border border-black text-black text-lg font-medium rounded-full transition hover:bg-black hover:text-white"
          >
            Open Booth
          </Link>
        </motion.div>

        {/* Image Gallery */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 w-full">
          {sampleImages.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="overflow-hidden rounded-lg"
            >
              <img
                src={src}
                alt={`Sample ${i + 1}`}
                className="w-full h-40 object-cover grayscale hover:grayscale-0 transition duration-300"
              />
            </motion.div>
          ))}
        </section>
      </section>
    </main>
  );
};

export default Home;
