// Example React component to fetch books
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewBookForm from './BookForm';
import GetBooks from "./components/books/BookList";

const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: ''
    }); // State to manage multiple inputs

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('/api/tests');
                console.log(response)
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        })); // Update the specific field in the formData state
    };

    async function getFormData(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        console.log('Form data:', formData); // Log the form data

        try {
            const response = await axios.post('/api/tests', formData); // Post all form data to the backend
            console.log('Test added:', response.data);

            // Update the books list with the newly added book
            setBooks((prevBooks) => [...prevBooks, response.data]);
            setFormData({ title: '', description: '', date: '' }); // Clear the form fields
        } catch (error) {
            console.error('Error adding test:', error);
        }
    }

    return (
        <>
            <h1>Books</h1>
            <NewBookForm />
            <GetBooks />
            <form onSubmit={getFormData}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    name="title" // Add a name attribute to identify the field
                    value={formData.title} // Bind the input value to the state
                    onChange={handleInputChange} // Update state on input change
                />
                <label htmlFor="description">Description</label>
                <input
                    id="description"
                    name="description" // Add a name attribute to identify the field
                    value={formData.description} // Bind the input value to the state
                    onChange={handleInputChange} // Update state on input change
                />
                {/* <label htmlFor="date">Date</label>
                <input
                    id="date"
                    name="publishDate" // Add a name attribute to identify the field
                    type="date" // Use the date input type
                    value={formData.date} // Bind the input value to the state
                    onChange={handleInputChange} // Update state on input change
                /> */}
                <button type="submit">Add</button>
            </form>
            <ul>
                {books.map((book) => (
                    <li key={book._id}>
                        {book.title} - {book.description} - {book.date}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default BooksList;