import React, { useState } from 'react'
import axios from 'axios'
import * as bookObjects from './bookObjects'
import GetAuthors from '../../hooks/GetAuthors'

export default function BookForm({ setBooks }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        publishDate: '',
        pageCount: '',
        format: '',
        genres: '',
        authorId: '',
        authorFirstName: '',
        authorLastName: ''
    });

    const { authors, error } = GetAuthors()

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const updateAuthorInfo = (authorId) => {
        const selectedAuthor = authors.find((author) => author._id === authorId);
        if (selectedAuthor) {
            setFormData((prevData) => ({
                ...prevData,
                authorFirstName: selectedAuthor.firstName,
                authorLastName: selectedAuthor.lastName
            }));
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (formData.authorId) {
            updateAuthorInfo(formData.authorId);
        }
        try {
            
            const response = await axios.post('/api/tests', formData)
            if (setBooks) {
                setBooks((prevBooks) => [...prevBooks, response.data]); // Update the books list if setBooks is provided
            }
            setFormData({ title: '', description: '', publishDate: '', pageCount: ''  }) // Clear the form fields
        } catch (error) {
            console.error('Error adding book:', error)
        }
    }

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
          <br />
            <label htmlFor="description">Description:</label>
            <input
                id="description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleInputChange}
            />
           <br />
            <label htmlFor="publishDate">Publish Date:</label>
            <input
                id="publishDate"
                name="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={handleInputChange}
            />
              <br />
            <label htmlFor='pageCount'>Page Count:</label>
            <input 
                type="number" 
                name="pageCount"  
                min="1" 
                value={formData.pageCount}
                onChange={handleInputChange}
                />
                <br />
            <label htmlFor="format">Format:</label>
            <select
                name="format"
                value={formData.format} 
                onChange={handleInputChange} 
            >
                <option value="0"></option> 
                {bookObjects.formats.map((format, index) => (
                    <option key={index + 1} value={format}>{format}</option> 
                ))}
            </select>
            <br />

            <label htmlFor="genres">Genre:</label>
            <select
                name="genres"
                value={formData.genres} 
                onChange={handleInputChange} 
            >
                <option value="0"></option> 
                {bookObjects.genres.map((genre, index) => (
                    <option key={index + 1} value={genre}>{genre}</option> 
                ))}
            </select>
            <br />
            <label htmlFor="authorId">Author:</label>
                <select
                    name="authorId"
                    value={formData.author}
                    onChange={(event) => {
                        handleInputChange(event)
                        updateAuthorInfo(event.target.value)
                    }}
                >
                    <option value="">Select Author</option>
                    {authors.map((author) => (
                        <option key={author._id} value={author._id}>
                            {author.firstName} {author.lastName}
                        </option>
                    ))}
                </select>
            <button type="submit">Add Book</button>  
        </form>
        </>
    );
}