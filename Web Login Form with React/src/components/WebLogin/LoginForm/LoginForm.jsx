import React from 'react'
import { useState } from 'react'
import FastLogin from './FastLogin/FastLogin'
//import EmailInput from './EmailInput/EmailInput'
//import LoginButton from './LoginButton/LoginButton'
import './LoginForm.css'


const LoginForm = (/*{ onDataSend }*/) => {

  const [username, setUsername] = useState('');

  //const usernameExists = false // PLACEHOLDER

  const checkUsername = () => {
    // Add login logic here
    alert('Switch to password window...');
    //onDataSend(usernameExists); // Invoke the callback with child's variable
  };

  return (
    <section className="login-form">
      <FastLogin />
      <div className="email-input">
        <label className="email-label">Email, Phone Number or Username</label>
        <div className="email-input-container">
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Type Email...." 
            className="email-input-field"
          />
          <div className="user-icon"></div>
        </div>
      </div>
      <button className="login-button" onClick={checkUsername}>
        <span className="login-button-text">Login</span>
      </button>
    </section>
  )
}

export default LoginForm
