import React, { useEffect, useState } from 'react'
import BookCover from '../components/books/BookCover'
import { GetData, GetBookObjectData } from '../hooks/getData'
import { Loading } from '../components/Icons'
import { GridLayout } from '../components/PageLayouts'

export default function Home() {
    const [totalBooks, setTotalBooks] = useState(0)
    const [recentBooks, setRecentBooks] = useState([])
    // const [genres, setGenres] = useState([])
    // const [formats, setFormats] = useState([])
    const { data: books, error, isLoading } = GetData('books')
    const { data: genres  } = GetBookObjectData('genres') 
    const { data: formats } = GetBookObjectData('format') 

    const newBooksLimit = 7 // Limit for the number of new books to display

    // Process books to find recent ones
    if (books && books.length > 0 && recentBooks.length === 0) {
        // Update total books
        setTotalBooks(books.length)

   

        // Sort books by dateAdded (assuming books have a `dateAdded` field)
        const sortedBooks = books.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))

        // Get the most recent books
        setRecentBooks(sortedBooks.slice(0, newBooksLimit))
    }

    // Update finished books (assuming finished books are those with a reading status of 'finished')
    const finishedBooksCount = books.filter((book) => book.readingStatus === 'Read').length

    if (isLoading) {
        return <Loading />
    }

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
                {genres.map((genre, index) => {
                    const booksInGenre = books.filter((book) => book.genres.includes(genre)) // Filter books for the genre
                    const bookCount = booksInGenre.length // Count books for each genre
                    const limitedBooks = booksInGenre.slice(0, newBooksLimit) // Limit books to listLimit
                    const genreName = genre.toLowerCase()

                    return (
                        <div key={index}>
                            
                            <GridLayout
                                books={limitedBooks} // Pass only the limited books
                                value={genre}
                                property="genres"
                                count={bookCount} // Pass the book count to the GridLayout component
                                object="Genres"
                                link={`/genres/${genreName}`}
                                limit={limitedBooks.length} // Pass the limit to the GridLayout component
                            />
                            
                        </div>
                    )
                })}
            </section>

            {/* Formats Section */}
            <section>
                <h2>Formats</h2>
                {formats.map((format, index) => {
                    // const booksInFormat = books.filter((book) => book.formats.includes(format)) // Filter books for the format
                    // const bookCount = booksInFormat.length // Count books for each format
                    // const limitedBooks = booksInFormat.slice(0, newBooksLimit) // Limit books to listLimit
                    // const formatName = format.toLowerCase()

                    return (
                        <div key={index}>
                            <span>{format} </span>
                        
                        </div>
                    )
                }
                )}
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
                    <li>Books Read: {finishedBooksCount}</li>
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
    )
}