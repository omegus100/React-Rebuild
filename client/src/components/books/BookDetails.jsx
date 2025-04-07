import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { GoBackButton, DeleteButton, EditButton } from '../Buttons'
import GetAuthors from '../../hooks/GetAuthors'

export default function BookDetails() {
    const { id } = useParams(); // Get the book ID from the URL
    const navigate = useNavigate(); // Use navigate to redirect after deletion
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const { authors } = GetAuthors(); 

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`/api/books/${id}`);
                setBook(response.data);
            } catch (err) {
                console.error('Error fetching book details:', err);
                setError(err);
            }
        };

        fetchBook();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/books/${id}`); // Call the DELETE route
            alert('Book deleted successfully'); // Notify the user
            navigate('/books'); // Redirect to the books list page
        } catch (err) {
            console.error('Error deleting book:', err);
            alert('Failed to delete the book');
        }
    };

    if (error) {
        return <p>Error fetching book details: {error.message}</p>;
    }

    if (!book) {
        return <p>Loading...</p>;
    }

    const author = authors.find((author) => author._id === book.author?.id)

    return (
        <>
            <GoBackButton />
            <div>
                <h1>{book.title}</h1>
                <p>{book.description}</p>
                <p>Publish Date: {new Date(book.publishDate).toLocaleDateString('en-US')}</p>
                <p>Page Count: {book.pageCount}</p>
                <p>Format: {book.format}</p>
                <p>Genre: <a href='/genres'>{book.genres}</a></p>
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
                <p>
                    Series:{' '}
                    {book.series ? (
                        <Link to={`/series/${book.series.id}`}>
                            {book.series.title} (Volume {book.series.volume})
                        </Link>
                    ) : (
                        'No Series'
                    )}
                </p>
                <EditButton onClick={() => navigate(`/books/${book._id}/edit`)} />
                <DeleteButton onClick={handleDelete} />
            </div>
        </>
    );
}