import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import HospitalList from '../HospitalList/HospitalList'

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

function Register({ hospitals }) {
  const classes = useStyles();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [error, setError] = useState(false);
  const [response, setResponse] = useState('');

  const register = () => {
    if (userName && password) {
      fetch('http://localhost:5000/registration', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: userName,
          password: password,
          hospitals: [hospitalName]
        })
      }).then(res => res.json())
        .then(res => setResponse(res.msg))
        .then(() => setError(false));
    } else setError(true);
  };

  useEffect(() => {
    if (response === 'Successful registration. Log in to continue.') {
      setTimeout(function () {
        window.location.href = '/login';
      }, 800);
    }
  }, [response]);

  return (
    <Container className="RegisterContainer" component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography className="LoginTypography" component='h1' variant='h5'>
          Regisztráció
        </Typography>

        {response ? <Typography color='secondary'>{response}</Typography> : ''}

        <form className={classes.form} noValidate>
          <TextField variant='outlined' margin='normal' fullWidth id='userName' label='Felhasználónév' name='userName'
            onChange={(e) => setUserName(e.target.value)} required />

          <TextField variant='outlined' margin='normal' fullWidth id='password' type='password' name='password' label='Jelszó'
            onChange={(e) => setPassword(e.target.value)} required />

          <HospitalList hospitals={hospitals} hospitalName={hospitalName} setHospitalName={setHospitalName} />

          <Button type='button' fullWidth variant='contained' color='primary' onClick={register} className={classes.submit}>
            Regisztráció
          </Button>
        </form>

        {error ? (
          <Typography color='secondary'>
            Kérjük, töltse ki az összes mezőt.
          </Typography>) : ('')}
      </div>

      <div>
        Már van fiókja? <a href='/login'>Jelentkezzen be!</a>
      </div>
    </Container>
  );
}

export default Register;