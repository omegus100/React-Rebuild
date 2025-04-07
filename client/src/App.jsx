import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Books from './pages/Books'
import Authors from './pages/Authors'
import Series from './pages/Series'
import Genres from './pages/Genres'
import BookForm from './components/books/BookForm'
import BookDetails from './components/books/BookDetails.jsx'
import AuthorForm from './components/authors/AuthorForm'
import AuthorDetails from './components/authors/AuthorDetails'
import SeriesForm from './components/series/SeriesForm'
import SeriesDetails from './components/series/SeriesDetails'

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Wrap all routes with the Layout component */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<h1>Home Page</h1>} />
                    <Route path="home" element={<Home />} />
                    <Route path="books" element={<Books />} />
                    <Route path="books/new" element={<BookForm />} /> 
                    <Route path="books/:id" element={<BookDetails />} /> 
                    <Route path="books/:id/edit" element={<BookForm />} /> 
                    <Route path="authors" element={<Authors />} />
                    <Route path="authors/new" element={<AuthorForm />} /> 
                    <Route path="authors/:id" element={<AuthorDetails />} /> 
                    <Route path="authors/:id/edit" element={<AuthorForm />} /> 
                    <Route path="series" element={<Series />} />        
                    <Route path="series/new" element={<SeriesForm />} />  
                    <Route path="series/:id" element={<SeriesDetails />} /> 
                    <Route path="series/:id/edit" element={<SeriesForm />} />         
                    <Route path="genres" element={<Genres />} />        
                </Route>
            </Routes>
        </Router>
    );
}