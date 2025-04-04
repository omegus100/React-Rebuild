import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { GoBackButton } from '../Buttons'

export default function SeriesForm({ setSeries }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        authorId: '',
        authorFirstName: '',
        authorLastName: ''
    })

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.post('/api/series', formData)
            setFormData({title: '', authorId: '', authorFirstName: '', authorLastName: ''})
            alert('Series created successfully!')
            navigate('/series'); // Redirect to the series list page
        } catch (error) {
            console.error('Error adding series:', error)
        }
    }

    return (
        <>
        <GoBackButton />
        <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input type="text" name="title" value={formData.title}  onChange={handleInputChange}></input>
                <br />
                <label htmlFor="authorId">Author</label>
                <input type="text" name="authorId" value={formData.authorId}  onChange={handleInputChange}></input>
                <br />
                <button type="submit">Add Series</button>
            </form>
        </>
    )
}