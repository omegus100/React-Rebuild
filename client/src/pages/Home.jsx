import React, { useEffect, useState } from 'react';
import BookCover from '../components/books/BookCover';
import { GetData } from '../hooks/getData';

export default function Home() {
    const [totalBooks, setTotalBooks] = useState(0);
    const [recentBooks, setRecentBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [formats, setFormats] = useState([]);

    const { data: books, error } = GetData('books');
    const newBooksLimit = 7; // Limit for the number of new books to display

    useEffect(() => {
        // Fetch data from your backend or API
        async function fetchBooks() {
            try {
                const response = await fetch('/api/books'); // Replace with your API endpoint
                const books = await response.json();

                // Update total books
                setTotalBooks(books.length);

                // Sort books by date (assuming books have a `dateAdded` field)
                const sortedBooks = books.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

                // Get the 5 most recent books
                setRecentBooks(sortedBooks.slice(0, newBooksLimit));
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        }

        // Fetch genres data
        async function fetchGenres() {
            try {
                const response = await fetch('/api/genres'); // Replace with your API endpoint
                const genresData = await response.json();
                setGenres(genresData);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        }

        // Fetch formats data
        async function fetchFormats() {
            try {
                const response = await fetch('/api/formats'); // Replace with your API endpoint
                const formatsData = await response.json();
                setFormats(formatsData);
            } catch (error) {
                console.error('Error fetching formats:', error);
            }
        }

        fetchBooks();
        fetchGenres();
        fetchFormats(); // Ensure this is always called, even if the logic is commented out
    }, []); // Ensure the dependency array is correct and doesn't cause conditional calls

    return (
        <>
            <header>
                <h1>Welcome to Your Library</h1>
                <p>Organize, explore, and enjoy your personal book collection.</p>
            </header>

            {/* Search and Filter */}
            <section>
                <h2>Search Your Library</h2>
                <input 
                    type="text" 
                    placeholder="Search by title, author, or genre" 
                    style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
                />
            </section>

            {/* Book Highlights */}
            <section>
                <h2>Recently Added Books</h2>
                <div className="book-grid">
                    <BookCover
                        books={recentBooks}
                        subtitle={(book) => `Book ${book.author.firstName} ${book.author.lastName}`}
                    />
                </div>
            </section>

            {/* Genres Section */}
            <section>
                <h2>Genres</h2>
                <div className="book-grid">
                    <BookCover
                        books={genres}
                        subtitle={(genre) => `Genre: ${genre.name}`}
                    />
                </div>
            </section>

            {/* Formats Section */}
            <section>
                <h2>Formats</h2>
                <div className="book-grid">
                    <BookCover
                        books={formats}
                        subtitle={(format) => `Format: ${format.name}`}
                    />
                </div>
            </section>

            {/* Recommendations */}
            <section>
                <h2>Recommendations for You</h2>
                <div className="book-grid">
                    <div className="book-card">Recommended Book 1</div>
                    <div className="book-card">Recommended Book 2</div>
                    <div className="book-card">Recommended Book 3</div>
                </div>
            </section>

            {/* Statistics */}
            <section>
                <h2>Your Library Stats</h2>
                <ul>
                    <li>Total Books: {totalBooks}</li>
                    <li>Books Read: 45</li>
                    <li>Currently Reading: 2</li>
                </ul>
            </section>

            {/* Interactive Features */}
            <section>
                <h2>Discover a Random Book</h2>
                <button 
                    style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
                    onClick={() => alert('Random Book: "The Great Gatsby"')}
                >
                    Suggest a Book
                </button>
            </section>
        </>
    );
}