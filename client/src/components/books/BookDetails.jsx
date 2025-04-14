import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { GoBackButton, DeleteButton, EditButton } from '../Buttons'
import GetAuthors from '../../hooks/GetAuthors'
import GetBooks from '../../hooks/GetBooks'
import BookCover from './BookCover'
import styles from '../../stylesheets/BookDetails.css'

export default function BookDetails() {
    const { id } = useParams() // Get the book ID from the URL
    const navigate = useNavigate() // Use navigate to redirect after deletion
    const [book, setBook] = useState(null)
    const [error, setError] = useState(null)
    const { authors } = GetAuthors() 
    const { books } = GetBooks() 

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`/api/books/${id}`)
                setBook(response.data)
            } catch (err) {
                console.error('Error fetching book details:', err)
                setError(err)
            }
        }

        fetchBook()
    }, [id])

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/books/${id}`) // Call the DELETE route
            alert('Book deleted successfully') // Notify the user
            navigate('/books') // Redirect to the books list page
        } catch (err) {
            console.error('Error deleting book:', err)
            alert('Failed to delete the book')
        }
    }

    if (error) {
        return <p>Error fetching book details: {error.message}</p>
    }

    if (!book) {
        return <p>Loading...</p>
    }

    const author = authors.find((author) => author._id === book.author?.id)
    const booksBySeries = books.filter((b) => b.series?.id === book.series?.id)

    return (
        <div className="book-details-container">
            <GoBackButton />
            <div className="book-details-content">
               <div>
                 {/* Book Cover */}
                 <img
                    className="book-cover"
                    src={book.coverImagePath}
                    alt={book.title}
                />
                    <div className="buttons-container">
                        <button className="edit-button" onClick={() => navigate(`/books/${book._id}/edit`)}>Edit</button>
                        <button className="delete-button" onClick={handleDelete}>Delete</button>
                    </div>
               </div>
                {/* Book Details */}
                <div className="book-details">
                    <div className="book-details-header">
                        <h1>{book.title}</h1>
                    </div>
                    {author && (
                        <p>
                            {/* Author:{' '} */}
                            <Link to={`/authors/${author._id}`}>
                                {author.firstName} {author.lastName}
                            </Link>
                        </p>
                    )}
                    {book.series && (
                        <p>
                            Series:{' '}
                            <Link to={`/series/${book.series.id}`}>
                                {book.series.title} (Book {book.series.volume})
                            </Link>
                        </p>
                    )}
                    <p>{book.description ? `Description: ${book.description}` : null}</p>
                    <p>{book.publishDate ? `Publish Date: ${new Date(book.publishDate).toLocaleDateString('en-US')}` : null}</p>
                    <p>{book.pageCount ? `Page Count: ${book.pageCount}` : null}</p>
                    <p>Format: <a href="/formats">{book.format}</a></p>
                    <p>Genre: <a href="/genres">{book.genres}</a></p>
                    <p>{book.publisher ? `Publisher: ${book.publisher}` : null}</p>
                    <p>{book.isbn ? `ISBN: ${book.isbn}` : null}</p>
                </div>
            </div>
            {/* Series Section */}
            {booksBySeries.length > 1 && book.series ? (
                <div>
                    <p><strong>{book.series.title} Series:</strong></p>
                    <BookCover books={booksBySeries} subtitle={(book) => `Book ${book.series.volume}`} />
                </div>
            ) : null}
            {/* Buttons */}
           
        </div>
    );
}