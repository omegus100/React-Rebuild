import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import GetAuthors from '../hooks/GetAuthors' 
import AuthorList from '../components/authors/AuthorList'
import { AddButton } from '../components/Buttons'
import styles from '../stylesheets/Index.module.css'
import { SearchInput } from '../components/FormOptions'

const Authors = () => {
    const { authors, error } = GetAuthors()
    const [searchQuery, setSearchQuery] = useState('')

     // Filter authors based on the search query
     const filteredAuthors = authors?.filter((author) =>
        author.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
            <div className={styles.searchContainer}>
                <SearchInput
                    type="text"
                    placeholder="Search authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className={styles.searchInput}
                />  
            </div>
             <AuthorList authors={filteredAuthors} />  
        </>
    )
}

export default Authors
