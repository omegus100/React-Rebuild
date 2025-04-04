import React from 'react'
import { Link } from 'react-router-dom'

export default function AuthorList({ authors }) {
    return (
        <>
            <ul>
                {authors.map((author) => (
                    <li key={author._id}>
                        <Link to={`/authors/${author._id}`}>{author.firstName} {author.lastName}</Link>
                    </li>
                ))}
            </ul>
        </>
    );
}