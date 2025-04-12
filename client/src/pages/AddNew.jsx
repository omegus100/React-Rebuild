import React, { useState } from 'react';
import axios from 'axios';
import { SubmitButton } from '../components/Buttons';

const AddNew = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBooks = async () => {
        if (!searchQuery) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
                params: { q: searchQuery }
            });

            // Map the retrieved data to match the bookSchema
            const mappedBooks = (response.data.items || []).map((book) => {
                const volumeInfo = book.volumeInfo;

                return {
                    title: volumeInfo.title || 'Unknown Title',
                    author: volumeInfo.authors?.join(', ') || 'Unknown Author',
                    publishDate: volumeInfo.publishedDate || 'N/A',
                    publisher: volumeInfo.publisher || 'N/A',
                    pageCount: volumeInfo.pageCount || 0,
                    genres: volumeInfo.categories || [],
                    description: volumeInfo.description || 'No description available.',
                    coverImagePath: volumeInfo.imageLinks?.thumbnail || '/no_book_cover_available.svg'
                };
            });

            setBooks(mappedBooks); // Set the mapped books to state
        } catch (err) {
            console.error('Error fetching books:', err);
            setError('Failed to fetch books. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (book) => {
        try {
            console.log('Submitting Book:', book);

            // Example: Send the book data to an API endpoint
            const response = await axios.post('/api/books', book);
            console.log('Book submitted successfully:', response.data);

            // Optionally, show a success message or update the UI
            alert(`Book "${book.title}" submitted successfully!`);
        } catch (err) {
            console.error('Error submitting book:', err);
            alert('Failed to submit the book. Please try again.');
        }
    };

    return (
        <>
            <div>
                <h1>Search for Books</h1>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter book title"
                />
                <button onClick={fetchBooks}>Search</button>

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div>
                    {books.map((book, index) => (
                        <form
                            key={index}
                            onSubmit={async (e) => {
                                e.preventDefault();
                                await handleSubmit(book);
                            }}
                        >
                            <h3>{book.title}</h3>
                            <p>Author: {book.author}</p>
                            <img src={book.coverImagePath} alt={book.title} />
                            <span>Published Date: {book.publishDate}</span>
                            <span>Publisher: {book.publisher}</span>
                            <p>Page Count: {book.pageCount}</p>
                            <p>Genre: {book.genres.join(', ') || 'N/A'}</p>
                            <p>Description: {book.description}</p>
                            <SubmitButton isEditing={false} object="Book" />
                        </form>
                    ))}
                </div>
            </div>
        </>
    );
};

export default AddNew;