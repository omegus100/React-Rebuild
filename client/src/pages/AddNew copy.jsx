import React, { useState } from 'react'
import axios from 'axios'
import styles from '../stylesheets/Index.module.css'
import { SearchInput } from '../components/FormOptions'
import FileUploader from '../components/FileUpload' 

export default function AddNewBook() {
    const [books, setBooks] = useState([]) // State to store books mapped to bookSchema
    const [searchQuery, setSearchQuery] = useState('') // State to store the search query

    const fetchBooks = async () => {
        try {
            const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
                params: { q: searchQuery } // Use the search query entered by the user
            })

            // Map the response to bookSchema
            const mappedBooks = response.data.items.map((item) => {
                const volumeInfo = item.volumeInfo
                const authorName = volumeInfo.authors?.[0] || 'Unknown Author'
                const nameParts = authorName.split(' ');
                const authorFirstName = nameParts.slice(0, -1).join(' ') || 'Unknown'; // All parts except the last
                const authorLastName = nameParts.slice(-1).join(' ') || 'Unknown'; // The last part


                return {
                    title: volumeInfo.title || '',
                    description: volumeInfo.description || '',
                    publishDate: volumeInfo.publishedDate || '',
                    pageCount: volumeInfo.pageCount || '',
                    genres: volumeInfo.categories || [],
                    authorId: '', // Placeholder, as authorId is not available in the API
                    authorFirstName: authorFirstName || '',
                    authorLastName: authorLastName || '',
                    coverImagePath: volumeInfo.imageLinks?.thumbnail || '',
                    publisher: volumeInfo.publisher || 'N/A',
                    isbn: volumeInfo.industryIdentifiers?.[0]?.identifier || ''
                }
            })

            setBooks(mappedBooks)
            console.log(mappedBooks)
        } catch (error) {
            console.error('Error fetching books:', error)
        }
    }

    const findMatchingAuthor = async (book) => {
        try {
            // Fetch all authors from the backend
            const response = await axios.get('/api/authors')
            const authors = response.data

            // Find a matching author
            const matchingAuthor = authors.find(
                (author) =>
                    author.firstName === book.authorFirstName &&
                    author.lastName === book.authorLastName
            )

            if (matchingAuthor) {
                // Update the book's authorId with the matching author's ID
                book.authorId = matchingAuthor._id
    
                return book
            } else {
                return addNewAuthor(book)
            }
           
        } catch (error) {
            console.error('Error fetching authors:', error)
            throw error
        }
    }

    const addNewAuthor = async (book) => {
        try {
            // Create a new author using book.authorFirstName and book.authorLastName
            const response = await axios.post('/api/authors', {
                firstName: book.authorFirstName,
                lastName: book.authorLastName
            })

            const newAuthor = response.data // Get the newly created author from the response
            book.authorId = newAuthor._id // Update the book's authorId with the ID of the newly created author

            // Return the updated book
            return book           
        } catch (error) {
            console.error('Error adding new author:', error)
            throw error
        }
    }

    const handleFormSubmit = async (e, book, index) => {
        e.preventDefault();
        try {
            // Check for a matching author and update the book
            const updatedBook = await findMatchingAuthor(book);
    
            // Add the updated book to the backend
            const response = await axios.post('/api/books', updatedBook);
            alert('Book added successfully!');
        } catch (error) {
            console.error('Error handling form submission:', error);
        }
    }



    return (
        <>
        <div>
            <h1>Add New Book</h1>
           
            <div className={styles.filterContainer}>
                <SearchInput
                    type="text"
                    placeholder="Search for books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className={styles.searchInput}
                />  
                <button onClick={fetchBooks} style={{ padding: '.5rem' }}>
                    Search
                </button>
            </div>

            {/* Display Books as Forms */}
            <div>
                {books.map((book, index) => (
                  
                    <form
                        key={index}
                        onSubmit={(e) => handleFormSubmit(e, book, index)}
                        style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}
                    >
                        <h2>{book.title}</h2>
                        <p><strong>Author:</strong> {book.authorFirstName} {book.authorLastName}</p>
                        <p><strong>Description:</strong> {book.description}</p>
                        <p><strong>Publish Date:</strong> {book.publishDate}</p>
                        <p><strong>Page Count:</strong> {book.pageCount}</p>
                        {/* <p><strong>Format:</strong> {book.format}</p> */}
                        <p><strong>Genres:</strong> {book.genres.join(', ')}</p>
                        <p><strong>Publisher:</strong> {book.publisher}</p>
                        <p><strong>ISBN:</strong> {book.isbn}</p>
                        <img src={book.coverImagePath.replaceAll("1","10")} alt={book.title} style={{ width: '100px' }} />
                        <button type="submit" style={{ marginTop: '10px', padding: '10px' }}>
                            Submit Book
                        </button>
                    </form>
                ))}
            </div>
        </div>
        </>
    )
}