import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function BookDetails() {
    const { id } = useParams(); // Get the test ID from the URL
    const [test, setTest] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await axios.get(`/api/tests/${id}`); // Fetch the test details by ID
                setTest(response.data);
            } catch (err) {
                console.error('Error fetching test details:', err);
                setError(err);
            }
        };

        fetchTest();
    }, [id]);

    if (error) {
        return `<p>Error fetching test details: {error.message}</p>`
    }

    if (!test) {
        return `<p>Loading...</p>`
    }

    return (
        <div>
            <h1>{test.title}</h1>
            <p>{test.description}</p>
            <p>Publish Date: {new Date(test.publishDate).toLocaleDateString('en-US')}</p>
        </div>
    )
}