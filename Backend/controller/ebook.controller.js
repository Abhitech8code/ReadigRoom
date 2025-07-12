import Ebook from "../model/ebook.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.fieldname === 'coverImage' ? 'uploads/covers/' : 'uploads/books/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'coverImage') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for cover'), false);
    }
  } else if (file.fieldname === 'pdfFile') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

export const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

export const addEbook = async (req, res) => {
  try {
    const { title, author, description, category } = req.body;
    
    if (!req.files || !req.files.coverImage || !req.files.pdfFile) {
      return res.status(400).json({ message: "Cover image and PDF file are required" });
    }

    const coverImage = `/uploads/covers/${req.files.coverImage[0].filename}`;
    const pdfFile = `/uploads/books/${req.files.pdfFile[0].filename}`;
    const fileSize = (req.files.pdfFile[0].size / (1024 * 1024)).toFixed(2) + ' MB';

    const ebook = new Ebook({
      title,
      author,
      description,
      category: category || "General",
      coverImage,
      pdfFile,
      fileSize,
      uploadedBy: "admin" // You can modify this to use actual user ID
    });

    await ebook.save();
    res.status(201).json({ message: "Ebook added successfully", ebook });
  } catch (error) {
    res.status(500).json({ message: "Error adding ebook", error: error.message });
  }
};

export const getAllEbooks = async (req, res) => {
  try {
    const ebooks = await Ebook.find().sort({ uploadDate: -1 });
    res.json(ebooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ebooks", error: error.message });
  }
};

export const getEbookById = async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id);
    if (!ebook) {
      return res.status(404).json({ message: "Ebook not found" });
    }
    res.json(ebook);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ebook", error: error.message });
  }
};

export const deleteEbook = async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id);
    if (!ebook) {
      return res.status(404).json({ message: "Ebook not found" });
    }

    // Delete files from filesystem
    const coverPath = `uploads/covers/${path.basename(ebook.coverImage)}`;
    const pdfPath = `uploads/books/${path.basename(ebook.pdfFile)}`;
    
    if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
    if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);

    await Ebook.findByIdAndDelete(req.params.id);
    res.json({ message: "Ebook deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ebook", error: error.message });
  }
};