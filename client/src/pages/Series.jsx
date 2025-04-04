import React from 'react'
import { Link } from 'react-router-dom'
import GetSeries from '../hooks/GetSeries' 
import SeriesForm from '../components/series/SeriesForm'
// import SeriesList from '../components/series/SeriesList'
import { AddButton } from '../components/Buttons'

const Series = () => {
    const { series, error } = GetSeries()

    if (error) {
        return <p>Error fetching series: {error.message}</p>
    }

    return (
        <>
            <h1>Series</h1>
            <Link to="/series/new">
                <AddButton />               
            </Link>      
             {/* <SeriesList series={series} />   */}
        </>
    )
}

export default Series

