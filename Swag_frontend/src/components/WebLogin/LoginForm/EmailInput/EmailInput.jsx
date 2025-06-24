import React from 'react'
import './EmailInput.css'

const EmailInput = () => {
  return (
    <div className="email-input">
      <label className="email-label">Email, Phone Number or Username</label>
      <div className="email-input-container">
        <input 
          type="text" 
          placeholder="Type Email...." 
          className="email-input-field"
        />
        <div className="user-icon"></div>
      </div>
    </div>
  )
}

export default EmailInput
