import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as bookObjects from './bookObjects'
import GetAuthors from '../../hooks/GetAuthors'
import GetSeries from '../../hooks/GetSeries'
import { useParams, useNavigate } from 'react-router-dom'
import { TextInput, SelectInput } from '../../components/FormOptions'
import { GoBackButton, SubmitButton } from '../Buttons'
import FileUploader from '../../components/FileUpload'
// import useFetchBook from '../../hooks/useFetchBook'
// import { handleFormSubmit } from '../../utils/formSubmitHelper'

export default function BookForm({ setBooks }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        publishDate: '',
        pageCount: '',
        format: '',
        genres: '',
        authorId: '',
        seriesId: '',
        seriesVolume: '',
        coverImagePath: ''
    });

    // const { book, error } = useFetchBook(id);

    // const [formData, setFormData] = useState({
    //     title: book.title || '',
    //     description: book.description || '',
    //     publishDate: book.publishDate || '',
    //     pageCount: book.pageCount || '',
    //     format: book.format || '',
    //     genres: book.genres || '',
    //     authorId: book.author?.id || '',
    //     authorFirstName: book.author?.firstName || '',
    //     authorLastName: book.author?.lastName || '',
    //     seriesTitle: book.series?.title || '',
    //     seriesId: book.series?.id || '',
    //     seriesVolume: book.series?.volume || '',
    //     coverImagePath: book.coverImagePath,
    //     publisher: book.publisher || '',
    //     isbn: book.isbn || 
    // })

    const { authors, error } = GetAuthors();
    const { series } = GetSeries();

    useEffect(() => {
        if (id) {
            const fetchBook = async () => {
                try {
                    const response = await axios.get(`/api/books/${id}`);
                    const book = response.data;

                    setFormData({
                        title: book.title || '',
                        description: book.description || '',
                        publishDate: book.publishDate || '',
                        pageCount: book.pageCount || '',
                        format: book.format || '',
                        genres: book.genres || '',
                        authorId: book.author?.id || '',
                        authorFirstName: book.author?.firstName || '',
                        authorLastName: book.author?.lastName || '',
                        seriesTitle: book.series?.title || '',
                        seriesId: book.series?.id || '',
                        seriesVolume: book.series?.volume || '',
                        coverImagePath: book.coverImagePath,
                        publisher: book.publisher || '',
                        isbn: book.isbn || ''
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
        if (!authorId || authorId === formData.authorId) return; // Prevent overwriting if no change
        const selectedAuthor = authors.find((author) => author._id === authorId);
        if (selectedAuthor) {
            setFormData((prevData) => ({
                ...prevData,
                authorFirstName: selectedAuthor.firstName,
                authorLastName: selectedAuthor.lastName,
            }));
        }
    };

    const updateSeriesInfo = (seriesId) => {
        if (!seriesId || seriesId === formData.seriesId) return; // Prevent overwriting if no change
        const selectedSeries = series.find((series) => series._id === seriesId);
        if (selectedSeries) {
            setFormData((prevData) => ({
                ...prevData,
                seriesTitle: selectedSeries.title,
            }));
        }
    };

    const handleFileChange = (fileItems) => {
        if (fileItems.length > 0) {
            const file = fileItems[0].file;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setFormData((prevData) => ({
                    ...prevData,
                    coverImagePath: reader.result
                }));
            };
        } else {
            // Set the default cover image if no file is uploaded
            setFormData((prevData) => ({
                ...prevData,
                coverImagePath: '/no_book_cover_available.svg'
            }));
        }
    };

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     handleFormSubmit({
    //         endpoint: '/api/books',
    //         id,
    //         formData,
    //         setItems: setBooks,
    //         successMessage: id ? 'Book updated successfully!' : 'Book created successfully!',
    //         navigateTo: '/books',
    //         navigate,
    //     });
    // };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const finalFormData = {
            ...formData,
            coverImagePath: formData.coverImagePath || '/no_book_cover_available.svg' // Default file path
        };

        const filteredFormData = Object.fromEntries(
            Object.entries(finalFormData).filter(([key, value]) => value !== '')
        );

        try {
            if (id) {
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
                const response = await axios.post('/api/books', filteredFormData);
                if (setBooks) {
                    setBooks((prevBooks) => [...prevBooks, response.data]);
                }
                alert('Book created successfully!');
            }

            navigate('/books');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const formFields = [
        { label: "Title", name: "title", type: "text", component: "TextInput" },
        { label: "Description", name: "description", type: "text", component: "TextInput" },
        { label: "Publish Date", name: "publishDate", type: "date", component: "TextInput" },
        { label: "Page Count", name: "pageCount", type: "number", component: "TextInput" },
        { label: "Format", name: "format", component: "SelectInput", options: bookObjects.formats },
        { label: "Genres", name: "genres", component: "SelectInput", options: bookObjects.genres },
        { label: "Author", name: "authorId", component: "SelectInput", options: authors, customHandler: updateAuthorInfo },
        { label: "Series", name: "seriesId", component: "SelectInput", options: series, customHandler: updateSeriesInfo },
        { label: "Series Volume", name: "seriesVolume", type: "number", component: "TextInput" },
        { label: "Publisher", name: "publisher", type: "text", component: "TextInput" },
        { label: "ISBN", name: "isbn", type: "number", component: "TextInput" },
        { label: "Cover Image", name: "coverImagePath", component: "FileUploader" }
    ]

    return (
        <>
            <GoBackButton />
            <h1>{id ? 'Edit Book' : 'New Book'}</h1>
            <form onSubmit={handleSubmit}>
                {formFields.map((field, index) => {
                    if (field.component === "TextInput") {
                        return (
                            <TextInput
                                key={index}
                                label={field.label}
                                name={field.name}
                                type={field.type || "text"}
                                value={formData[field.name]}
                                onChange={handleInputChange}
                            />
                        );
                    } else if (field.component === "SelectInput") {
                        return (
                            <SelectInput
                                key={index}
                                label={field.label}
                                name={field.name}
                                value={formData[field.name]}
                                options={field.options}
                                onChange={(event) => {
                                    const { value } = event.target;
                                    handleInputChange(event);
                                    if (field.customHandler) field.customHandler(value);
                                }}
                            />
                        );
                    } else if (field.component === "FileUploader") {
                        return (
                            <FileUploader
                                key={index}
                                files={formData[field.name]}
                                onUpdateFiles={handleFileChange}
                            />
                        );
                    }
                    return null;
                })}
                <SubmitButton isEditing={!!id} object="Book" />
            </form>
            {error && <p>Error fetching authors: {error.message}</p>}
        </>
    );
}