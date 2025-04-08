import React from 'react';

export function GoBackButton() {
    return <div onClick={() => window.history.back()}>&#8592; Go Back</div>;
}

export function AddButton({  }) {
    return <button>Add New</button>;
}

// export function SubmitButton({  }) {
//     return <button type='submit'>Submit Form</button>;
// }

export function EditButton({ onClick }) {
    return <button onClick={onClick}>Edit</button>;
}

export function DeleteButton({ onClick }) {
    return <button onClick={onClick}>Delete</button>;
}

const SubmitButton = ({ isEditing, object }) => {
  return (
    <button type='submit'>
       {isEditing ? `Edit ${object}` : `Create New ${object}`} 
    </button>
  );
};

export { SubmitButton };