import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";

function EbookUpload() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: ""
  });
  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!coverImage || !pdfFile) {
      toast.error("Please select both cover image and PDF file");
      return;
    }

    setIsUploading(true);
    const uploadData = new FormData();
    
    Object.keys(formData).forEach(key => {
      uploadData.append(key, formData[key]);
    });
    uploadData.append('coverImage', coverImage);
    uploadData.append('pdfFile', pdfFile);

    try {
      const token = localStorage.getItem("adminToken");
      await axios.post("http://localhost:4001/ebooks", uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success("📚 Ebook uploaded successfully!");
      setFormData({ title: "", author: "", description: "", category: "" });
      setCoverImage(null);
      setPdfFile(null);
      setPreviewImage(null);
    } catch (error) {
      toast.error("Error uploading ebook: " + (error.response?.data?.message || "Upload failed"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Upload New Ebook</h1>
            <p className="opacity-90">Add a new book to your digital library</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Book Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter book title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Author Name</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter author name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select category</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science">Science</option>
                    <option value="Technology">Technology</option>
                    <option value="Biography">Biography</option>
                    <option value="History">History</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Enter book description"
                    required
                  />
                </div>
              </div>

              {/* Right Column - File Uploads */}
              <div className="space-y-6">
                {/* Cover Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-500 transition-colors">
                    {previewImage ? (
                      <div className="relative">
                        <img src={previewImage} alt="Preview" className="w-32 h-48 object-cover mx-auto rounded-lg shadow-lg" />
                        <button
                          type="button"
                          onClick={() => {
                            setCoverImage(null);
                            setPreviewImage(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div>
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 mb-2">Click to upload cover image</p>
                        <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* PDF Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">PDF File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-500 transition-colors">
                    {pdfFile ? (
                      <div className="flex items-center justify-center space-x-3">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-800">{pdfFile.name}</p>
                          <p className="text-sm text-gray-500">{(pdfFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPdfFile(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div>
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 mb-2">Click to upload PDF file</p>
                        <p className="text-sm text-gray-500">PDF up to 50MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isUploading}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  "Upload Ebook"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}

export default EbookUpload;