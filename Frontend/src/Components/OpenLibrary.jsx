import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";

function OpenLibrary() {
  const [authUser] = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const searchBooks = async (query, page = 1) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const searchParam = searchType === 'isbn' ? `isbn:${query}` : 
                         searchType === 'author' ? `author:${query}` : 
                         `title:${query}`;
      
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchParam)}&page=${page}&limit=20&fields=key,title,author_name,first_publish_year,isbn,cover_i,ia,ebook_access,has_fulltext,public_scan_b,lending_edition_s,lending_identifier_s,edition_count,subject,publisher`
      );
      
      const data = await response.json();
      setBooks(data.docs || []);
      setTotalResults(data.numFound || 0);
      setCurrentPage(page);
    } catch (error) {
      toast.error("Error searching books. Please try again.");
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchBooks(searchQuery, 1);
    }
  };

  const getCoverUrl = (coverId, size = 'M') => {
    return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : null;
  };

  const getReadingOptions = (book) => {
    const options = {
      canRead: false,
      canDownload: false,
      readUrl: null,
      downloadUrls: []
    };

    // Check for Internet Archive access
    if (book.ia && book.ia.length > 0) {
      options.canRead = true;
      options.readUrl = `https://archive.org/details/${book.ia[0]}`;
      
      // Check for downloadable formats
      if (book.has_fulltext) {
        options.canDownload = true;
        options.downloadUrls = [
          { format: 'PDF', url: `https://archive.org/download/${book.ia[0]}/${book.ia[0]}.pdf` },
          { format: 'EPUB', url: `https://archive.org/download/${book.ia[0]}/${book.ia[0]}.epub` }
        ];
      }
    }

    // Check for lending edition
    if (book.lending_edition_s) {
      options.canRead = true;
      options.readUrl = `https://openlibrary.org${book.key}`;
    }

    // Check for public scan
    if (book.public_scan_b) {
      options.canRead = true;
      options.readUrl = `https://openlibrary.org${book.key}`;
    }

    return options;
  };

  const handleReadNow = (book) => {
    if (!authUser) {
      toast.error("Please login to read books");
      return;
    }

    const options = getReadingOptions(book);
    if (options.canRead && options.readUrl) {
      window.open(options.readUrl, '_blank');
    } else {
      toast.error("This book is not available for free reading");
    }
  };

  const handleDownload = (url, format) => {
    if (!authUser) {
      toast.error("Please login to download books");
      return;
    }

    window.open(url, '_blank');
    toast.success(`Downloading ${format} format...`);
  };

  const openBookModal = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const BookCard = ({ book, index }) => {
    const options = getReadingOptions(book);
    const coverUrl = getCoverUrl(book.cover_i);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer"
        onClick={() => openBookModal(book)}
      >
        <div className="relative h-64 overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/300x400/6366f1/white?text=${encodeURIComponent(book.title?.substring(0, 20) || 'No Title')}`;
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white p-4">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-sm font-medium">{book.title?.substring(0, 30)}...</p>
              </div>
            </div>
          )}
          
          {/* Availability Badges */}
          <div className="absolute top-3 right-3 flex flex-col space-y-1">
            {options.canRead && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                📖 Free Read
              </span>
            )}
            {options.canDownload && (
              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                📥 Download
              </span>
            )}
          </div>

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <div className="flex space-x-2">
              {options.canRead && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadNow(book);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg transition-colors"
                >
                  Read Now
                </motion.button>
              )}
              {options.canDownload && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openBookModal(book);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg transition-colors"
                >
                  Download
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {book.title || "Unknown Title"}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            by {book.author_name?.join(", ") || "Unknown Author"}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>{book.first_publish_year || "Unknown Year"}</span>
            <span>{book.edition_count || 1} edition{(book.edition_count || 1) > 1 ? 's' : ''}</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            {options.canRead ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReadNow(book);
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                📖 Read Free
              </motion.button>
            ) : (
              <div className="flex-1 bg-gray-300 text-gray-500 py-2 px-3 rounded-lg font-semibold text-sm text-center">
                Not Available
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Open Library Search
          </h1>
          <p className="text-xl text-gray-600 mb-8">Access millions of free books from the Internet Archive</p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-4 py-3 bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-lg"
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="isbn">ISBN</option>
              </select>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={`Search by ${searchType}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-3 pl-12 bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-lg"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Searching...</span>
                  </div>
                ) : (
                  "Search Books"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Results */}
        {totalResults > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 text-center"
          >
            <p className="text-gray-600">
              Found <span className="font-bold text-indigo-600">{totalResults.toLocaleString()}</span> results
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </motion.div>
        )}

        {/* Books Grid */}
        {books.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12"
          >
            {books.map((book, index) => (
              <BookCard key={book.key || index} book={book} index={index} />
            ))}
          </motion.div>
        ) : !loading && searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500">Try different search terms or check your spelling</p>
          </motion.div>
        )}

        {/* Pagination */}
        {books.length > 0 && totalResults > 20 && (
          <div className="flex justify-center space-x-2">
            {currentPage > 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => searchBooks(searchQuery, currentPage - 1)}
                className="bg-white/80 backdrop-blur-xl border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </motion.button>
            )}
            
            <span className="bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold">
              Page {currentPage}
            </span>
            
            {currentPage * 20 < totalResults && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => searchBooks(searchQuery, currentPage + 1)}
                className="bg-white/80 backdrop-blur-xl border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Next
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Book Details Modal */}
      <AnimatePresence>
        {showModal && selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedBook.title}</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {getCoverUrl(selectedBook.cover_i, 'L') ? (
                      <img
                        src={getCoverUrl(selectedBook.cover_i, 'L')}
                        alt={selectedBook.title}
                        className="w-full rounded-2xl shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-80 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white">
                        <div className="text-center">
                          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <p className="font-semibold">No Cover Available</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Author(s)</h3>
                      <p className="text-gray-600">{selectedBook.author_name?.join(", ") || "Unknown"}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Publication Year</h3>
                      <p className="text-gray-600">{selectedBook.first_publish_year || "Unknown"}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Editions</h3>
                      <p className="text-gray-600">{selectedBook.edition_count || 1}</p>
                    </div>

                    {selectedBook.subject && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Subjects</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedBook.subject.slice(0, 5).map((subject, index) => (
                            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Download Options */}
                    {(() => {
                      const options = getReadingOptions(selectedBook);
                      return (
                        <div className="space-y-3 pt-4">
                          {options.canRead && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleReadNow(selectedBook)}
                              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                              📖 Read Online Free
                            </motion.button>
                          )}
                          
                          {options.canDownload && options.downloadUrls.map((download, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleDownload(download.url, download.format)}
                              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                              📥 Download {download.format}
                            </motion.button>
                          ))}
                          
                          {!options.canRead && !options.canDownload && (
                            <div className="text-center py-4">
                              <p className="text-gray-500 mb-2">This book is not available for free access</p>
                              <a
                                href={`https://openlibrary.org${selectedBook.key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-700 font-semibold"
                              >
                                View on Open Library →
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
}

export default OpenLibrary;