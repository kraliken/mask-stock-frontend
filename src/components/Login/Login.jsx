import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import LockOpenIcon from '@material-ui/icons/LockOpen';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    marginTop: 20,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login({ checkedLoggedIn, user }) {
  const classes = useStyles();

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [response, setResponse] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;

  const login = () => {
    if (!loginUsername || !loginPassword) {
      setError(true)
      return
    }
    setError(false)
    setLoginFailed(false)

    fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: loginUsername,
        password: loginPassword,
      })
    }).then(res => res.json())
      .then(res => {
        if (res.msg) {
          setLoginFailed(true)
        } else {
          setResponse(res)
          localStorage.setItem('sessionId', res)
          checkedLoggedIn()
        }
      })
  };

  useEffect(() => {
    if (response) {
      window.location.href = '/';
    }
  }, [response]);

  return (
    <Container className="LoginContainer" component='main' maxWidth='xs'>
      <CssBaseline />

      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOpenIcon />
        </Avatar>

        <Typography className="LoginTypography" component='h1' variant='h5'>
          Bejelentkezés
        </Typography>

        <form className={classes.form} noValidate>
          <TextField variant='outlined' margin='normal' fullWidth id='userName' label='Felhasználónév' name='userName'
            onChange={(e) => setLoginUsername(e.target.value)} required />

          <TextField variant='outlined' margin='normal' fullWidth id='password' type='password' label='Jelszó' name='password'
            onChange={(e) => setLoginPassword(e.target.value)} required />

          <Button type='button' fullWidth variant='contained' color='primary' onClick={login} className={classes.submit}>
            Bejelentkezés
          </Button>
        </form>

        {error && (
          <Typography color='secondary'>
            Kérjük, töltse ki mindkét mezőt.
          </Typography>
        )}

        {loginFailed && (
          <Typography color='secondary'>
            Hibás felhasználónév vagy jelszó.
          </Typography>
        )}
      </div>

      <div>
        Nincs még fiókja? <a href='/register'>Regisztráljon!</a>
      </div>
    </Container>
  );
}
