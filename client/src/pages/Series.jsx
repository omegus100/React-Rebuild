import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import GetSeries from '../hooks/GetSeries' 
import GetBooks from '../hooks/GetBooks'
import { AddButton } from '../components/Buttons'
import styles from '../stylesheets/Index.module.css'
import { SearchInput } from '../components/FormOptions'
import SortOptions from '../components/SortOptions'
import {TableLayout} from '../components/PageLayouts'

const Series = () => {
    const { series, error } = GetSeries()
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [sortBy, setSortBy] = useState('title')
    const { books } = GetBooks()

    // Helper function to normalize titles (e.g., remove "The" for sorting)
    const normalizeTitle = (title) => title.replace(/^The\s+/i, '').toLowerCase()   

    // Add a count of books in the series to each series object
    const booksBySeries = series?.map((series) => {
        const bookCount = books?.filter((book) => book.series?.id === series._id).length || 0;
        return { ...series, bookCount };
    })
  
    // Filter series based on the search query
    const filteredSeries = booksBySeries?.filter((series) =>
        series.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const sortedSeries = filteredSeries?.sort((a, b) => {
        if (sortBy === 'title') {
            return normalizeTitle(a.title).localeCompare(normalizeTitle(b.title));
        } else if (sortBy === 'author') {
            const authorA = `${a.author?.firstName || ''} ${a.author?.lastName || ''}`.toLowerCase();
            const authorB = `${b.author?.firstName || ''} ${b.author?.lastName || ''}`.toLowerCase();
            return authorA.localeCompare(authorB);
        } else if (sortBy === 'seriesLength') {
            const seriesLengthA = a.bookCount || 0 ;
            const seriesLengthB = b.bookCount || 0 ;
            return seriesLengthB - seriesLengthA
        } 
        return 0;
    })

    if (error) {
        return <p>Error fetching series: {error.message}</p>
    }

    return (
        <>
            <div className={styles.indexHeader}>
                <h1>Series</h1>
                <Link to="/series/new">
                    <AddButton />               
                </Link>   
            </div>    
            <div className={styles.filterContainer}>
                <SearchInput
                    type="text"
                    placeholder="Search series..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className={styles.searchInput}
                />
                 <SortOptions sortBy={sortBy} setSortBy={setSortBy} object="series" className={styles.sortContainer}/> 
            </div>          
            <TableLayout series={sortedSeries} />
        </>
    )
}

export default Series

