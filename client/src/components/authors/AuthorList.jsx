import React from 'react'
import { Link } from 'react-router-dom'

export default function AuthorList({ authors }) {
    return (
        <>
            <ul>
                {authors.map((author) => (
                    <li key={author._id}>
                        {author.firstName} {author.lastName} -- {author._id}
                    </li>
                ))}
            </ul>
            
        </>
    );
}