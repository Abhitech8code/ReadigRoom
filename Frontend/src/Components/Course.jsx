import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import axios from "axios";
import { Link } from "react-router-dom";

function Course() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4001/book");
        setBooks(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Filter books by search term (case insensitive)
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="max-w-screen-2xl container mx-auto px-4 md:px-20 py-12 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Header Section */}
      <section className="mt-24 text-center space-y-6 max-w-5xl mx-auto">
        {/* Header Title and Animation side-by-side */}
        <div className="flex flex-col md:flex-row items-center justify-center md:gap-2 gap-1 text-center md:text-left">
          <h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight flex items-center"
            style={{ animation: "fadeInDown 1s ease forwards" }}
          >
            Welcome to{" "}
            <span className="text-emerald-500 animate-pulse ml-2 flex items-center">
              BookNest
              <div className="ml-1 w-[120px] md:w-[180px]">
                <iframe
                  src="https://lottie.host/embed/1e20c646-487c-4fb9-aac0-b7b96179f5fa/rgSg0FAKHU.lottie"
                  title="Learning Banner"
                  className="w-full h-full scale-[1.15] transition-transform duration-500 hover:scale-[1.2] dark:brightness-90 dark:contrast-110"
                  style={{ transformOrigin: "center" }}
                  loading="lazy"
                ></iframe>
              </div>
            </span>
          </h1>
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl leading-relaxed">
          Books are the quietest companions, yet the loudest in wisdom. Start
          your next chapter today and let stories shape your soul. Every book
          holds a world waiting to be discovered.
        </p>
        <Link to="/">
          <button
            className="bg-emerald-500 text-white px-8 py-3 rounded-full hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-400 shadow-lg transition duration-300"
            aria-label="Back to Home"
          >
            ← Back to Home
          </button>
        </Link>
      </section>

      {/* Search Section */}
      <section className="mt-16 max-w-xl mx-auto">
        <input
          type="search"
          placeholder="Search books by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          aria-label="Search books"
        />
      </section>

      {/* Content Section */}
      <section className="mt-12 min-h-[40vh]">
        {loading && (
          <p className="text-center text-lg text-gray-500 dark:text-gray-400 animate-pulse">
            Loading books...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        )}
        {!loading && !error && filteredBooks.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No books found matching your search.
          </p>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredBooks.map((item, idx) => (
            <div
              key={item.id}
              className="opacity-0 animate-fadeInUp animation-delay-[calc(100ms*var(--i))]"
              style={{ "--i": idx }}
            >
              <Cards item={item} />
            </div>
          ))}
        </div>
      </section>

      {/* Custom animation styles */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s forwards;
        }
        .animation-delay-\\[calc\\(100ms\\*var\\(--i\\)\\)\\] {
          animation-delay: calc(100ms * var(--i));
        }
      `}</style>
    </main>
  );
}

export default Course;
