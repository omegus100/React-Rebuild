import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import GetAuthors from '../../hooks/GetAuthors'
import { GoBackButton, SubmitButton } from '../Buttons'
import { TextInput, SelectInput } from '../../components/FormOptions'


export default function SeriesForm({ setSeries }) {
    const { id } = useParams()
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        authorId: '',
        authorFirstName: '',
        authorLastName: ''
    })

    const { authors, error } = GetAuthors()

    // Fetch existing data if editing
        useEffect(() => {
            if (id) {
                const fetchSeries = async () => {
                    try {
                        const response = await axios.get(`/api/series/${id}`)
                        const series = response.data;
                        setFormData({
                            title: series.title,
                            authorId: series.author.id,
                            // authorFirstName: series.author.firstName,
                            // authorLastName: series.author.lastName                    
                        })
                    } catch (err) {
                        console.error('Error fetching series:', err)
                    }
                };
    
                fetchSeries()
            }
        }, [id])

    const handleInputChange = (event) => {
        const { name, value } = event.target
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
        // Prevents form from submitting if no author is selected
        if (!formData.authorId) {
            alert('Please select an author before submitting the form.');
            return; // Stop form submission
        }

        if (formData.authorId) {
            updateAuthorInfo(formData.authorId);
        }

        try {
            if (id) {
                // Update existing series entry
                const response =  await axios.put(`/api/series/${id}`, formData)
                if (setSeries) {
                    setSeries((prevSeries) => 
                        prevSeries.map((series) => 
                            series._id === id ? response.data : series
                        )
                    );
                }
                alert('Series updated successfully!')
            } else {
                // Create new series entry
                const response = await axios.post('/api/series', formData)
                if (setSeries) {
                    setSeries((prevSeries) => [...prevSeries, response.data])
                }
                alert('Series created successfully!')
            }
            navigate('/series') // Redirect to the series list page
        } catch (error) {
            console.error('Error adding series:', error)
        }
    }

    return (
        <>
        <GoBackButton />
        <h1>{id ? 'Edit Series' : 'New Series'}</h1>
        <form onSubmit={handleSubmit}>
            <TextInput
                label="Title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter Series Title"
            />  
            <SelectInput
                label="Author"
                name="authorId"
                value={formData.authorId}
                options={authors}
                onChange={(event) => {
                    handleInputChange(event);
                    updateAuthorInfo(event.target.value);
                }}
            />
            <SubmitButton 
                isEditing={!!id}
                object="Series"            
            />
        </form>
        {error && <p>Error fetching authors: {error.message}</p>}
        </>
    )
}