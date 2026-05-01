import React from 'react'
import '../../style/css/header.css'

const Header = ({ user, setUser, loading }) => {

  const onLogoutClick = async (e) => {
    // Remove token from localStorage
    const sessionId = localStorage.getItem('sessionId');

    const response = await fetch('http://localhost:5000/sessions/logout', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'authentication': `${sessionId}`
      },
    })
    const logoutMsg = await response.json()

    if (logoutMsg.msg && logoutMsg.msg === "successful logout") {
      localStorage.removeItem('sessionId');
      window.location.href = '/login';
      setUser('')
    }
  }

  return (
    <div className='header'>
      <div className="logo-name-container">
        <img id="logo" src="./image/logo.jpg" alt="logo" />
        <h4>Mask Stock</h4>
      </div>

      {!loading && (
        user
          ? <>
            <a href='/profile'>Profil</a>
            <a href='/order'>Új rendelés</a>
            <a href='/orderhistory'>Rendelési előzmények</a>
            <div className="logo-name-container">
              <p>Bejelentkezve: {user.userName}</p>
              <p className="logout" onClick={onLogoutClick}>Kijelentkezés</p>
            </div>
          </>
          : <>
            <a href='/'>Főoldal</a>
            <a href='/login'>Bejelentkezés</a>
            <a href='/register'>Regisztráció</a>
          </>
      )}

    </div>
  )
}

export default Header
