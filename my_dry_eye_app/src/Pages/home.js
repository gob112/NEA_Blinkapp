
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { React} from 'react';
import '../App.css';
import { useState } from 'react';

import {useContextData} from "../Context/contextData"
import useCustomNavigation from './custom_nav';
//Importing a custom hooks -->functions that let you “hook into” React state and lifecycle features, a custom hook is just a function that you can use later on.

//page the user sees when they first open the app
function HomePage() {
  
  const navigate = useCustomNavigation();

  // Retrieves variables and functions from the useContextData hook to manage state
  const {flag, changeFlag, changeEmail,email} = useContextData()
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); 
        navigate('/blink'); 
      } else {
        setError('Login failed.');
      }
    } catch (err) {
      setError('Server error. Try again later.');
    }
  };
  return (
    <div className="homepage">
    <h1>DRY EYES APP</h1>
   
    {/* if flag is 1 then display two buttons if not display enter email */}
    {!flag ? (
      
      <div className='buttons_stack'>
      <Button onClick={() => navigate('/profile')} variant="contained" >Create Profile</Button>
      <Button onClick={changeFlag} variant="contained" >Already a user</Button>
      </div>):(
      
      <div>
      <TextField
            label="Enter email"
            variant="standard"
            onChange={changeEmail}
            fullWidth
          />
          <TextField
            label="Enter password"
            type="password"
            variant="standard"
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginTop: 2 }}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{ marginTop: 2 }}
          >
            Submit
          </Button>
      </div>)}
      
      </div>
  
  );
  
}

export default HomePage;