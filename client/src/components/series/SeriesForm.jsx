import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { GetAuthors } from '../../hooks/GetAuthors'
import { GoBackButton, SubmitButton } from '../Buttons'
import { TextInput, SelectInput } from '../../components/FormOptions'
import { handleFormSubmit } from '../../utils/handleFormSubmit'

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
                            authorFirstName: series.author.firstName,
                            authorLastName: series.author.lastName                    
                        })
                    } catch (err) {
                        console.error('Error fetching series:', err)
                    }
                };
    
                fetchSeries()
            }
        }, [id])

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

       // Update author info immediately when authorId changes
        if (name === "authorId") {
            updateAuthorInfo(value);
        }
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

    // This function is called when the form is submitted
    const handleSubmit = (event) => {
        event.preventDefault();

        // Prevent submission if no author is selected
        if (!formData.authorId) {
            alert('Please select an author before submitting the form.');
            return;
        } 

        handleFormSubmit({
            endpoint: '/api/series',
            id,
            formData,
            setItems: setSeries,
            successMessage: id ? 'Series updated successfully!' : 'Series created successfully!',
            navigateTo: '/series',
            navigate,
        });
    }

    const formFields = [
        { label: 'Title', name: 'title', type: 'text', placeholder: 'Enter Series Title', component: TextInput },
        { label: 'Author', name: 'authorId', value: formData.authorId, options: authors, placeholder: 'Select Author', component: SelectInput },
    ]

    return (
        <>
        <GoBackButton />
        <h1>{id ? 'Edit Series' : 'New Series'}</h1>
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
                        options={field.options}
                        placeholder={field.placeholder}
                    />
                )
            }
            )}
        <SubmitButton isEditing={!!id} object="Series" />
        </form>
        {error && <p>Error fetching authors: {error.message}</p>}
        </>
    )
}