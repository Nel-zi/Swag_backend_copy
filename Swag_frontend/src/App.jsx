//import { useState } from 'react'
//import { useEffect } from 'react'
import WebLogin from './components/WebLogin/WebLogin'
import WebPassword from './components/WebPassword/WebPassword'
import LoginForm from './components/WebLogin/LoginForm/LoginForm'

function App() {

  //const [clickResult, setClickResult] = useState('empty'); //holds changes to clickresult

  //const [showLoginPopup, setShowLoginPopup] = useState(false);
  //const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  //const [showQRPopup, setShowQRPopup] = useState(false);

  //const handleOpenLogin = () => setShowLoginPopup(true);
  //const handleCloseLogin = () => setShowLoginPopup(false);
  //const handleOpenPassword = () => setShowPasswordPopup(true);
  //const handleClosePassword = () => setShowPasswordPopup(false);
  //const handleOpenQR = () => setShowQRPopup(true);
  //const handleCloseQR = () => setShowQRPopup(false);

  // obtains a result from handleLoginButtonClick and passes to clickresult
  //const handleLoginButtonClick = (result) => {
  //  setClickResult(result);
  //  alert({clickResult});
  //};

  //function handleloginclick (){
  //  console.log('handleloginclick entered')
  //  setClickResult(output);
  //  alert('hi');
  //}

  //pushes handleLoginButtonClick into LoginForm as onDataSend <LoginForm onDataSend={handleLoginButtonClick} />
  return (
    <div>
      <WebLogin />
    </div>
  )
}

export default App
