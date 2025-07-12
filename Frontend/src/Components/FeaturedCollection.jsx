import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Cards from "./Cards";
import axios from "axios";

function FeaturedCollection() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Fiction", "Science", "Technology", "Romance", "Mystery", "Biography"];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:4001/book");
      setBooks(res.data.slice(0, 8)); // Show only 8 books on home page
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = activeCategory === "All" 
    ? books.slice(0, 8) 
    : books.filter(book => book.category.toLowerCase().includes(activeCategory.toLowerCase())).slice(0, 8);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Featured Collection</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6 leading-tight">
            Handpicked for You
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our carefully curated selection of trending books across various genres. 
            Each book is chosen for its exceptional quality, engaging content, and reader satisfaction.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                  : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-teal-600 rounded-full animate-spin animation-delay-150"></div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.1 * (index % 8),
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
              >
                <Cards item={book} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.a
            href="/course"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(16, 185, 129, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 group"
          >
            <span>Explore All Books</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.a>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: "10K+", label: "Happy Readers", icon: "👥" },
            { number: "500+", label: "Books Available", icon: "📚" },
            { number: "50+", label: "Categories", icon: "🏷️" },
            { number: "4.9", label: "Average Rating", icon: "⭐" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedCollection;