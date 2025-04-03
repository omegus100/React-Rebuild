import { useState, useEffect } from 'react'
import axios from 'axios'

export default function GetAuthors() {
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