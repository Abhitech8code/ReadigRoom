import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthProvider";
import Navbar from "./Navbar";
import Footer from "./Footer";

function MyBooks() {
  const [authUser] = useAuth();
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [readingProgress, setReadingProgress] = useState([]);
  const [activeTab, setActiveTab] = useState('owned');

  useEffect(() => {
    if (authUser) {
      const purchased = JSON.parse(localStorage.getItem(`purchasedBooks_${authUser._id}`) || "[]");
      const favorites = JSON.parse(localStorage.getItem(`favoriteBooks_${authUser._id}`) || "[]");
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${authUser._id}`) || "[]");
      const progress = JSON.parse(localStorage.getItem(`readingProgress_${authUser._id}`) || "[]");
      
      setPurchasedBooks(purchased);
      setFavoriteBooks(favorites);
      setWishlistBooks(wishlist);
      setReadingProgress(progress);
    }
  }, [authUser]);

  const toggleFavorite = (book) => {
    const isFavorite = favoriteBooks.some(fav => fav.id === book.id);
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favoriteBooks.filter(fav => fav.id !== book.id);
    } else {
      updatedFavorites = [...favoriteBooks, book];
    }
    
    setFavoriteBooks(updatedFavorites);
    localStorage.setItem(`favoriteBooks_${authUser._id}`, JSON.stringify(updatedFavorites));
  };

  const updateReadingProgress = (bookId, progress) => {
    const updatedProgress = readingProgress.filter(p => p.bookId !== bookId);
    updatedProgress.push({ bookId, progress, lastUpdated: new Date().toISOString() });
    
    setReadingProgress(updatedProgress);
    localStorage.setItem(`readingProgress_${authUser._id}`, JSON.stringify(updatedProgress));
  };

  const getReadingProgress = (bookId) => {
    const progress = readingProgress.find(p => p.bookId === bookId);
    return progress ? progress.progress : 0;
  };

  const removeFromWishlist = (bookId) => {
    const updatedWishlist = wishlistBooks.filter(book => book.id !== bookId);
    setWishlistBooks(updatedWishlist);
    localStorage.setItem(`wishlist_${authUser._id}`, JSON.stringify(updatedWishlist));
  };

  const BookCard = ({ book, showFavorite = false, showProgress = false, showWishlist = false }) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative">
        <img
          src={book.image}
          alt={book.name}
          className="w-full h-48 object-cover"
        />
        {showFavorite && (
          <button
            onClick={() => toggleFavorite(book)}
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <svg
              className={`w-5 h-5 ${
                favoriteBooks.some(fav => fav.id === book.id)
                  ? "text-red-500 fill-current"
                  : "text-gray-400"
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
          </button>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{book.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{book.title}</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-xs font-semibold rounded-full">
              {book.category}
            </span>
            <span className="text-lg font-bold text-emerald-600">${book.price}</span>
          </div>
          
          {showProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Reading Progress</span>
                <span className="text-emerald-600 font-semibold">{getReadingProgress(book.id)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getReadingProgress(book.id)}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={getReadingProgress(book.id)}
                onChange={(e) => updateReadingProgress(book.id, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          )}
          
          {showWishlist && (
            <button
              onClick={() => removeFromWishlist(book.id)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Remove from Wishlist
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            My Library
          </h1>
          <p className="text-xl text-gray-600">Your personal collection of books</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-800">{purchasedBooks.length}</p>
              <p className="text-gray-600 text-sm">Books Owned</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-800">{favoriteBooks.length}</p>
              <p className="text-gray-600 text-sm">Favorites</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-800">{wishlistBooks.length}</p>
              <p className="text-gray-600 text-sm">Wishlist</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-800">{readingProgress.length}</p>
              <p className="text-gray-600 text-sm">In Progress</p>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {[
            { id: 'owned', label: 'Books Owned', count: purchasedBooks.length },
            { id: 'favorites', label: 'Favorites', count: favoriteBooks.length },
            { id: 'wishlist', label: 'Wishlist', count: wishlistBooks.length },
            { id: 'progress', label: 'Reading Progress', count: readingProgress.length }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                  : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id ? "bg-white/20" : "bg-gray-200"
              }`}>
                {tab.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content based on active tab */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'owned' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Books Owned</h2>
              {purchasedBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {purchasedBooks.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <BookCard book={book} showFavorite={true} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">No Books Owned</h3>
                  <p className="text-gray-500 mb-6">Start building your library by purchasing some books</p>
                  <motion.a
                    href="/course"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Browse Books
                  </motion.a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Favorite Books</h2>
              {favoriteBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favoriteBooks.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <BookCard book={book} showFavorite={true} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">No Favorites Yet</h3>
                  <p className="text-gray-500">Add books to your favorites by clicking the heart icon</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Wishlist</h2>
              {wishlistBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {wishlistBooks.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <BookCard book={book} showWishlist={true} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">No Wishlist Items</h3>
                  <p className="text-gray-500">Add books to your wishlist by clicking the heart icon while browsing</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'progress' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Reading Progress</h2>
              {purchasedBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {purchasedBooks.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <BookCard book={book} showProgress={true} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">No Books to Track</h3>
                  <p className="text-gray-500">Purchase some books to start tracking your reading progress</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}

export default MyBooks;