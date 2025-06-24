import React from 'react'
import  { useState }  from 'react'
//import { useContext } from 'react'
import FastLogin from './FastLogin/FastLogin'
//import EmailInput from './EmailInput/EmailInput'
//import LoginButton from './LoginButton/LoginButton'
import './LoginForm.css'
//import { AuthContext } from '../../../contexts/AuthContext'



const LoginForm = () => {

  const [formData, setFormData] = useState({
    username: '',
    passwprd: ''
  });

  //const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    LoginForm(formData.username, formData.passwprd);
  };

  return (
    <section className="login-form">
      <FastLogin />
      <div className="email-input">
        <label className="email-label">Email, Phone Number or Username</label>
        <div className="email-input-container">
          <input 
            type="text"
            value={<var>username</var>}
            onChange={handleChange}
            placeholder="Type Email...." 
            className="email-input-field"
          />
          <div className="user-icon"></div>
        </div>
      </div>
      <button className="login-button" onClick={handleLogin}>
        <span className="login-button-text">Login</span>
      </button>
    </section>
  )
}
// on button click, checkUsername is called
export default LoginForm
