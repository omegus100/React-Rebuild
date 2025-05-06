import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from '../stylesheets/Index.module.css'

export function TabMenu() {
    const location = useLocation() // Get the current location
    return (
        <>
            <nav className={styles.tabMenu}>
                <Link 
                    to="/library" 
                    className={`${styles.tabLink} ${location.pathname === '/library' ? styles.activeTab : ''}`}
                >
                    Books
                </Link>
                <Link 
                    to="/authors" 
                    className={`${styles.tabLink} ${location.pathname === '/authors' ? styles.activeTab : ''}`}
                >
                    Authors
                </Link>
                <Link 
                    to="/series" 
                    className={`${styles.tabLink} ${location.pathname === '/series' ? styles.activeTab : ''}`}
                >
                    Series
                </Link>
            </nav> 
        </>
    );
}

