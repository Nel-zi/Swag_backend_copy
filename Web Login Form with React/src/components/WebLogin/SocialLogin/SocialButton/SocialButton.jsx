import React from 'react'
import './SocialButton.css'

const SocialButton = ({ type, text, icon, backgroundImage }) => {
  const getMarginClass = () => {
    switch (type) {
      case 'facebook':
        return 'social-button-facebook'
      case 'google':
        return 'social-button-google'
      case 'apple':
        return 'social-button-apple'
      default:
        return ''
    }
  }

  const getIconClass = () => {
    switch (type) {
      case 'facebook':
        return 'social-icon-facebook'
      case 'google':
        return 'social-icon-google'
      case 'apple':
        return 'social-icon-apple'
      default:
        return ''
    }
  }

  const getTextClass = () => {
    switch (type) {
      case 'facebook':
        return 'social-text-facebook'
      case 'google':
        return 'social-text-google'
      case 'apple':
        return 'social-text-apple'
      default:
        return ''
    }
  }

  return (
    <button 
      className={`social-button ${getMarginClass()}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div 
        className={`social-icon ${getIconClass()}`}
        style={{ backgroundImage: `url(${icon})` }}
      ></div>
      <span className={`social-text ${getTextClass()}`}>{text}</span>
    </button>
  )
}

export default SocialButton
