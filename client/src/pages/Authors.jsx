import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import GetAuthors from '../hooks/GetAuthors' 
import AuthorList from '../components/authors/AuthorList'
import { AddButton } from '../components/Buttons'
import styles from '../stylesheets/Index.module.css'
import { SearchInput } from '../components/FormOptions'
import SortOptions from '../components/SortOptions'

const Authors = () => {
    const { authors, error } = GetAuthors()
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('firstName')

     // Filter authors based on the search query
     const filteredAuthors = authors?.filter((author) =>
        author.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Sort authors by last name, then first name
    const sortedAuthors = filteredAuthors?.sort((a, b) => {
        const lastNameA = a.lastName.toLowerCase()
        const lastNameB = b.lastName.toLowerCase()
        if (sortBy === 'firstName') {
            return lastNameB.localeCompare(lastNameA)
        }
        if (sortBy === 'lastName') {
            return lastNameA.localeCompare(lastNameB)
        }
        return 0;
    })

    if (error) {
        return <p>Error fetching authors: {error.message}</p>
    }

    return (
        <>
            <div className={styles.indexHeader}>
                <h1>Authors</h1>
                <Link to="/authors/new">
                    <AddButton />               
                </Link>  
            </div>    
            <div className={styles.filterContainer}>
                <SearchInput
                    type="text"
                    placeholder="Search authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className={styles.searchInput}
                />  
                <SortOptions sortBy={sortBy} setSortBy={setSortBy} object="author" className={styles.sortContainer}/> 
            </div>
             <AuthorList authors={sortedAuthors} />  
        </>
    )
}

export default Authors
