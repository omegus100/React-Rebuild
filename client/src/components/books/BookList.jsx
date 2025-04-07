import React from 'react';
import { Link } from 'react-router-dom';

export default function BookList({ books }) {
    return (
        <>
            <span>
            {books.map((book) => ( 
                <span key={book._id} >
                    <Link to={`/books/${book._id}`}>
                    <br />
                    <img
                        src={book.coverImagePath}
                        alt={book.title}
                        style={{ width: '100px', height: '150px', marginTop: '10px' }}
                    />
                    <span>{book.title}</span>
                    </Link>
                </span>
              ))}
            </span>    
        </>
    );
}