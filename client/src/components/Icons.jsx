import React, { useState } from 'react'
import '../stylesheets/Icons.module.css'

export function Loading() {
    return (
        <>
            <div className="loading-container">
                <img src="/images/loading_icon.gif" alt="Loading..." className="loading-image" />
            </div>
        </>
    );
}