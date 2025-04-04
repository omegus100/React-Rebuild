import React from 'react'
import { Link } from 'react-router-dom'
import GetAuthors from '../hooks/GetAuthors' 
import AuthorList from '../components/authors/AuthorList'
import { AddButton } from '../components/Buttons'

const Authors = () => {
    const { authors, error } = GetAuthors()

    if (error) {
        return <p>Error fetching authors: {error.message}</p>
    }

    return (
        <>
            <h1>Authors</h1>
            <Link to="/authors/new">
                <AddButton />               
            </Link>      
             <AuthorList authors={authors} />  
        </>
    )
}

export default Authors
