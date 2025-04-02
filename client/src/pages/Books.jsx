import React from 'react'
import { Link } from 'react-router-dom'
import GetBooks from '../hooks/GetBooks' 
import BookList from '../components/books/BookList'
import { AddButton } from '../components/Buttons'

const Books = () => {
    const { books, error } = GetBooks()

    if (error) {
        return <p>Error fetching books: {error.message}</p>
    }

    return (
        <>
            <h1>Books</h1>
            <Link to="/books/new">
               <AddButton />
            </Link>
            <BookList books={books} /> 
        </>
    );
};

export default Books