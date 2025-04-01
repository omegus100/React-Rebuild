// Example React component to fetch books
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewBookForm from './BookForm';

const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState(''); // State to manage the input value

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('/api/tests');
                console.log('Fetched books data:', response.data);
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);

    async function getFormData(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        console.log('Input value:', title); // Log the input value

        try {
            const response = await axios.post('/api/tests', { title }); // Post data to the backend
            console.log('Test added:', response.data);

            // Update the books list with the newly added book
            setBooks((prevBooks) => [...prevBooks, response.data]);
            setTitle(''); // Clear the input field
        } catch (error) {
            console.error('Error adding test:', error);
        }
    }

    return (
        <>
            <h1>Books</h1>
            <NewBookForm />
            <form onSubmit={getFormData}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    value={title} // Bind the input value to the state
                    onChange={(event) => setTitle(event.target.value)} // Update state on input change
                />
                <button type="submit">Add</button>
            </form>
            <ul>
                {books.map((book) => (
                    <li key={book._id}>{book.title}</li>
                ))}
            </ul>
        </>
    );
};

export default BooksList;