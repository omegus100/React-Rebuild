import { useState, useEffect } from 'react'
import axios from 'axios'

export function GetAuthors() {
    const [authors, setAuthors] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                // Fetch authors
                const authorsResponse = await axios.get('/api/authors')
                setAuthors(authorsResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err)
                setError(err)
            }
        };

        fetchAuthors()
    }, []);

    return { authors, setAuthors, error }
}

export const GetAuthorById = async (id) => {
    try {
        const response = await axios.get(`/api/authors/${id}`);
        return response.data; // Return the author data
    } catch (error) {
        console.error('Error fetching author:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
}