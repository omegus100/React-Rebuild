import React, { useState } from 'react'
import axios from 'axios'
import { SubmitButton } from '../components/Buttons'
// import GetAuthors from '../../hooks/GetAuthors'

const AddNew = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Fetch books from Google Books API and map fields to bookSchema
    const fetchBooks = async () => {
        if (!searchQuery) return

        setLoading(true)
        setError(null)

        try {
            const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
                params: { q: searchQuery }
            })

            const mappedBooks = (response.data.items || []).map((book) => {
                const volumeInfo = book.volumeInfo
                const authorName = volumeInfo.authors?.[0] || 'Unknown Author'
                const [authorFirstName, authorLastName] = authorName.split(' ')

                return {
                    title: volumeInfo.title || 'Unknown Title',
                    author: { 
                        id: '', 
                        firstName: authorFirstName|| 'Unknown', 
                        lastName: authorLastName || 'Unknown'
                    },
                    publishDate: volumeInfo.publishedDate || 'N/A',
                    publisher: volumeInfo.publisher || 'N/A',
                    pageCount: volumeInfo.pageCount || 0,
                    genres: volumeInfo.categories || [],
                    description: volumeInfo.description || 'No description available.',
                    coverImagePath: volumeInfo.imageLinks?.thumbnail || '/no_book_cover_available.svg'
                }
            })

            setBooks(mappedBooks)
        } catch (err) {
            console.error('Error fetching books:', err)
            setError('Failed to fetch books. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const findMatchingAuthor = async (authors, book) => {
        try {
            // Find a matching author
            const matchingAuthor = authors.find(
                (author) =>
                    author.firstName === book.author.firstName &&
                    author.lastName === book.author.lastName
            )

            if (matchingAuthor) {
                // Update book.author.id with the matching author's ID
                book.author.id = matchingAuthor._id
                console.log('Matching author found and updated book:', matchingAuthor, book)
                return book // Return the updated book
            }

            return null // Return null if no match is found
        } catch (err) {
            console.error('Error fetching authors:', err)
            throw err // Re-throw the error to handle it in the calling function
        }
    }

    const createNewAuthor = async (firstName, lastName) => {
        try {
            const response = await axios.post('/api/authors', {
                firstName,
                lastName,
            })
            console.log('New author created:', response.data)
            return response.data // Return the newly created author data
        } catch (err) {
            console.error('Error creating new author:', err)
            alert('Failed to create a new author. Please try again.')
            throw err // Re-throw the error to handle it in the calling function
        }
    }

    const handleFormSubmit = async (e, book) => {
        e.preventDefault()

        try {
            // Fetch all authors from the API
            const response = await axios.get('/api/authors')
            const authors = response.data

            let updatedBook = await findMatchingAuthor(authors, book) // Use the updated findMatchingAuthor function

            if (!updatedBook) {
                // If no matching author, create a new one
                const newAuthor = await createNewAuthor(book.author.firstName, book.author.lastName)
                book.author.id = newAuthor._id // Map the new author's ID to book.author.id
                book.author.firstName = newAuthor.firstName // Ensure firstName is updated
                book.author.lastName = newAuthor.lastName // Ensure lastName is updated
                updatedBook = book // Update the book with the new author
                console.log('Book after adding new author:', updatedBook)
            }

            // Ensure the updatedBook contains the correct author information
            console.log('Final updated book before submission:', updatedBook)

            // Post the updated book data to the /api/books endpoint
            const submitResponse = await axios.post('/api/books', updatedBook)
            console.log('Book submitted successfully:', submitResponse.data)

            // Optionally, show a success message or update the UI
            alert(`Book "${updatedBook.title}" submitted successfully!`)
        } catch (err) {
            console.error('Error handling form submission:', err)
            alert('Failed to process the form. Please try again.')
        }
    }

    return (
        <>
            <div>
                <h1>Search for Books</h1>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter book title"
                />
                <button onClick={fetchBooks}>Search</button>

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div>
                    {books.map((book, index) => (
                        <form
                            key={index}
                            onSubmit={(e) => handleFormSubmit(e, book)}
                        >
                            <h3>{book.title}</h3>
                            <p>Author: {book.author.firstName} {book.author.lastName}</p>
                            <img src={book.coverImagePath} alt={book.title} />
                            <span>Published Date: {book.publishDate}</span>
                            <span>Publisher: {book.publisher}</span>
                            <p>Page Count: {book.pageCount}</p>
                            <p>Genre: {book.genres.join(', ') || 'N/A'}</p>
                            <p>Description: {book.description}</p>
                            <SubmitButton isEditing={false} object="Book" />
                        </form>
                    ))}
                </div>
            </div>
        </>
    )
}

export default AddNew