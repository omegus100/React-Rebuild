import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../stylesheets/BookList.module.css'

export default function BookList({ books }) {
    return (
        <>
            <div className={styles.container}>
            {books.map((book) => ( 
                <div key={book._id} className={styles.book}>
                    <Link to={`/books/${book._id}`}>
                    <br />
                    <img
                        src={book.coverImagePath}
                        alt={book.title}
                        className={styles.coverImage}
                    />
                    <div>{book.title}</div>
                    <div>{book.author ? `${book.author.firstName} ${book.author.lastName}` : ''}</div>
                    </Link>
                </div>
              ))}
            </div>    
        </>
    );
}