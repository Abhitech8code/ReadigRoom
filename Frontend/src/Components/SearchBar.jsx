import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SearchBar({ className = "", isMobile = false }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    loadRecentSearches();
    
    // Keyboard shortcut (Ctrl/Cmd + K)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Handle click outside to close search results
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:4001/book");
      setAllBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const loadRecentSearches = () => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent.slice(0, 5));
  };

  const saveRecentSearch = (query) => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updated = [query, ...recent.filter(item => item !== query)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(isFocused && recentSearches.length > 0);
      return;
    }

    setIsSearching(true);
    
    const filtered = allBooks.filter(book =>
      book.name.toLowerCase().includes(query.toLowerCase()) ||
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.category.toLowerCase().includes(query.toLowerCase()) ||
      (book.author && book.author.toLowerCase().includes(query.toLowerCase()))
    );

    setTimeout(() => {
      setSearchResults(filtered.slice(0, 6));
      setShowResults(true);
      setIsSearching(false);
    }, 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      navigate("/course", { state: { searchQuery: searchQuery.trim() } });
      setShowResults(false);
      setSearchQuery("");
      inputRef.current?.blur();
    }
  };

  const handleBookClick = (book) => {
    saveRecentSearch(book.name);
    navigate("/payment", { state: { book } });
    setShowResults(false);
    setSearchQuery("");
    inputRef.current?.blur();
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      navigate("/course", { state: { searchQuery } });
      setShowResults(false);
      setSearchQuery("");
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={searchRef} className={`relative ${isMobile ? 'w-full' : 'w-full max-w-lg'} ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <svg
              className={`w-5 h-5 transition-all duration-300 ${
                isFocused || searchQuery ? "text-emerald-500 scale-110" : "text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (searchQuery || recentSearches.length > 0) {
                setShowResults(true);
              }
            }}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => setShowResults(false), 150);
            }}
            placeholder={isMobile ? "Search..." : "Search books, authors, categories..."}
            className={`w-full pl-12 pr-16 py-3.5 bg-white/90 backdrop-blur-xl border-2 rounded-2xl transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-lg ${
              isFocused 
                ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-xl bg-white' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
            } ${isMobile ? 'text-sm' : 'text-base'}`}
          />
          
          {/* Action Buttons */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            ) : searchQuery ? (
              <>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-6 h-6 text-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    setShowResults(false);
                    inputRef.current?.focus();
                  }}
                  className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </>
            ) : !isMobile ? (
              <div className="flex items-center space-x-1 text-gray-400 text-xs">
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border font-mono">⌘</kbd>
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border font-mono">K</kbd>
              </div>
            ) : null}
          </div>
        </div>
      </form>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50 max-h-96 overflow-y-auto"
          >
            {/* Recent Searches */}
            {!searchQuery && recentSearches.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  Recent Searches
                </div>
                {recentSearches.map((query, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleRecentSearchClick(query)}
                    className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center space-x-3"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{query}</span>
                  </motion.div>
                ))}
              </>
            )}
            
            {/* Search Results */}
            {searchResults.length > 0 ? (
              <>
                {!searchQuery && recentSearches.length > 0 && <div className="border-t border-gray-100 my-2"></div>}
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </div>
                
                {searchResults.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleBookClick(book)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center space-x-3 group"
                  >
                    <img
                      src={book.image}
                      alt={book.name}
                      className="w-10 h-14 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate group-hover:text-emerald-600 transition-colors">{book.name}</h4>
                      <p className="text-sm text-gray-600 truncate">{book.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          {book.category}
                        </span>
                        <span className="font-bold text-emerald-600">${book.price}</span>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                ))}
                
                {allBooks.filter(book =>
                  book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()))
                ).length > 6 && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleViewAllResults}
                    className="w-full px-4 py-3 text-center text-emerald-600 hover:bg-emerald-50 font-semibold transition-colors border-t border-gray-100 flex items-center justify-center space-x-2"
                  >
                    <span>View All Results</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                )}
              </>
            ) : searchQuery && !isSearching ? (
              <div className="px-4 py-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-600 mb-1">No books found</h3>
                <p className="text-sm text-gray-500">Try different keywords</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;