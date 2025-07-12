import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";

function EbookLibrary() {
  const [authUser] = useAuth();
  const navigate = useNavigate();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEbooks();
  }, []);

  const fetchEbooks = async () => {
    try {
      const res = await axios.get("http://localhost:4001/ebooks");
      setEbooks(res.data);
    } catch (error) {
      toast.error("Error fetching ebooks");
    } finally {
      setLoading(false);
    }
  };

  const handleReadNow = (ebook) => {
    if (!authUser) {
      toast.error("Please login to read books");
      return;
    }
    navigate(`/read/${ebook._id}`);
  };

  const filteredEbooks = ebooks.filter(ebook =>
    ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ebook.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ebook.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ebooks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Digital Library
          </h1>
          <p className="text-xl text-gray-600 mb-8">Read books online instantly</p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search books, authors, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-12 bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-lg"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>

        {/* Books Grid */}
        {filteredEbooks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredEbooks.map((ebook, index) => (
              <motion.div
                key={ebook._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 group"
              >
                {/* Book Cover */}
                <div className="relative overflow-hidden h-64">
                  <img
                    src={`http://localhost:4001${ebook.coverImage}`}
                    alt={ebook.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                      {ebook.category}
                    </span>
                  </div>

                  {/* Read Now Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReadNow(ebook)}
                      className="bg-white/90 backdrop-blur-sm text-purple-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-white transition-colors"
                    >
                      📖 Read Now
                    </motion.button>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {ebook.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">by {ebook.author}</p>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">{ebook.description}</p>
                  
                  {/* Book Details */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{ebook.fileSize}</span>
                    <span>{new Date(ebook.uploadDate).toLocaleDateString()}</span>
                  </div>

                  {/* Read Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleReadNow(ebook)}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Read Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              {searchTerm ? "No books found" : "No ebooks available"}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? "Try different search terms" : "Check back later for new additions"}
            </p>
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default EbookLibrary;