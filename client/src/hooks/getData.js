import { useState, useEffect } from 'react'
import axios from 'axios'

// Reusable hook to fetch data (list or single item)
export function GetData(object, id = null) {
    const [data, setData] = useState(id ? null : []) // Default to an empty array for lists
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true) // Add isLoading state

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true) // Set loading to true before fetching
            try {
                const endpoint = id ? `/api/${object}/${id}` : `/api/${object}` // Determine endpoint based on id
                const response = await axios.get(endpoint)
                setData(response.data)
            } catch (err) {
                console.error(`Error fetching ${id ? 'item' : 'list'} from ${object}:`, err)
                setError(err)
            } finally {
                setIsLoading(false) // Set loading to false after fetching
            }
        }

        fetchData()
    }, [object, id]) // Re-run if object or id changes

    return { data, error, isLoading, setData }
}

// Custom hook to fetch id data from the API
export const GetDataById = async (object, id) => {
    try {
        const response = await axios.get(`/api/${object}/${id}`)
        return response.data // Return the data for the specific object
    } catch (error) {
        console.error('Error fetching data by ID:', error)
        throw error // Re-throw the error for handling in the calling function
    }
}

export function GetBookObjectData(object) {
    const [data, setData] = useState([]) // Default to an empty array
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true) // Add isLoading state

    useEffect(() => {
        const fetchObjectData = async () => {
            setIsLoading(true) // Set loading to true before fetching
            try {
                const response = await axios.get(`/api/books`) // Fetch all books
                const books = response.data

                // Extract unique values for the specified object (e.g., genres, format)
                const uniqueValues = Array.from(
                    new Set(
                        books
                            .flatMap((book) => book[object]) // Access the property dynamically
                            .filter((value) => value && value.trim() !== "") // Remove falsy or empty values
                    )
                )

                setData(uniqueValues) // Store the unique values in state
            } catch (err) {
                console.error(`Error fetching book object data for ${object}:`, err)
                setError(err) // Store the error in state
            } finally {
                setIsLoading(false) // Set loading to false after fetching
            }
        }

        fetchObjectData()
    }, [object]) // Re-run if the object changes

    return { data, error, isLoading, setData }
}

// export const GetBookObjectData = async (object) => {
//     try {
//         const response = await axios.get(`/api/books`) // Fetch all books
//         const books = response.data

//         // Extract unique values for the specified object (e.g., genres, format)
//         const uniqueValues = Array.from(
//             new Set(
//                 books
//                     .flatMap((book) => book[object]) // Access the property dynamically
//                     .filter((value) => value && value.trim() !== "") // Remove falsy or empty values
//             )
//         )

//         return uniqueValues // Return the unique values as an array
//     } catch (error) {
//         console.error(`Error fetching book object data for ${object}:`, error)
//         throw error // Re-throw the error for handling in the calling function
//     }
// }