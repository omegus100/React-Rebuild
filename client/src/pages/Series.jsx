import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import GetSeries from '../hooks/GetSeries' 
import SeriesList from '../components/series/SeriesList'
import { AddButton } from '../components/Buttons'
import styles from '../stylesheets/Index.module.css'

const Series = () => {
    const { series, error } = GetSeries()
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    
    // Filter series based on the search query
    const filteredSeries = series?.filter((series) =>
        series.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search series..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                    className={styles.searchInput}
                />
            </div>         
             <SeriesList series={filteredSeries} />  
        </>
    )
}

export default Series

