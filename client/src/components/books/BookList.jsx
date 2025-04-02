import React from 'react'
import { Link } from 'react-router-dom'

export default function BookList({ books }) {
    return (
        <>
            <ul>
                {books.map((book) => (
                    <li key={book._id}>
                        <Link to={`/books/${book._id}`}>{book.title} - {book.description}</Link>
                    </li>
                ))}
            </ul>
            
        </>
    );
}