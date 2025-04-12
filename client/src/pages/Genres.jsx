import React from 'react'
import GetBooks from "../hooks/GetBooks"
import {GridLayout} from '../components/PageLayouts'

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
                {genres.map((genre, index) => {
                    const bookCount = books.filter((book) => book.genres.includes(genre)).length; // Count books for each genre
    
                    return (
                        <GridLayout 
                            key={index}  
                            books={books} 
                            value={genre} 
                            property="genres"
                            count={bookCount} // Pass the book count to the GridLayout component
                            />
                    )
                })}             
            </div>       
        </>
    )
}