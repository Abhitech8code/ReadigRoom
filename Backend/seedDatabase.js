import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "./model/book.model.js";

dotenv.config();

const books = [
  { id: "1", name: "Story Book", title: "Dive into an enchanting collection of short stories that blend adventure, imagination, and timeless morals—perfect for readers who love to explore magical worlds and rich storytelling.", price: 10, category: "Free", image: "https://img.freepik.com/free-photo/open-book-concept-fairy-tale-fiction-storytelling_23-2150793729.jpg" },
  { id: "2", name: "Entertainment Book", title: "A lively collection of stories and features packed with humor, suspense, and cinematic moments. Ideal for readers looking to relax and unwind.", price: 50, category: "Cinema", image: "https://img.freepik.com/premium-photo/yellow-headphones-book_410516-66153.jpg" },
  { id: "3", name: "Food Book", title: "Discover mouthwatering recipes, cooking tips, and food stories from across the globe. Perfect for food lovers and aspiring chefs alike.", price: 100, category: "Food", image: "https://img.freepik.com/premium-photo/closeup-hands-holding-cookbook-with-vibrant-generative-ai_883586-222572.jpg" },
  { id: "4", name: "Motivational Book", title: "A powerful guide filled with real-life stories, mindset shifts, and strategies to overcome obstacles. Ideal for anyone seeking clarity, strength, and personal growth.", price: 200, category: "Motivation", image: "https://img.freepik.com/premium-photo/handwriting-think-bubble_1262102-14659.jpg" },
  { id: "5", name: "Sport Book", title: "Explore iconic sports moments, inspiring athletes, and winning techniques. A must-read for sports lovers and future champions.", price: 400, category: "Sports", image: "https://img.freepik.com/premium-photo/clipboard-sports-equipment_926199-3764664.jpg" },
  { id: "6", name: "Health & Wellness", title: "Unlock the secrets to a balanced life with tips on nutrition, mental health, fitness, and self-care. Your companion for inner peace and daily energy.", price: 200, category: "Story", image: "https://img.freepik.com/premium-photo/healthy-smoothie-recipe-book-kitchen-counter_623612-6341.jpg" },
  { id: "7", name: "Novel Book", title: "Immerse yourself in a gripping story where emotions run deep and every chapter reveals a new twist. Perfect for fans of heart-touching fiction and suspense.", price: 400, category: "Novel", image: "https://images.pexels.com/photos/14515815/pexels-photo-14515815.jpeg" },
  { id: "8", name: "Science Book", title: "Dive into the fascinating world of science with easy explanations and real-life applications. Ideal for curious minds and future innovators.", price: 200, category: "Science", image: "https://img.freepik.com/premium-photo/book-that-has-word-science-it_1058338-3678.jpg" },
  { id: "9", name: "Tech Book", title: "Explore emerging technologies, artificial intelligence, and the future of connectivity. A must-read for tech enthusiasts and forward thinkers.", price: 500, category: "Tech", image: "https://img.freepik.com/premium-psd/3-d-illustration-information-technology-book-icon_727843-1777.jpg" },
  { id: "10", name: "Artificial Intelligence Book", title: "Learn how AI is reshaping our world—from smart assistants to self-driving cars. A beginner-friendly guide with deep insights into the AI revolution.", price: 600, category: "AI", image: "https://img.freepik.com/premium-photo/book-that-has-ad-all-purpose-device_1166173-6797.jpg" },
  { id: "11", name: "English Book", title: "Improve your fluency, grammar, and writing with easy-to-follow lessons. Perfect for learners at all levels aiming to communicate effectively.", price: 100, category: "Language", image: "https://img.freepik.com/free-photo/english-books-arrangement-red-table-high-angle_23-2149440465.jpg" },
  { id: "12", name: "Drama Book", title: "Experience powerful narratives that explore human emotions and relationships through gripping drama. Perfect for lovers of intense storytelling.", price: 100, category: "Drama", image: "https://img.freepik.com/free-vector/realistic-theatre-show-poster-template_23-2149856854.jpg" },
  { id: "13", name: "Travel Book", title: "Discover captivating travel stories, tips, and guides to inspire your next adventure. Perfect for explorers and dreamers alike.", price: 100, category: "Travel", image: "https://img.freepik.com/premium-photo/world-famous-place-travel-background_403587-15084.jpg" },
  { id: "14", name: "Children's Books", title: "Engaging stories full of imagination and learning, designed to inspire young minds and nurture a love for reading.", price: 100, category: "Childhood", image: "https://img.freepik.com/free-vector/boy-girl-are-reading-books-stack-books_1308-101071.jpg" },
  { id: "15", name: "Love Book", title: "Explore touching stories that celebrate the power of love and human connection, perfect for hopeless romantics.", price: 400, category: "Romance", image: "https://img.freepik.com/free-photo/still-life-sant-jordi-day-books-roses_23-2151197521.jpg" },
  { id: "16", name: "Mystery Book", title: "Dive into suspenseful tales full of twists, secrets, and edge-of-your-seat thrills that keep you guessing until the last page.", price: 500, category: "Mystery / Thriller", image: "https://img.freepik.com/premium-psd/halloween-scary-book-mockup-design_23-2151662175.jpg" },
  { id: "17", name: "Power of Subconscious Mind", title: "This book is designed to teach you that your habitual thinking and imagery mold, fashion, and create your destiny; for as a man thinketh in his sub-conscious mind", price: 200, category: "Psychology", image: "https://i0.wp.com/www.adorebooks.in/wp-content/uploads/2022/02/Untitled-design-62.jpg" },
  { id: "18", name: "Psychology of Money", title: "The Psychology of Money is an insightful and thought-provoking book that offers a fresh perspective on a subject that affects us all", price: 450, category: "Psychology", image: "https://www.arabnews.com/sites/default/files/styles/n_670_395/public/2023/08/15/3953231-1182508844.jpg" },
  { id: "19", name: "Rich Dad Poor Dad", title: "The book encourages readers to develop financial independence through investing, business ownership, and smart money management, rather than relying only on traditional jobs.", price: 349, category: "Psychology", image: "https://minoa.com/cdn/shop/files/5_5b6a122e-f75f-446d-b4b6-c9f82f876772_2400x.png" }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MongoDBURI);
    console.log("✅ Connected to MongoDB Atlas");
    
    await Book.deleteMany({});
    console.log("🗑️ Cleared existing books");
    
    await Book.insertMany(books);
    console.log(`✅ Successfully added ${books.length} books to MongoDB Atlas`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
}

seedDatabase();