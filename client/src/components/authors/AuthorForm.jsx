import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { GoBackButton, SubmitButton } from '../Buttons'
import { TextInput } from '../../components/FormOptions'

export default function AuthorForm({ setAuthors }) {
    const { id } = useParams()
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: ''
    })

    // Fetch existing data if editing
    useEffect(() => {             
        if (id) {          
            const fetchAuthor = async () => {                       
                try {                         
                    const response = await axios.get(`/api/authors/${id}`)
                    const author = response.data     
                    setFormData({          
                        firstName: author.firstName,
                        lastName: author.lastName                                   
                    })
                    } catch (err) {                          
                        console.error('Error fetching author:', err)                       
                    }                
                }      
                fetchAuthor()                  
            }        
        }, [id])

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
            if (id) {
                // Update existing author
               const response = await axios.put(`/api/authors/${id}`, formData)
               if (setAuthors) {
                    setAuthors((prevAuthors) =>
                        prevAuthors.map((author) => (author._id === id ? response.data : author))
                    )
                }
                alert('Author updated successfully')
            }
            else {
                // Create new author
                const response = await axios.post('/api/authors', formData)
                if (setAuthors) {
                    setAuthors((prevAuthors) => [...prevAuthors, response.data])
                }
                alert('Author added successfully')
            }
            navigate('/authors') // Redirect to the authors list page
        } catch (error) {
            console.error('Error adding author:', error)
        }
    }

    return (
        <>
        <GoBackButton />
        <h1>{id ? 'Edit Author' : 'New Author'}</h1>
        <form onSubmit={handleSubmit}>
            <TextInput
                label='First Name'
                name='firstName'
                type='text'
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder='Enter first name'
            />
            <TextInput
                label='Last Name'
                name='lastName'
                type='text'
                value={formData.lastName}   
                onChange={handleInputChange}
                placeholder='Enter last name'
            />
            <SubmitButton                  
                isEditing={!!id}
                object="Author"
            />
        </form>
        </>
    )
}