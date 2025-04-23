import React from 'react'
import { GetData } from '../hooks/getData'
import { GridLayout } from '../components/PageLayouts'
import { Link } from 'react-router-dom'
import { Loading } from '../components/Icons'

export default function Formats() {
    const { data: books, error, isLoading } = GetData('books') // Fetch formats using the custom hook
    const listLimit = 4

    if (isLoading) {
        return <Loading /> // Show loading state while fetching data
    }

    if (error) {
        return <p>Error fetching formats: {error.message}</p> // Handle error state
    }

    // Extract formats, flatten arrays, remove duplicates and blanks, and sort alphabetically
    const formats = Array.from(
        new Set(
            books
                .flatMap((book) => book.format) // Flatten arrays of formats
                .filter((format) => typeof format === 'string' && format.trim() !== '') // Remove blanks and ensure strings
        )
    ).sort()

    return (
        <>
            <h1>Formats</h1>
            <div>
                {formats.map((format, index) => {
                    const booksInFormat = books.filter((book) => book.format.includes(format)) // Filter books for the format
                    const bookCount = booksInFormat.length // Count books for each format
                    const limitedBooks = booksInFormat.slice(0, listLimit) // Limit books to listLimit
                    const formatName = format.toLowerCase()

                    return (
                        <div key={index}>
                            
                            <GridLayout
                                books={limitedBooks} // Pass only the limited books
                                value={format}
                                property="format"
                                count={bookCount} // Pass the book count to the GridLayout component
                                object="Formats"
                                link={`/format/${formatName}`}
                                limit={limitedBooks.length} // Pass the limit to the GridLayout component
                            />
                            
                        </div>
                    )
                })}
            </div>
        </>
    )
}