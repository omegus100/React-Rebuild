import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../../stylesheets/BookCover.module.css'

const BookCover = ({ books, subtitle }) => {

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
                            loading="lazy"
                        />
                        <div className={styles.bookTitle}>{book.title}</div>
                        <div className={styles.bookSubtitle}>
                            {typeof subtitle === 'function' ? subtitle(book) : subtitle}
                        </div>
                        </Link>
                    </div>
                ))}
            </div> 
        </>
    );
}

export default BookCover