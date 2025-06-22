import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="header-wrapper">
        <button className="header-button"></button>
        <h1 className="header-title">Welcome Back!</h1>
      </div>
      <p className="header-subtitle">Enter your information to login.</p>
      <div className="header-divider"></div>
    </header>
  )
}

export default Header
