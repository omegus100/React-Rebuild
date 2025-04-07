import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { GoBackButton, DeleteButton, EditButton } from '../Buttons'
import GetBooks from '../../hooks/GetBooks'
import GetAuthors from '../../hooks/GetAuthors'
import BookList from '../books/BookList'

export default function SeriesDetails() {
    const { id } = useParams(); // Get the series ID from the URL
    const navigate = useNavigate()
    const [series, setSeries] = useState(null); // State to store series details
    const [error, setError] = useState(null); // State to handle errors
    const { books } = GetBooks();
    const { authors } = GetAuthors()

    useEffect(() => {
            const fetchSeries = async () => {
                try {
                    const response = await axios.get(`/api/series/${id}`); // Fetch series details
                    setSeries(response.data)
                } catch (err) {
                    console.error('Error fetching series details:', err)
                    setError(err)
                }
            };
    
            fetchSeries()
        }, [id])

        
    if (error) {
        return <p>Error fetching series details: {error.message}</p>
    }
    
    if (!series) {
         return <p>Loading series details...</p>
    }

    const booksbySeries = books.filter((book) => book.series?.id === series._id)
    const author = authors.find((author) => author._id === series.author?.id)

    const handleDelete = async () => {
        try {
            if (booksbySeries.length > 0) {
                alert('This series has book(s) assigned to it. Please delete the book(s) first.')
                return
            } else {
                await axios.delete(`/api/series/${id}`) // Call the DELETE route
                alert('Series deleted successfully') // Notify the user
                navigate('/series') // Redirect to the series list page
            }      
        } catch (err) {
            console.error('Error deleting series:', err)
            alert('Failed to delete the series')
        }
    }

    return (
        <>
        <GoBackButton />
        <div>            
            <h1>{series.title}</h1>
            <p>              
                Author:{' '}
                {author ? (
                    <Link to={`/authors/${author._id}`}>
                                        
                        {author.firstName} {author.lastName}
                    </Link>
                ) : (
                    'Unknown Author'
                )}
            </p>
            <p><strong>Books in this Series:</strong></p>
            <BookList books={booksbySeries } /> 
        </div>
        <EditButton onClick={() => navigate(`/series/${series._id}/edit`)} />         
        <DeleteButton onClick={handleDelete} />
        </>
    );
}