import express from "express";
import { adminLogin, addBook, deleteBook, getAllBooks } from "../controller/admin.controller.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/books", verifyAdmin, getAllBooks);
router.post("/books", verifyAdmin, addBook);
router.delete("/books/:id", verifyAdmin, deleteBook);

export default router;