import React, { useState } from "react"
import { useParams, useLocation } from "react-router-dom"
import { GetData, GetBookObjectData } from "../hooks/getData" // Custom hook to fetch data
import BookCover from "../components/books/BookCover" // Component to display book covers
import SortOptions from "../components/SortOptions" // Component for sorting options
import styles from "../stylesheets/Index.module.css" // CSS module for styling

export default function BookObjects() {
    const { id } = useParams() // Get the id from the URL
    const location = useLocation() // Get the full URL path
    const { data: books, error } = GetData('books') // Fetch books using the custom hook
    const [sortBy, setSortBy] = useState('title')
    const { data: test } = GetBookObjectData('genres') // Fetch authors using the custom hook

    // Extract the string before :id in the URL and remove the leading slash
    const basePath = location.pathname.split(`/${id}`)[0].slice(1)

    // Dynamically filter books based on basePath and return unique values (lowercased)
    const objects = Array.from(
        new Set(
            books
                .flatMap((book) => book[basePath]) // Access the property dynamically using basePath
                .filter((value) => value && value.trim() !== "") // Remove falsy or empty values
        )
    )
        .map((value) => value.toLowerCase()) // Convert all values to lowercase
        .sort()

    // If id matches a value in the objects array, filter books with that id
    const filteredBooks = objects.includes(id.toLowerCase())
        ? books.filter((book) => book[basePath]?.map((v) => v.toLowerCase()).includes(id.toLowerCase()))
        : []

    const sortedBooks = filteredBooks?.sort((a, b) => {
        const normalizeTitle = (title) => title.replace(/^The\s+/i, '').toLowerCase()

        switch (sortBy) {
            case 'title': {
                return normalizeTitle(a.title).localeCompare(normalizeTitle(b.title))
            }
            case 'author': {
                const authorA = `${a.author?.firstName || ''} ${a.author?.lastName || ''}`.toLowerCase()
                const authorB = `${b.author?.firstName || ''} ${b.author?.lastName || ''}`.toLowerCase()
                return authorA.localeCompare(authorB)
            }
            case 'series': {
                const seriesA = a.series?.title?.toLowerCase() || ''
                const seriesB = b.series?.title?.toLowerCase() || ''
                return seriesA.localeCompare(seriesB)
            }
            case 'pageCount': {
                const pageCountA = a.pageCount || 0
                const pageCountB = b.pageCount || 0
                return pageCountA - pageCountB
            }
            case 'publishDate': {
                const publishDateA = new Date(a.publishDate) || new Date(0)
                const publishDateB = new Date(b.publishDate) || new Date(0)
                return publishDateA - publishDateB
            }
            case 'createdAt': {
                const createdAtA = new Date(a.createdAt) || new Date(0)
                const createdAtB = new Date(b.createdAt) || new Date(0)
                return createdAtA - createdAtB
            }
            default:
                return 0
        }
    })

    // Determine the title based on basePath and id
    const title = (() => { 
        switch (basePath) {
            case "genres": {
                return `${id} books (${filteredBooks.length})` // Placeholder for genres
            }
            case "format": {
                return `${id}s (${filteredBooks.length})` // Placeholder for formats
            }
            default: {
                return `${id} (${filteredBooks.length})`
            }
        }
    })()

    if (error) {
        return <p>Error fetching books: {error.message}</p> // Handle error state
    }

    console.log(test)

    return (
        <div>
            <div className={styles.filterContainer}>
                <h1>{title}</h1>
                <SortOptions 
                    sortBy={sortBy} 
                    setSortBy={setSortBy} 
                    object="book" 
                    className={styles.sortContainer} 
                />
            </div>
            <BookCover 
                books={sortedBooks} 
                subtitle={(book) => {
                    switch (sortBy) {
                        case 'title':
                        case 'author': {
                            return `${book.author?.firstName || ''} ${book.author?.lastName || ''}`
                        }
                        case 'series': {
                            return `${book.series?.title || ''} ${book.series?.volume || ''}`
                        }
                        case 'pageCount': {
                            return `${book.pageCount || 0} pages`
                        }
                        case 'publishDate': {
                            return book.publishDate ? new Date(book.publishDate).toLocaleDateString() : 'No Publish Date'
                        }
                        case 'createdAt': {
                            return new Date(book.createdAt).toLocaleDateString()
                        }
                        default: {
                            return `${book.author?.firstName || ''} ${book.author?.lastName || ''}`
                        }
                    }
                }} 
            />  
        </div>
    )
}