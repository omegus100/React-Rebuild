import React from 'react'
import { GetData } from '../hooks/getData'
import { GridLayout } from '../components/PageLayouts'
import { Link } from 'react-router-dom'
import { Loading } from '../components/Icons'

export default function Genres() {
    const { data: books, error, isLoading } = GetData('books') // Fetch genres using the custom hook
    const listLimit = 7

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return <p>Error fetching genres: {error.message}</p> // Handle error state
    }

    // Extract genres, flatten arrays, remove duplicates and blanks, and sort alphabetically
    const genres = Array.from(
        new Set(
            books
                .flatMap((book) => book.genres) // Flatten arrays of genres
                .filter((genre) => typeof genre === 'string' && genre.trim() !== '') // Remove blanks and ensure strings
        )
    ).sort()

    return (
        <>
            <h1>Genres</h1>
            <div>
                {genres.map((genre, index) => {
                    const booksInGenre = books.filter((book) => book.genres.includes(genre)) // Filter books for the genre
                    const bookCount = booksInGenre.length // Count books for each genre
                    const limitedBooks = booksInGenre.slice(0, listLimit) // Limit books to listLimit
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
            </div>
        </>
    )
}