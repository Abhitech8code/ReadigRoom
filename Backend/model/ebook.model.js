import mongoose from "mongoose";

const ebookSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String, required: true },
  pdfFile: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  category: { type: String, default: "General" },
  fileSize: { type: String },
  pages: { type: Number, default: 0 }
});

const Ebook = mongoose.model("Ebook", ebookSchema);
export default Ebook;