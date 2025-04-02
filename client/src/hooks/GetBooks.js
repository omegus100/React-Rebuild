import { useState, useEffect } from 'react'
import axios from 'axios'

export default function GetBooks() {
    const [books, setBooks] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('/api/tests')
                setBooks(response.data)
            } catch (err) {
                console.error('Error fetching books:', err)
                setError(err)
            }
        }

        fetchBooks()
    }, [])

    return { books, setBooks, error }
}