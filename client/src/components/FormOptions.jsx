import React from 'react';
import { GoBackButton } from '../components/Buttons'

const FormHeader = ({ isEditing }) => {
  return (
    <div className="form-header">
      <h1>{isEditing ? 'Edit Book' : 'Create New Book'}</h1>
      <GoBackButton />
    </div>
  );
};

const SearchInput = ({ type = 'text', value, onChange, placeholder, className }) => (
  <>
      <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={className ? className : 'search-input'}
      />
      <br />
  </>
);

const SelectInput = ({ label, name, value, options, onChange, placeholder = `Select ${label}` }) => (
  <>
      <label htmlFor={name}>{label}:</label>
      <select name={name} value={value} onChange={onChange}>
          <option value="">{placeholder}</option> {/* Default placeholder */}
          {options.map((option, index) => (
              <option
                  key={index}
                  value={typeof option === 'string' ? option : option._id} // Handle strings or objects
              >
                  {typeof option === 'string' ? option : option.title || `${option.firstName} ${option.lastName}`}
              </option>
          ))}
      </select>
      <br />
  </>
);

// const SelectInput = ({ label, name, value, options, onChange }) => (
//     <>
//         <label htmlFor={name}>{label}:</label>
//         <select name={name} value={value} onChange={onChange}>
//             <option value="">Select {label}</option>
//             {options.map((option) => (
//                 <option key={option._id} value={option._id}>
//                     {option.firstName ? `${option.firstName} ${option.lastName}` : option.title}
//                 </option>
//             ))}
//         </select>
//         <br />
//     </>
// );


const TextInput = ({ label, name, type = 'text', value, onChange, placeholder }) => (
  <>
      <label htmlFor={name}>{label}:</label>
      <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder ? placeholder : `Enter ${label}`}
      />
      <br />
  </>
);


export { FormHeader, SearchInput, SelectInput, TextInput } 

