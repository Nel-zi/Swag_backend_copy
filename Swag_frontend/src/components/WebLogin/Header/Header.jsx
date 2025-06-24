import React from 'react'
import './Header.css'

const Header = () => {

  const closeWindow  = () => {
    // Add login logic here
    alert('Window closes...');
  };

  return (
    <header className="header">
      <div className="header-wrapper">
        <button className="header-button" onClick={closeWindow}></button>
        <h1 className="header-title">Welcome Back!</h1>
      </div>
      <p className="header-subtitle">Enter your information to login.</p>
      <div className="header-divider"></div>
    </header>
  )
}

export default Header
