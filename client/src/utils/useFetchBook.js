import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useFetchBook(id) {
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchBook = async () => {
                try {
                    const response = await axios.get(`/api/books/${id}`);
                    setBook(response.data);
                } catch (err) {
                    console.error('Error fetching book:', err);
                    setError(err);
                }
            };
            fetchBook();
        }
    }, [id]);

    return { book, error };
}