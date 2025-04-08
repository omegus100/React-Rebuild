import React from 'react';

const SortOptions = ({ sortBy, setSortBy, className }) => {
    return (
        <div className={className ? className : '.sortContainer'}> 
            <label htmlFor="sort">Sort By:</label>
            <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="series">Series</option>
            </select>
        </div>
    );
};

export default SortOptions;
