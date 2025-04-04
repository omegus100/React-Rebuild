import { useState, useEffect } from 'react'
import axios from 'axios'

export default function GetBooks() {
    const [books, setBooks] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // Fetch books
                const booksResponse = await axios.get('/api/books')
                setBooks(booksResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err)
                setError(err)
            }
        };

        fetchBooks()
    }, []);

    return { books, setBooks, error }
}