import express from "express";
import { addEbook, getAllEbooks, getEbookById, deleteEbook, upload } from "../controller/ebook.controller.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllEbooks);
router.get("/:id", getEbookById);

// Admin routes
router.post("/", verifyAdmin, upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), addEbook);
router.delete("/:id", verifyAdmin, deleteEbook);

export default router;