import React from 'react';
import { useState } from 'react';
import './WebPassword.css'
//import { FaLock } from 'react-icons/fa';

const WebPassword = () => {
  const [password, setPassword] = useState('');

  const handlepassword = () => {
    // Add login logic here
    alert('Logging in...');
  };

  return (
    <div className="password-container">
      <div className="password-header">
        <button className="nav-button back-button">←</button>
        <h2 className="password-title">Log in</h2>
        <button className="nav-button close-button">×</button>
      </div>

      <div className="password-content">
        <p className="password-instruction">Enter your password!</p>
        <div className="password-input-wrapper">
          <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.8341 7.66309C13.8021 7.83409 14.3731 8.51603 14.5101 9.47003V16.506C14.4081 17.449 13.8181 18.151 12.8701 18.311L2.91913 18.3061C1.97213 18.0871 1.42512 17.399 1.34412 16.436C1.15712 14.211 1.4871 11.7241 1.3501 9.47107C1.4871 8.51707 2.05812 7.83506 3.02612 7.66406L4.71515 7.66907H11.1451L12.8341 7.66309ZM8.52411 15.61C8.55911 15.575 8.68814 15.34 8.69714 15.285C8.79114 14.675 8.6181 13.8611 8.7041 13.2261C10.2501 12.1961 9.52514 9.94808 7.58814 10.1971C7.09514 10.2601 6.68915 10.6491 6.48615 11.0851C6.09415 11.9291 6.41613 12.7251 7.15613 13.2261C7.21713 13.8681 7.1041 14.579 7.1601 15.212C7.2151 15.824 8.09013 16.0381 8.52313 15.6111L8.52411 15.61Z" stroke="#94FFBF" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.0259 7.66279C3.0639 6.62279 2.91891 5.61375 3.22091 4.60475C3.95591 2.14575 6.70192 0.586749 9.19992 1.30775C9.29892 1.33575 9.38993 1.31176 9.45993 1.42976" stroke="#94FFBF" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.1406 3.45801C12.2416 3.79901 12.4666 4.09701 12.5836 4.43201C12.9536 5.49601 12.8006 6.55602 12.8356 7.66302" stroke="#94FFBF" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
            placeholder="**********"
          />
        </div>
        <button className="password-button" onClick={handlepassword}>
          Login
        </button>
      </div>
    </div>
  );
};

export default WebPassword;