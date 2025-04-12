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
    //     title: book?.title || '',
    //     description: book?.description || '',
    //     publishDate: book?.publishDate || '',
    //     pageCount: book?.pageCount || '',
    //     format: book?.format || '',
    //     genres: book?.genres || '',
    //     authorId: book?.author?.id || '',
    //     seriesId: book?.series?.id || '',
    //     seriesVolume: book?.series?.volume || '',
    //     coverImagePath: book?.coverImagePath || '',
    //     publisher: book?.publisher || '',
    //     isbn: book?.isbn || '',
    // });

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
            setFormData((prevData) => ({
                ...prevData,
                coverImagePath: ''
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

        const filteredFormData = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => value !== '')
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

    return (
        <>
            <GoBackButton />
            <h1>{id ? 'Edit Book' : 'New Book'}</h1>
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                />
                <TextInput
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
                <TextInput
                    label="Publish Date"
                    name="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={handleInputChange}
                />
                <TextInput
                    label="Page Count"
                    name="pageCount"
                    type="number"
                    value={formData.pageCount}
                    onChange={handleInputChange}
                />
                <SelectInput
                    label="Format"
                    name="format"
                    value={formData.format}
                    options={bookObjects.formats}
                    onChange={handleInputChange}            
                />
                <SelectInput
                    label="Genres"
                    name="genres"
                    value={formData.genres}
                    options={bookObjects.genres}
                    onChange={handleInputChange}
                />
                <SelectInput
                    label="Author"
                    name="authorId"
                    value={formData.authorId}
                    options={authors}
                    onChange={(event) => {
                        const { value } = event.target;
                        handleInputChange(event);
                        updateAuthorInfo(value); // Call only if a valid value is selected
                    }}
                />
                <SelectInput
                    label="Series"
                    name="seriesId"
                    value={formData.seriesId}
                    options={series}
                    onChange={(event) => {
                        const { value } = event.target;
                        handleInputChange(event);
                        updateSeriesInfo(value); // Call only if a valid value is selected
                    }}
                />
                <TextInput
                    label="Series Volume"
                    name="seriesVolume"
                    type="number"
                    value={formData.seriesVolume}
                    onChange={handleInputChange}
                />
                <FileUploader
                    files={formData.coverImagePath}
                    onUpdateFiles={handleFileChange}
                />
                <TextInput
                    label="Publisher"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                />
                 <TextInput
                    label="ISBN"
                    name="isbn"
                    type="number"
                    value={formData.isbn}
                    onChange={handleInputChange}
                />
                <SubmitButton 
                    isEditing={!!id}
                    object="Book"
                />  
            </form>
            {error && <p>Error fetching authors: {error.message}</p>}
        </>
    );
}