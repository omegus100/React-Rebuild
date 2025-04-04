import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import GetAuthors from '../../hooks/GetAuthors'
import { useNavigate } from 'react-router-dom';
import { GoBackButton } from '../Buttons';

export default function SeriesForm({ setSeries }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        authorId: '', // Store the selected author's ID
        authorFirstName: '', // Store the selected author's first name
        authorLastName: '', // Store the selected author's last name
    });
    
    const { authors, error } = GetAuthors();
    
     
    // Fetch series when the component mounts
    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const response = await axios.get('/api/series'); // Fetch authors from the backend
                setSeries(response.data);
            } catch (err) {
                console.error('Error fetching series:', err);
            }
        };

        fetchSeries();
    }, []);

    // Update author information in formData when an author is selected
    const updateAuthorInfo = (authorId) => {
        const selectedAuthor = authors.find((author) => author._id === authorId);
        if (selectedAuthor) {
            setFormData((prevData) => ({
                ...prevData,
                authorFirstName: selectedAuthor.firstName,
                authorLastName: selectedAuthor.lastName,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            // Send a POST request to add a new series
            await axios.post('/api/series', formData);
            alert('Series added successfully!');
            navigate('/series'); // Redirect to the series list page
        } catch (err) {
            console.error('Error adding series:', err);
        }
    };

    return (
        <>
            <GoBackButton />
            <h1>Series Form</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
                <br />
                <label htmlFor="author">Author</label>
                <select
                    name="authorId"
                    value={formData.authorId}
                    onChange={(e) => {
                        const authorId = e.target.value;
                        setFormData({ ...formData, authorId });
                        updateAuthorInfo(authorId); // Update author details when selected
                    }}
                    required
                >
                    <option value="">Select an author</option>
                    {authors.map((author) => (
                        <option key={author._id} value={author._id}>
                            {author.firstName} {author.lastName}
                        </option>
                    ))}
                </select>
                <br />
                <button type="submit">Add Series</button>
            </form>
        </>
    );
}