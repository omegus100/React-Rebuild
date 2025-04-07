import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GetBooks from '../hooks/GetBooks';
import BookList from '../components/books/BookList';
import { AddButton } from '../components/Buttons';
import styles from '../stylesheets/Index.module.css';

const Books = () => {
    const { books, error } = GetBooks();
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    // Filter books based on the search query
    const filteredBooks = books?.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.series?.title?.toLowerCase().includes(searchQuery.toLowerCase())
        // book.author?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) 
    )

    // const filteredBooks = books?.filter((book) => {
    //     const titleMatch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    //     const authorFirstNameMatch = book.author?.firstName?.toLowerCase().includes(searchQuery.toLowerCase());
    //     const authorLastNameMatch = book.author?.lastName?.toLowerCase().includes(searchQuery.toLowerCase());
    //     const seriesTitleMatch = book.series?.title?.toLowerCase().includes(searchQuery.toLowerCase());

    //     return titleMatch || authorFirstNameMatch || authorLastNameMatch || seriesTitleMatch;
    // });

    if (error) {
        return <p>Error fetching books: {error.message}</p>;
    }

    return (
        <>
            <div className={styles.indexHeader}>
                <h1>Books</h1>
                <Link to="/books/new">
                    <AddButton />
                </Link>
            </div>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search books, authors, or series..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                    className={styles.searchInput}
                />
            </div>
            <BookList books={filteredBooks} /> {/* Pass filtered books */}
        </>
    );
};

export default Books;