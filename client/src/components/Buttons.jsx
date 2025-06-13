import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import  '../stylesheets/AddButtonDropdown.css'

export function GoBackButton() {
    return <div onClick={() => window.history.back()}>←  Go Back</div>
}

export function AddButton({  }) {
    return <button className="dropdown-button">Add New +</button>
}

export function EditButton({ onClick }) {
    return <button onClick={onClick}>Edit</button>
}

export function DeleteButton({ onClick }) {
    return <button onClick={onClick}>Delete</button>
}

export function ViewAllButton({ link, object }) {
  return (
        <Link to={`${link}`} object={object} className="view-all-button">
           <button>View All</button>
        </Link>  
  )
}

const SubmitButton = ({ isEditing, object }) => {
  return (
    <button type='submit'>
       {isEditing ? `Update ${object}` : `Add ${object}`} 
    </button>
  )
}

const AddButtonDropdown = ({ mainText = 'Add New', options = [] }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
      setIsOpen((prev) => !prev)
  }

  return (
      <div className="dropdown-container" onMouseLeave={() => setIsOpen(false)}>
          <button className="dropdown-button" onClick={toggleDropdown} >
              {mainText} <span className="dropdown-arrow">+</span>
          </button>
          {isOpen && (
              <div className="dropdown-menu">
                  {options.map((option, index) => (
                      <Link key={index} to={option.link} className={`dropdown-item ${option.isDanger ? 'danger' : ''}`}>
                          {option.text}
                      </Link>
                  ))}
              </div>
          )}
      </div>
  )
}


export { SubmitButton, AddButtonDropdown }