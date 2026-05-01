import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import HospitalList from '../HospitalList/HospitalList'

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Profile = ({ user, hospitals }) => {
  const classes = useStyles();

  const [hospitalName, setHospitalName] = useState('');

  let startingHospitals = user.hospitals;

  const addHospital = () => {

    fetch('http://localhost:5000/users/update', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        '_id': user._id,
        'hospitals': [...startingHospitals, hospitalName]
      })
    }).then(res => res.json())
  };

  return (
    <div className="profile">
      <div className="grid">
        <h2>Felhasználónév:</h2>
        <p>{user.userName}</p>
      </div>

      <div className="hosp-container">
        <h2>Kórházak:</h2>
        {user.hospitals && user.hospitals.map(hosp =>
          <p key={uuidv4()}>{hosp}</p>
        )}
      </div>

      <HospitalList hospitals={hospitals} hospitalName={hospitalName} setHospitalName={setHospitalName} />

      <Button type='button' fullWidth variant='contained' color='primary' onClick={() => addHospital()} className={classes.submit}>
        Küldés
      </Button>
    </div>
  )
}

export default Profile
