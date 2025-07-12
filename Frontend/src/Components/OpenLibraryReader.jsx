import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";

function OpenLibraryReader() {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const [authUser] = useAuth();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!authUser) {
      toast.error("Please login to read books");
      navigate("/open-library");
      return;
    }
    loadBookData();
  }, [identifier, authUser]);

  const loadBookData = async () => {
    try {
      // Fetch book metadata from Internet Archive
      const response = await fetch(`https://archive.org/metadata/${identifier}`);
      const data = await response.json();
      setBookData(data);
    } catch (error) {
      toast.error("Error loading book data");
      console.error("Error:", error);
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
          <p>Loading book...</p>
        </div>
      </div>
    );
  }

  if (!bookData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Book not found</h2>
          <button
            onClick={() => navigate("/open-library")}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const bookTitle = bookData.metadata?.title || "Unknown Title";
  const bookCreator = bookData.metadata?.creator || "Unknown Author";

  return (
    <div className={`${isFullscreen ? 'fixed inset-0' : 'min-h-screen'} bg-gray-900 text-white`}>
      {/* Header Controls */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/open-library")}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Search</span>
          </motion.button>
          
          <div>
            <h1 className="text-lg font-bold">{bookTitle}</h1>
            <p className="text-sm text-gray-400">by {bookCreator}</p>
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

      {/* Book Reader */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[calc(100vh-160px)]'} w-full`}>
        <iframe
          src={`https://archive.org/embed/${identifier}?view=theater&page=${currentPage}`}
          className="w-full h-full border-none"
          title={bookTitle}
          allowFullScreen
        />
      </div>

      {/* Footer Info */}
      {!isFullscreen && (
        <div className="bg-gray-800 border-t border-gray-700 p-4 text-center text-sm text-gray-400">
          <p>Reading: {bookTitle} • Free access via Internet Archive</p>
        </div>
      )}
    </div>
  );
}

export default OpenLibraryReader;