import React, { useState } from 'react'
import axios from 'axios'

export default function BookForm({ setBooks }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        publishDate: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.post('/api/tests', formData)
            if (setBooks) {
                setBooks((prevBooks) => [...prevBooks, response.data]); // Update the books list if setBooks is provided
            }
            setFormData({ title: '', description: '', publishDate: '' }) // Clear the form fields
        } catch (error) {
            console.error('Error adding book:', error)
        }
    };

    return (
        <>
        <h1>New Book</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title:</label>
            <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
            />
        
            <label htmlFor="description">Description:</label>
            <input
                id="description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleInputChange}
            />
         
            <label htmlFor="publishDate">Publish Date:</label>
            <input
                id="publishDate"
                name="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={handleInputChange}
            />
     
            <button type="submit">Add Book</button>
        </form>
        </>
    );
}