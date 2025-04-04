import { useState, useEffect } from 'react'
import axios from 'axios'

export default function GetSeries() {
    const [series, setSeries] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                // Fetch series
                const seriesResponse = await axios.get('/api/series')
                setSeries(seriesResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err)
                setError(err)
            }
        };

        fetchSeries()
    }, []);

    return { series, setSeries, error }
}
