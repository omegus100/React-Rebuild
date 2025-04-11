import React from 'react'
import { Link } from 'react-router-dom'
import { AddButton } from './Buttons'
import styles from '../stylesheets/BookCover.module.css'
import BookCover from './books/BookCover'

const GridLayout = ({ books, value, property, count }) => {
    // Filter books by the given property and value
    const filteredBooks = books.filter((book) => book[property]?.includes(value));

    return (
        <>
            <h2>{value} ({count} Books)</h2> {/* Display the property value (e.g., genre or format) */}
            <BookCover 
                books={filteredBooks} 
                subtitle={(book) => `${book.author.firstName} ${book.author.lastName}`} /> 
        </>
    );
}

  

export default GridLayout