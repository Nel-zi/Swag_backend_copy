import React from 'react'
import Header from './Header/Header'
import LoginForm from './LoginForm/LoginForm'
import SocialLogin from './SocialLogin/SocialLogin'
import Footer from './Footer/Footer'
import './WebLogin.css'

const WebLogin = () => {
  return (
    <main className="main-container">
      <Header />
      <LoginForm />
      <SocialLogin />
      <Footer />
      <div className="background-image"></div>
    </main>
  )
}

export default WebLogin
