import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";

function EbookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [authUser] = useAuth();
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!authUser) {
      toast.error("Please login to read books");
      navigate("/");
      return;
    }
    fetchEbook();
  }, [id, authUser]);

  const fetchEbook = async () => {
    try {
      const res = await axios.get(`http://localhost:4001/ebooks/${id}`);
      setEbook(res.data);
    } catch (error) {
      toast.error("Error loading ebook");
      navigate("/library");
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading ebook...</p>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ebook not found</h2>
          <button
            onClick={() => navigate("/library")}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0' : 'min-h-screen'} bg-gray-900 text-white`}>
      {/* Header Controls */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/library")}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Library</span>
          </motion.button>
          
          <div>
            <h1 className="text-lg font-bold">{ebook.title}</h1>
            <p className="text-sm text-gray-400">by {ebook.author}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullscreen}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              )}
            </svg>
            <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </motion.button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[calc(100vh-160px)]'} w-full`}>
        <iframe
          src={`http://localhost:4001${ebook.pdfFile}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
          className="w-full h-full border-none"
          title={ebook.title}
          style={{
            background: '#1f2937'
          }}
        />
      </div>

      {/* Footer Info */}
      {!isFullscreen && (
        <div className="bg-gray-800 border-t border-gray-700 p-4 text-center text-sm text-gray-400">
          <p>Reading: {ebook.title} • {ebook.fileSize} • Uploaded {new Date(ebook.uploadDate).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}

export default EbookReader;