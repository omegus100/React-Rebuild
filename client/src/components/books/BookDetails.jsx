import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoBackButton, DeleteButton } from '../Buttons'; // Import DeleteButton

export default function BookDetails() {
    const { id } = useParams(); // Get the test ID from the URL
    const navigate = useNavigate(); // Use navigate to redirect after deletion
    const [test, setTest] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await axios.get(`/api/tests/${id}`)
                setTest(response.data)
            } catch (err) {
                console.error('Error fetching test details:', err)
                setError(err);
            }
        };

        fetchTest();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/tests/${id}`); // Call the DELETE route
            alert('Book deleted successfully'); // Notify the user
            navigate('/books'); // Redirect to the books list page
        } catch (err) {
            console.error('Error deleting book:', err)
            alert('Failed to delete the book')
        }
    };

    if (error) {
        return <p>Error fetching test details: {error.message}</p>;
    }

    if (!test) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <GoBackButton />
            <div>
                <h1>{test.title}</h1>
                <p>{test.description}</p>
                <p>Publish Date: {new Date(test.publishDate).toLocaleDateString('en-US')}</p>
                <DeleteButton onClick={handleDelete} />
            </div>
        </>
    );
}