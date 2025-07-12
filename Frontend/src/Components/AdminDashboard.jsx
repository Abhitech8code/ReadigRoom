import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin User",
    email: "admin@readingroom.com",
    avatar: ""
  });
  const [newBook, setNewBook] = useState({
    name: "", title: "", author: "", price: "", category: "", description: "", image: "", isbn: ""
  });
  const navigate = useNavigate();

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    
    // Load admin profile
    const savedProfile = localStorage.getItem("adminProfile");
    if (savedProfile) {
      setAdminProfile(JSON.parse(savedProfile));
    }
    
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:4001/admin/books", getAuthHeaders());
      setBooks(res.data);
      console.log(`Loaded ${res.data.length} books from MongoDB Atlas`);
    } catch (error) {
      toast.error("Error fetching books from MongoDB Atlas");
      console.error("Fetch error:", error);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4001/admin/books", newBook, getAuthHeaders());
      toast.success("📚 Book added successfully!", {
        style: { background: '#10B981', color: 'white', borderRadius: '12px' }
      });
      setNewBook({ name: "", title: "", author: "", price: "", category: "", description: "", image: "", isbn: "" });
      setShowAddForm(false);
      fetchBooks();
    } catch (error) {
      toast.error("❌ Error adding book", {
        style: { background: '#EF4444', color: 'white', borderRadius: '12px' }
      });
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to remove this book from your collection?")) {
      try {
        await axios.delete(`http://localhost:4001/admin/books/${id}`, getAuthHeaders());
        toast.success("🗑️ Book removed successfully!", {
          style: { background: '#10B981', color: 'white', borderRadius: '12px' }
        });
        fetchBooks();
      } catch (error) {
        toast.error("❌ Error removing book", {
          style: { background: '#EF4444', color: 'white', borderRadius: '12px' }
        });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedProfile = { ...adminProfile, avatar: e.target.result };
        setAdminProfile(updatedProfile);
        localStorage.setItem("adminProfile", JSON.stringify(updatedProfile));
        toast.success("Profile photo updated!", {
          style: { background: '#10B981', color: 'white', borderRadius: '12px' }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = () => {
    localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
    setShowProfile(false);
    toast.success("Profile updated successfully!", {
      style: { background: '#10B981', color: 'white', borderRadius: '12px' }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              {/* Admin Profile Photo */}
              <div className="relative">
                <img
                  src={adminProfile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminProfile.name)}&background=3b82f6&color=fff&size=48&rounded=true`}
                  alt="Admin"
                  className="w-12 h-12 rounded-xl border-2 border-white/30 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setShowProfile(true)}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {adminProfile.name}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfile(true)}
                className="px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(!showAddForm)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  showAddForm 
                    ? "bg-gray-500 hover:bg-gray-600 text-white" 
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {showAddForm ? "Cancel" : "+ Add Book"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Logout
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Add Book Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 mb-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Add New Book</h2>
              </div>
              
              <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Book Name</label>
                  <input
                    type="text"
                    value={newBook.name}
                    onChange={(e) => setNewBook({...newBook, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all duration-300"
                    placeholder="Enter book name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newBook.title}
                    onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all duration-300"
                    placeholder="Enter book title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Author</label>
                  <input
                    type="text"
                    value={newBook.author}
                    onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all duration-300"
                    placeholder="Enter author name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newBook.price}
                    onChange={(e) => setNewBook({...newBook, price: e.target.value})}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all duration-300"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Category</label>
                  <select
                    value={newBook.category}
                    onChange={(e) => setNewBook({...newBook, category: e.target.value})}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all duration-300"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science">Science</option>
                    <option value="Technology">Technology</option>
                    <option value="Romance">Romance</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Biography">Biography</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">ISBN</label>
                  <input
                    type="text"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all duration-300"
                    placeholder="Enter ISBN"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={newBook.image}
                    onChange={(e) => setNewBook({...newBook, image: e.target.value})}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all duration-300"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    value={newBook.description}
                    onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all duration-300 h-32 resize-none"
                    placeholder="Enter book description"
                    required
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="md:col-span-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Add Book to Collection
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Profile Modal */}
        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowProfile(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-md"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Admin Profile
                  </h2>
                  <p className="text-gray-600">Manage your profile information</p>
                </div>

                <div className="space-y-6">
                  {/* Profile Photo */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <img
                        src={adminProfile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminProfile.name)}&background=3b82f6&color=fff&size=120&rounded=true`}
                        alt="Admin Profile"
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto"
                      />
                      <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={adminProfile.name}
                        onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={adminProfile.email}
                        onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleProfileSave}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Save Changes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowProfile(false)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Books Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={book.image}
                  alt={book.name}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">{book.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">by {book.author || 'Unknown'}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-semibold rounded-full">
                      {book.category}
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ${book.price}
                    </span>
                  </div>
                  {book.description && (
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{book.description}</p>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteBook(book.id)}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Remove Book
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {books.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Books Yet</h3>
            <p className="text-gray-500 mb-6">Start building your collection by adding your first book</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Add Your First Book
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;