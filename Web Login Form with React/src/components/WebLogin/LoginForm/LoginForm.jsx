import React from 'react'
import FastLogin from './FastLogin/FastLogin'
import EmailInput from './EmailInput/EmailInput'
import LoginButton from './LoginButton/LoginButton'
import './LoginForm.css'

const LoginForm = () => {
  return (
    <section className="login-form">
      <FastLogin />
      <EmailInput />
      <LoginButton />
    </section>
  )
}

export default LoginForm
