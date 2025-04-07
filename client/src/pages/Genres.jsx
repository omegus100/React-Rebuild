import React from 'react'
import GetBooks from "../hooks/GetBooks"

export default function Genres() {
    const { books, error } = GetBooks() // Fetch genres using the custom hook

    if (error) {
        return <p>Error fetching genres: {error.message}</p> // Handle error state
    }

    // Extract genres, flatten arrays, remove duplicates and blanks, and sort alphabetically
    const genres = Array.from(
        new Set(
            books
                .flatMap((book) => book.genres) // Flatten arrays of genres
                .filter((genre) => typeof genre === "string" && genre.trim() !== "") // Remove blanks and ensure strings
        )
    ).sort();

    return (
        <>
            <h1>Genres</h1>
            <div>     
                {genres.map((genre, index) => (
                    <div key={index}>{genre}
                        <ul>
                            {books
                                .filter((book) => book.genres.includes(genre)) // Filter books by genre
                                .map((book) => (
                                    <li key={book._id}>
                                        <a href={`/books/${book._id}`}>{book.title}</a> {/* Link to book details */}
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    )
}