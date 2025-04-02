import React from 'react';

export function GoBackButton() {
    return <div onClick={() => window.history.back()}>&#8592; Go Back</div>;
}

export function AddButton({  }) {
    return <button>Add New</button>;
}

export function DeleteButton({ onClick }) {
    return <button onClick={onClick}>Delete</button>;
}