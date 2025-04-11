import React from 'react'
import GetBooks from "../hooks/GetBooks"
import GridLayout from '../components/PageLayouts'

export default function Formats() {
    const { books, error } = GetBooks() // Fetch format using the custom hook

    if (error) {
        return <p>Error fetching format: {error.message}</p> // Handle error state
    }

    // Extract format, flatten arrays, remove duplicates and blanks, and sort alphabetically
    const format = Array.from(
        new Set(
            books
                .flatMap((book) => book.format) // Flatten arrays of format
                .filter((format) => typeof format === "string" && format.trim() !== "") // Remove blanks and ensure strings
        )
    ).sort();

    return (
        <>
            <h1>Formats</h1>
            <div> 
                {format.map((format, index) => {
                  const bookCount = books.filter((book) => book.format == format).length;

                  return (
                    <GridLayout 
                        key={index}  
                        books={books} 
                        value={format} 
                        property="format"
                        count={bookCount} // Pass the book count to the GridLayout component
                        />
                  )
                })}             
            </div>       
        </>
    )
}