import React, { useState } from 'react'
import axios from 'axios'


export default function AuthorForm({ setAuthors }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: ''
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
            const response = await axios.post('api/authors', formData)
            setFormData({firstName: '', lastName: ''})
        } catch (error) {
            console.error('Error adding author:', error)
        }
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
                <label htmlFor='firstName'>First Name</label>
                <input type='text' name='firstName' value={formData.firstName}  onChange={handleInputChange}></input>
                <br />
                <label htmlFor='lastName'>Last Name</label>
                <input type='text' name='lastName' value={formData.lastName}  onChange={handleInputChange}></input>
                <br />
                <button type="submit">Add Author</button>
            </form>
        </>
    )
}