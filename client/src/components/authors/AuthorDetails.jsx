import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { GoBackButton, DeleteButton, EditButton } from '../Buttons'
import GetBooks from '../../hooks/GetBooks'
import BookList from '../books/BookList'

export default function AuthorDetails() {
    const { id } = useParams() // Get the author ID from the URL
    const navigate = useNavigate()
    const [author, setAuthor] = useState(null) // State to store author details
    const [error, setError] = useState(null) // State to handle errors
    const { books } = GetBooks()

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const response = await axios.get(`/api/authors/${id}`)
                setAuthor(response.data)
            } catch (err) {
                console.error('Error fetching author details:', err)
                setError(err)
            }
        };

        fetchAuthor()
    }, [id])

    if (error) {
        return <p>Error fetching author details: {error.message}</p>
    }

    if (!author) {
        return <p>Loading author details...</p>
    }

    const booksByAuthor = books.filter((book) => book.author.id === author._id)

    const handleDelete = async () => {          
        try {     
            if (booksByAuthor.length > 0) {
                // Check if the author has books assigned to them
                alert('This author has book(s) assigned to it. Please delete the book(s) first.')
                return
            } else {
                await axios.delete(`/api/authors/${id}`) 
                alert('Author deleted successfully') 
                navigate('/authors') 
            }      
        } catch (err) {
            console.error('Error deleting author:', err)
            alert('Failed to delete the author')
        }
    }

    return (
        <>
            <GoBackButton />
            <div>
                <h1>{author.firstName} {author.lastName}</h1>
                <p><strong>Books:</strong></p>
                <BookList books={booksByAuthor} /> 
            </div>
            <EditButton onClick={() => navigate(`/authors/${author._id}/edit`)} />         
            <DeleteButton onClick={handleDelete} />
        </>
    );
}