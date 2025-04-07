import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as bookObjects from './bookObjects'
import GetAuthors from '../../hooks/GetAuthors'
import GetSeries from '../../hooks/GetSeries'
import { useParams, useNavigate } from 'react-router-dom'
import { GoBackButton } from '../Buttons'
import  FileUpload  from '../FileUpload'

export default function BookForm({ setBooks }) {
    const { id } = useParams(); // Get the book ID from the URL (if editing)
    const navigate = useNavigate(); // To redirect after submission
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        publishDate: '',
        pageCount: '',
        format: '',
        genres: '',
        authorId: '',
        authorFirstName: '',
        authorLastName: '',
        seriesId: '',
        seriesTitle: '',
        seriesVolume: ''
    });

    const { authors, error } = GetAuthors()
    const { series } = GetSeries()

    // Fetch existing data if editing
    useEffect(() => {
        if (id) {
            const fetchBook = async () => {
                try {
                    const response = await axios.get(`/api/books/${id}`);
                    const book = response.data;
                    setFormData({
                        title: book.title,
                        description: book.description,
                        publishDate: book.publishDate,
                        pageCount: book.pageCount,
                        format: book.format,
                        genres: book.genres,
                        authorId: book.author.id,
                        authorFirstName: book.author.firstName,
                        authorLastName: book.author.lastName,
                        seriesId: book.series.id,
                        seriesTitle: book.series.title,
                        seriesVolume: book.series.volume
                    });
                } catch (err) {
                    console.error('Error fetching book:', err);
                }
            };

            fetchBook();
        }
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

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

    const updateSeriesInfo = (seriesId) => {
        const selectedSeries = series.find((series) => series._id === seriesId);
        if (selectedSeries) {
            setFormData((prevData) => ({
                ...prevData,
                seriesTitle: selectedSeries.title
            }));
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Create a copy of formData and remove empty fields
        const filteredFormData = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => value !== "")
        );

        try {
            if (id) {
                // Update existing book entry
                const response = await axios.put(`/api/books/${id}`, filteredFormData);
                if (setBooks) {
                    setBooks((prevBooks) =>
                        prevBooks.map((book) =>
                            book._id === id ? response.data : book
                        )
                    );
                }
                alert('Book updated successfully!');
            } else {
                // Create new book entry
                const response = await axios.post('/api/books', filteredFormData);
                if (setBooks) {
                    setBooks((prevBooks) => [...prevBooks, response.data]);
                }
                alert('Book created successfully!');
            }

            navigate('/books'); // Redirect to the books list page
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <>
            <GoBackButton />
            <h1>{id ? 'Edit Book' : 'New Book'}</h1>
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
                    type="textarea"
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
                <label htmlFor="pageCount">Page Count:</label>
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
                        <option key={index + 1} value={format}>
                            {format}
                        </option>
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
                        <option key={index + 1} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
                <br />
                <label htmlFor="authorId">Author:</label>
                <select
                    name="authorId"
                    value={formData.authorId}
                    onChange={(event) => {
                        handleInputChange(event);
                        updateAuthorInfo(event.target.value);
                    }}
                >
                    <option value="">Select Author</option>
                    {authors.map((author) => (
                        <option key={author._id} value={author._id}>
                            {author.firstName} {author.lastName}
                        </option>
                    ))}
                </select>
                <br />
                <label htmlFor="seriesId">Series:</label>
                <select
                    name="seriesId"
                    value={formData.seriesId}
                    onChange={(event) => {
                        handleInputChange(event);
                        updateSeriesInfo(event.target.value);
                    }}
                >
                    <option value="">Select Series</option>
                    {series.map((series) => (
                        <option key={series._id} value={series._id}>
                            {series.title} 
                        </option>
                    ))}
                </select>
                <br />
                <label htmlFor="seriesVolume">Series Volume:</label>
                <input
                    type="number"
                    name="seriesVolume"
                    min="1"
                    value={formData.seriesVolume}
                    onChange={handleInputChange}
                />
                <br />   
                {/* <FileUpload name="cover" onFileChange={handleInputChange}/> */}
                 <button type="submit">{id ? 'Update Book' : 'Add Book'}</button>
            </form>
           
            {error && <p>Error fetching authors: {error.message}</p>}
        </>
    );
}