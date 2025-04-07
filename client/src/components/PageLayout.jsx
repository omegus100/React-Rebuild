import React from 'react'
import { Link } from 'react-router-dom'
import { AddButton } from '../components/Buttons'
import styles from '../stylesheets/Index.module.css'

const PageLayout = ({ title, data, error, linkPath, ListComponent }) => {
    if (error) {
        return <p>Error fetching {title.toLowerCase()}: {error.message}</p>
    }

    return (
        <>
            <div className={styles.indexHeader}>
                <h1>{title}</h1>
                <Link to={linkPath}>
                    <AddButton />
                </Link>
            </div>
            <ListComponent data={data} />
        </>
    )
}

export default PageLayout