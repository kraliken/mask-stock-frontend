import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '50%',
      },
    },
  },
}));

function HospitalList({ hospitals, hospitalName, setHospitalName }) {
  const classes = useStyles();

  return (
    <div className={classes.root} noValidate autoComplete="off">
      <TextField id="outlined-select-currency-native" select value={hospitalName} onChange={e => setHospitalName(e.target.value)} SelectProps={{ native: true, }} helperText="Kérjük, válasszon kórházat" variant="outlined" required>
        <option value="none">Válasszon</option>
        {hospitals && hospitals.map(hospital => <option key={hospital._id}>{hospital.name}</option>)}
      </TextField>
    </div>
  );
}

export default HospitalList;