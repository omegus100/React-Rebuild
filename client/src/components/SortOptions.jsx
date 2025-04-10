import React from 'react';

const SortOptions = ({ sortBy, setSortBy, className, object }) => {
    const options = object === 'book'
    ? [
        { value: 'title', label: 'Title' },
        { value: 'author', label: 'Author' },
        { value: 'series', label: 'Series' },
        { value: 'pageCount', label: 'Page Count' },
        { value: 'publishDate', label: 'Publish Date' },
        { value: 'createdAt', label: 'Date Created' },
    ]
    : object === 'author'
    ? [
        { value: 'firstName', label: 'First Name' },
        { value: 'lastName', label: 'Last Name' },
    ]
    : object === 'series'
    ? [
        { value: 'title', label: 'Title' },
        { value: 'author', label: 'Author' },
        // { value: 'seriesLength', label: 'Books in Series' },
    ]
    : [];

    return (
        <div className={className ? className : '.sortContainer'}> 
            <label htmlFor="sort">Sort By:</label>
            <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SortOptions;
