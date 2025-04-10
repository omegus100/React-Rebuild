import React from 'react'
import { Link } from 'react-router-dom'

export default function AuthorList({ series }) {
    return (
        <>
            <ul>
                {series.map((series) => (
                    <li key={series._id}>
                        <Link to={`/series/${series._id}`}>{series.title} by {series.author.firstName} {series.author.lastName}</Link>
                    </li>
                ))}
            </ul>
        </>
    );
}