import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { GoBackButton, DeleteButton, EditButton } from '../Buttons'
import { GetDataById, GetData } from '../../hooks/getData'
import BookCover from './BookCover'
import styles from '../../stylesheets/BookDetails.css'
import { Loading } from '../Icons'

export default function BookDetails() {
    const { id } = useParams() // Get the book ID from the URL
    const navigate = useNavigate() // Use navigate to redirect after deletion

    const { data: book, error: bookError, isLoading } = GetData('books', id)
    const { data: authors, error: authorsError } = GetData('authors')
    const { data: books, error: bookserror } = GetData('books')

    const handleDelete = async () => {
        try {
            // await axios.delete(`/api/books/${id}`) // Call the DELETE route
            await GetDataById('books', id) // Call the DELETE route
            alert('Book deleted successfully') // Notify the user
            navigate('/books') // Redirect to the books list page
        } catch (err) {
            console.error('Error deleting book:', err)
            alert('Failed to delete the book')
        }
    }

    if (isLoading) {
        return <Loading />
    }

    if (bookError || authorsError || bookserror) {
        // Handle errors from GetData or book fetching
        return <p>Error fetching book details: {bookError.message}</p>
    }

    if (!book || !authors || !books) {
        // Check if book, authors, or books data is not available
        return <p>Loading...</p>
    }

    const author = authors.find((author) => author._id === book.author?.id)
    const booksBySeries = books.filter((b) => b.series?.id === book.series?.id)
    const booksByAuthor = books.filter((b) => b.author?.id === book.author?.id && b.series?.id !== book.series?.id)

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
                           {/* <span>by </span> */}
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
                    <p>{book.publishDate ? `Publish Date: ${new Date(book.publishDate).toLocaleDateString('en-US')}` : null}</p>
                    <p>{book.pageCount ? `Page Count: ${book.pageCount}` : null}</p>
                    <p>Format: <Link to={`/format/${book.format}`}>{book.format}</Link>  </p>
                    <p>Genre: <Link to={`/genres/${book.genres}`} >{book.genres}</Link>  </p>
                    <p>{book.publisher ? `Publisher: ${book.publisher}` : null}</p>
                    <p>{book.isbn ? `ISBN: ${book.isbn}` : null}</p>
                    <p>{book.description ? `Description: ${book.description}` : null}</p>
                </div>
            </div>
            {/* Series Section */}
            {booksBySeries.length > 1 && book.series ? (
                <div>
                    <p><strong>{book.series.title} Series:</strong></p>
                    <BookCover books={booksBySeries} subtitle={(book) => `Book ${book.series.volume}`} />
                </div>
            ) : null}
            <br /><br />
             {booksByAuthor.length > 0 && book.author ? (
                <div>
                    <p><strong>Other Books by {book.author.lastName}:</strong></p>
                    <BookCover books={booksByAuthor} />
                </div>
            ) : null}
            {/* Buttons */}
           
        </div>
    );
}