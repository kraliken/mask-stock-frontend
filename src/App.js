import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import Homepage from './components/Homepage/Homepage'
import Profile from './components/Profile/Profile'
import Order from './components/Order/Order'
import Header from './components/Header/Header'
import OrderHistoryDemo from './components/OrderHistoryDemo/OrderHistoryDemo'
import './style/css/style.css'

function App() {
  const [user, setUser] = useState('')
  const [hospitals, setHospitals] = useState([])
  const [serverError, setServerError] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkedLoggedIn = () => {
    const sessionId = localStorage.getItem("sessionId")

    if (sessionId) {
      fetch('http://localhost:5000/sessions', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'authentication': `${sessionId}`
        },
        mode: "cors",
        cache: "no-cache",
      }).then(res => res.json())
        .then(data => setUser(data))
        .catch(() => setServerError(true))
    }
  }

  useEffect(() => {
    checkedLoggedIn()
  }, [])

  useEffect(() => {
    fetch('http://localhost:5000/hospitals')
      .then(response => response.json())
      .then(data => setHospitals(data))
      .catch(() => setServerError(true))
      .finally(() => setLoading(false))
  }, [])


  return (
    <Router>
      <div className='app'>
        <Header user={user} setUser={setUser} />

        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            gap: '16px',
          }}>
            <CircularProgress />
            <p style={{ color: '#555' }}>Betöltés...</p>
          </div>
        ) : (
          <>
            {serverError && (
              <div style={{
                background: '#d32f2f',
                color: '#fff',
                textAlign: 'center',
                padding: '12px 16px',
                fontSize: '0.95rem',
                fontFamily: '"Roboto", sans-serif',
              }}>
                A szerver jelenleg nem érhető el. Kérjük, ellenőrizze, hogy a backend fut-e, majd töltse újra az oldalt.
              </div>
            )}

            <Switch>
              <Route path='/register'>
                <Register hospitals={hospitals} />
              </Route>

              <Route path='/login'>
                <Login checkedLoggedIn={checkedLoggedIn} user={user} />
              </Route>

              <Route path='/profile'>
                <Profile user={user} hospitals={hospitals} />
              </Route>

              <Route path='/order'>
                <Order user={user} hospitals={hospitals} />
              </Route>

              <Route path='/orderhistory'>
                {user ? <OrderHistoryDemo user={user} /> : <Homepage />}
              </Route>

              <Route path='/'>
                <Homepage />
              </Route>
            </Switch>
          </>
        )}
      </div>
    </Router>
  );
}

export default App