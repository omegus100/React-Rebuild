import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { GoBackButton, DeleteButton, EditButton } from '../Buttons'
import { GetDataById, GetData } from '../../hooks/getData'
import BookCover from '../books/BookCover'

export default function SeriesDetails() {
    const { id } = useParams() // Get the series ID from the URL
    const navigate = useNavigate()

    const { data: series, error: seriesError } = GetData('series', id);
    const { data: books, error: booksError } = GetData('books')
    const { data: authors, error: authorsError } = GetData('authors')

    // Handle errors from GetData or series fetching
    if (seriesError || booksError || authorsError) {
        return <p>Error fetching data: {seriesError?.message || booksError?.message || authorsError?.message}</p>
    }

    if (!series || !books || !authors) {
        return <p>Loading series details...</p>
    }

    // Filter books by series and find the author
    const booksbySeries = books.filter((book) => book.series?.id === series._id)
    const author = authors.find((author) => author._id === series.author?.id)

    const handleDelete = async () => {
        try {
            if (booksbySeries.length > 0) {
                alert('This series has book(s) assigned to it. Please delete the book(s) first.')
                return
            } else {
                await GetDataById('series', id) // Call the DELETE route
                alert('Series deleted successfully') // Notify the user
                navigate('/series') // Redirect to the series list page
            }
        } catch (err) {
            console.error('Error deleting series:', err)
            alert('Failed to delete the series')
        }
    }

    return (
        <>
            <GoBackButton />
            <div>
                <h1>{series.title}</h1>
                <p>
                    {author ? (
                        <Link to={`/authors/${author._id}`}>
                            {author.firstName} {author.lastName}
                        </Link>
                    ) : (
                        'Unknown Author'
                    )}
                </p>
                <p>
                    <strong>Books in this Series:</strong>
                </p>
                <BookCover
                    books={booksbySeries}
                    subtitle={(book) => `Book ${book.series.volume}`}
                />
            </div>
            <EditButton onClick={() => navigate(`/series/${series._id}/edit`)} />
            <DeleteButton onClick={handleDelete} />
        </>
    )
}