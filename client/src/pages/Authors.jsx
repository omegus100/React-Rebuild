import React from 'react'
import GetAuthors from '../hooks/GetAuthors' 
import AuthorList from '../components/authors/AuthorList'
import AuthorForm from '../components/authors/AuthorForm'

const Authors = () => {
    const { authors, error } = GetAuthors()

    if (error) {
        return <p>Error fetching authors: {error.message}</p>
    }

    return (
        <>
            <h1>Authors</h1>
            <AuthorForm />        
             <AuthorList authors={authors} />  
        </>
    )
}

export default Authors
