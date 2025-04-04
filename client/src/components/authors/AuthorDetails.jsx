import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { GoBackButton } from '../Buttons'
import GetBooks from '../../hooks/GetBooks'
import BookList from '../books/BookList'

export default function AuthorDetails() {
    const { id } = useParams(); // Get the author ID from the URL
    const [author, setAuthor] = useState(null); // State to store author details
    const [error, setError] = useState(null); // State to handle errors
    const { books } = GetBooks(); // Get all books using the GetBooks hook

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const response = await axios.get(`/api/authors/${id}`); // Fetch author details
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

    return (
        <>
            <GoBackButton />
            <div>
                <h1>{author.firstName} {author.lastName}</h1>
                <p><strong>Books:</strong></p>
                <BookList books={booksByAuthor} /> 
            </div>
        </>
    );
}