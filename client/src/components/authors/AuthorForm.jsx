import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GoBackButton, SubmitButton } from '../Buttons'
import { TextInput } from '../../components/FormOptions'
import { handleFormSubmit } from '../../hooks/handleFormSubmit'
import { GetData } from '../../hooks/getData'

export default function AuthorForm({ setAuthors }) {
    const { id } = useParams()
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: ''
    })

    // Use the custom hook to fetch author data
    const { data: author, error } = GetData('authors', id);

    // Populate form data when author data is fetched
    React.useEffect(() => {
        if (author) {
            setFormData({
                firstName: author.firstName,
                lastName: author.lastName,
            });
        }
    }, [author])

    // This function handles input changes and updates the form data state    
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    } 

    // This function is called when the form is submitted
    const handleSubmit = (event) => {
        event.preventDefault();
        handleFormSubmit({
            endpoint: '/api/authors',
            id,
            formData,
            setItems: setAuthors,
            successMessage: id ? 'Author updated successfully!' : 'Author created successfully!',
            navigateTo: '/authors',
            navigate,
        })
    }

    const formFields = [
        { label: 'First Name', name: 'firstName', type: 'text', placeholder: 'Enter first name', component: TextInput },
        { label: 'Last Name', name: 'lastName', type: 'text', placeholder: 'Enter last name', component: TextInput },
    ]

    return (
        <>
        <GoBackButton />
        <h1>{id ? 'Edit Author' : 'New Author'}</h1>
        <form onSubmit={handleSubmit}>
            {formFields.map((field) => {
                const FieldComponent = field.component
                return (
                    <FieldComponent
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                    />
                )
            })}
            {/* You can add more fields here if needed */}
            <SubmitButton isEditing={!!id} object="Author" />
        </form>
        </>
    )
}