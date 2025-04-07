import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar Navigation */}
            <nav style={{ width: '200px', padding: '1rem', background: '#f0f0f0' }}>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/books">Books</Link></li>
                    <li><Link to="/authors">Authors</Link></li>
                    <li><Link to="/series">Series</Link></li>
                    <li><Link to="/genres">Genres</Link></li>
                </ul>
            </nav>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '1rem' }}>
                <Outlet /> {/* This is where the routed page content will be rendered */}
            </main>
        </div>
    );
}