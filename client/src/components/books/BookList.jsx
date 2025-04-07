import React from 'react';
import { Link } from 'react-router-dom';

export default function BookList({ books }) {
    return (
        <>
            <div>
            {books.map((book) => ( 
                <div key={book._id} style={{ marginBottom: '20px' }}>
                    <Link to={`/books/${book._id}`}>
                    <br />
                    <img
                        src={book.coverImagePath}
                        alt={book.title}
                        style={{ width: '100px', height: '150px', marginTop: '10px' }}
                    />
                    <span>{book.title}</span>
                    </Link>
                </div>
              ))}
            </div>    
        </>
    );
}