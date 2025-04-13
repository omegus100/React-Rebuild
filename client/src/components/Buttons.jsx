import React from 'react'

export function GoBackButton() {
    return <div onClick={() => window.history.back()}>&#8592; Go Back</div>
}

export function AddButton({  }) {
    return <button>Add New</button>;
}

export function EditButton({ onClick }) {
    return <button onClick={onClick}>Edit</button>;
}

export function DeleteButton({ onClick }) {
    return <button onClick={onClick}>Delete</button>;
}

export function ViewAllButton({  }) {
  return <button>View All</button>;
}

const SubmitButton = ({ isEditing, object }) => {
  return (
    <button type='submit'>
       {isEditing ? `Update ${object}` : `Add ${object}`} 
    </button>
  );
}


export { SubmitButton }