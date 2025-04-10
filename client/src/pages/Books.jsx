import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import GetBooks from '../hooks/GetBooks'
import { AddButton } from '../components/Buttons'
import styles from '../stylesheets/Index.module.css'
import { SearchInput } from '../components/FormOptions'
import SortOptions from '../components/SortOptions'
import BookCover from '../components/books/BookCover'

const Books = () => {
    const { books, error } = GetBooks()
    const [searchQuery, setSearchQuery] = useState('') // State for search query
    const [sortBy, setSortBy] = useState('title')

    // Helper function to normalize titles (e.g., remove "The" for sorting)
    const normalizeTitle = (title) => title.replace(/^The\s+/i, '').toLowerCase()

    // Filter books based on the search query
    const filteredBooks = books?.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.series?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) 
    )

    // Sort books based on the selected criterion
    const sortedBooks = filteredBooks?.sort((a, b) => {
        if (sortBy === 'title') {
            return normalizeTitle(a.title).localeCompare(normalizeTitle(b.title));
        } else if (sortBy === 'author') {
            const authorA = `${a.author?.firstName || ''} ${a.author?.lastName || ''}`.toLowerCase();
            const authorB = `${b.author?.firstName || ''} ${b.author?.lastName || ''}`.toLowerCase();
            return authorA.localeCompare(authorB);
        } else if (sortBy === 'series') {
            const seriesA = a.series?.title?.toLowerCase() || '';
            const seriesB = b.series?.title?.toLowerCase() || '';
            return seriesA.localeCompare(seriesB);
        } else if (sortBy === 'pageCount') {
            const pageCountA = a.pageCount || 0 ;
            const pageCountB = b.pageCount || 0 ;
            return pageCountA - pageCountB;
        }
        return 0;
    });

    if (error) {
        return <p>Error fetching books: {error.message}</p>
    }

    return (
        <>
            <div className={styles.indexHeader}>
                <h1>Books</h1>
                <Link to="/books/new">
                    <AddButton />
                </Link>
            </div>    
            <div className={styles.filterContainer}>
                <SearchInput      
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Search books, authors, or series..."
                    className={styles.searchInput}  
                />   
                <SortOptions sortBy={sortBy} setSortBy={setSortBy} className={styles.sortContainer}/> 
            </div>
            <BookCover 
                books={sortedBooks} 
                subtitle={(book) => {
                    if (sortBy === 'title' || sortBy === 'author') {
                        return `${book.author?.firstName || ''} ${book.author?.lastName || ''}`
                    }
                    else if (sortBy === 'series') {
                        return book.series?.title || 'No Series';
                    }  
                    else if (sortBy === 'pageCount') {
                        return book.pageCount
                    } 
                    else {
                        return `${book.author?.firstName || ''} ${book.author?.lastName || ''}`
                    }
                }}
            />
        </>
    )
}

export default Books