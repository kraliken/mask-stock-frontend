import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import Homepage from './components/Homepage/Homepage'
import Profile from './components/Profile/Profile'
import Order from './components/Order/Order'
import Header from './components/Header/Header'
import OrderHistoryDemo from './components/OrderHistoryDemo/OrderHistoryDemo'
import './style/css/style.css'

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [user, setUser] = useState('')
  const [hospitals, setHospitals] = useState([])
  const [serverError, setServerError] = useState(false)
  const [hospitalsReady, setHospitalsReady] = useState(false)
  const [sessionReady, setSessionReady] = useState(!localStorage.getItem('sessionId'))
  const [slowLoad, setSlowLoad] = useState(false)

  const loading = !hospitalsReady || !sessionReady

  useEffect(() => {
    const timer = setTimeout(() => setSlowLoad(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  const checkedLoggedIn = () => {
    const sessionId = localStorage.getItem("sessionId")

    if (sessionId) {
      fetch(`${API_URL}/sessions`, {
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
        .finally(() => setSessionReady(true))
    }
  }

  useEffect(() => {
    checkedLoggedIn()
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/hospitals`)
      .then(response => response.json())
      .then(data => setHospitals(data))
      .catch(() => setServerError(true))
      .finally(() => setHospitalsReady(true))
  }, [])


  return (
    <Router>
      <div className='app'>
        <Header user={user} setUser={setUser} loading={loading} />

        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            gap: '12px',
            textAlign: 'center',
            padding: '0 1rem',
          }}>
            <CircularProgress />
            <p style={{ color: '#555', margin: 0 }}>Betöltés...</p>
            {slowLoad && (
              <p style={{ color: '#888', fontSize: '0.85rem', maxWidth: '400px', margin: 0, lineHeight: '1.5' }}>
                A szerver az ingyenes Render tárhelyen fut, és <strong>15 perc inaktivitás után alvó módba</strong> kerül.
                Az ébredés akár <strong>~1 percig</strong> is tarthat — kérlek, várj türelmesen!
              </p>
            )}
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
                {user ? <Profile user={user} hospitals={hospitals} /> : <Redirect to='/login' />}
              </Route>

              <Route path='/order'>
                {user ? <Order user={user} hospitals={hospitals} /> : <Redirect to='/login' />}
              </Route>

              <Route path='/orderhistory'>
                {user ? <OrderHistoryDemo user={user} /> : <Redirect to='/login' />}
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