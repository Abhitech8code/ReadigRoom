import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";

function Cards({ item }) {
  const navigate = useNavigate();
  const [authUser] = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (authUser) {
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${authUser._id}`) || "[]");
      setIsWishlisted(wishlist.some(book => book.id === item.id));
    }
  }, [authUser, item.id]);

  const handleBuyNow = () => {
    navigate("/payment", { state: { book: item } });
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (!authUser) {
      toast.error("Please login to add to wishlist");
      return;
    }

    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${authUser._id}`) || "[]");
    let updatedWishlist;

    if (isWishlisted) {
      updatedWishlist = wishlist.filter(book => book.id !== item.id);
      toast.success("Removed from wishlist");
    } else {
      updatedWishlist = [...wishlist, item];
      toast.success("Added to wishlist");
    }

    localStorage.setItem(`wishlist_${authUser._id}`, JSON.stringify(updatedWishlist));
    setIsWishlisted(!isWishlisted);
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group cursor-pointer w-full max-w-sm mx-auto"
    >
      <div className="bg-white/90 backdrop-blur-xl shadow-xl border border-white/30 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 h-[480px] flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden h-64">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleWishlist}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-colors ${
                  isWishlisted ? "text-red-500 fill-current" : "text-gray-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </motion.button>
            <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
              {item.category}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center space-x-1 text-white text-sm">
              <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">4.8</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight">
              {item.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {item.title}
            </p>
          </div>

          {/* Price & Button */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ${item.price}
              </span>
              <span className="text-xs text-gray-500">Best Price</span>
            </div>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBuyNow}
              className="relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 overflow-hidden group/btn"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Buy Now</span>
                <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Cards;
