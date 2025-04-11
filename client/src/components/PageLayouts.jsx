import React from 'react'
import { Link } from 'react-router-dom'
import BookCover from './books/BookCover'
import { ViewAllButton } from './Buttons'
import styles from '../stylesheets/Index.module.css'

const GridLayout = ({ books, value, property, count }) => {
    // Filter books by the given property and value
    const filteredBooks = books.filter((book) => book[property]?.includes(value));

    return (
        <>
            <div className={styles.gridHeader}>
                <h2>{value} ({count} Books)</h2> 
                {/* <ViewAllButton object="Books" /> */}
            </div>
            <BookCover 
                books={filteredBooks} 
                subtitle={(book) => `${book.author.firstName} ${book.author.lastName}`} /> 
        </>
    );
}

const TableLayout = ({ series }) => {

    return (
        <>
            <table className={styles.tableLayout}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Books in Series</th>
                    </tr>
                </thead>
                <tbody>
                    {series.map((series) => (
                        <tr key={series._id}>
                            <td>
                                <Link to={`/series/${series._id}`}>
                                    {series.title}
                                </Link>
                            </td>
                            <td>
                                <Link to={`/authors/${series.author.id}`}>
                                    {`${series.author.firstName} ${series.author.lastName}`}
                                </Link>
                            </td>
                            <td>{series.bookCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default function ListLayout({ authors, sortBy }) {
    // Get unique first letters based on the sortBy value
    const firstLetters = authors
        ?.map((author) =>
            sortBy === 'firstName'
                ? author.firstName[0].toUpperCase() // Get the first letter of firstName
                : author.lastName[0].toUpperCase() // Get the first letter of lastName
        )
        .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
        .sort(); // Sort alphabetically

    // Sort authors by firstName or lastName
    const sortedAuthors = [...authors]?.sort((a, b) => {
        if (sortBy === 'firstName') {
            return a.firstName.localeCompare(b.firstName);
        }
        if (sortBy === 'lastName') {
            return a.lastName.localeCompare(b.lastName);
        }
        return 0;
    })

    return (
        <>
        <div className={styles.linkList}>
            {firstLetters.map((letter, index) => (    
                <a href={`#link${letter}`} key={index}>{letter}</a>          
            ))}    
        </div>
        <div>
                {firstLetters.map((letter) => (
                    <div key={letter} id={`link${letter}`}>
                        <h2>{letter}</h2>
                        <ul>
                            {sortedAuthors
                                .filter((author) =>
                                    sortBy === 'firstName'
                                        ? author.firstName[0].toUpperCase() === letter
                                        : author.lastName[0].toUpperCase() === letter
                                )
                                .map((author) => (
                                    <li key={author._id}>
                                        <Link to={`/authors/${author._id}`}>
                                            {author.firstName} {author.lastName}
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
}

export { GridLayout, TableLayout, ListLayout };
