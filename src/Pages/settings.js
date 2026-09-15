import '../App.css';
import {useContextData} from "../Context/contextData"
import React, { useState, useEffect } from 'react';
import { Button, Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
// Imports Material-UI components used for building the form UI


//sends the options selected for the diffrent components to the set_set api

export default function Settings() {
  const {Em, email,setBlink_timer,settimer,setIbi_timer}= useContextData();
  // Retrieves context data and functions: `Em` (email), `email` (user email), and setter functions for timers.

  //initalises variable data with a dictionary of data that will be sent to back end 
  const [data, setData] = useState(
  {
      email: Em,
      timer: "",
      blink_timer: "",
      ibi_timer: ""
    }
  );
  

   //handleChange is used to update the component’s state (data) whenever an input field changes.
  const handleChange = (e) => {
    setData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }
  //asynchronouse funtion when called sends a post request to the backend with all the inputed data.
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const url = 'http://127.0.0.1:5000/set_settings';
    
    const postSetting = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify(data),
      
    };
  
    try {
      const response = await fetch(url, postSetting);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
        throw new Error(errorData.message);
      }
      const result = await response.json();
      console.log("Settings updated:", result);
    } catch (error) {
      console.error("Error while submitting settings:", error);
    }
  };


// code to get user settings data
const [userSettings, setUserSettings] = useState({
  userTimer: "",
  userBlinkTimer:"",
  userIbiTimer:""
})



//if any of the following values are changed the getUserSetting asynchrouse funtion will be called -->[Em,setBlink_timer,setIbi_timer,settimer,setUserSettings,userSettings]
//parameterised get request the get the settings of the user specified by the email.
useEffect(() => {
  const getUserSettings = async () => {
  try {
  const url = new URL('http://127.0.0.1:5000/users_settings'); 
  url.searchParams.append('email', Em);
  const response =  await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');}
  const settingsData = await response.json()

  
  setUserSettings({
   
  userTimer: settingsData.timer,
  userBlinkTimer:settingsData.blink_timer,
  userIbiTimer: settingsData.ibi_timer
  })
  
  setBlink_timer(parseInt(settingsData.blink_timer, 10))
  settimer(parseInt(settingsData.timer, 10))
  setIbi_timer(parseInt(settingsData.ibi_timer, 10))
 
} 

catch(err) {
  return err;
}
  }
  getUserSettings()
  
}, [Em,setBlink_timer,setIbi_timer,settimer,setUserSettings,userSettings]);





  // fetch user setting data code finish

    return (
//toggles so user can select settings that are allowed.

      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', width: '300px', margin: 'auto', mt: 5 }} onSubmit={handleSubmit}>
        <Typography variant="h6">Select your settings {email}</Typography>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="select-label">timer: {userSettings.userTimer} </InputLabel>
          
          <Select
            labelId="select-label"
            name="timer"
            // displays the users current settings
            value={data.timer}
            onChange={handleChange} 
            label="timer"
          >
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="20">20</MenuItem>
            <MenuItem value="30">30</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="select-label">blink timer: {userSettings.userBlinkTimer}</InputLabel>
          <Select
            labelId="select-label"
            name="blink_timer"
            // displays the users current settings
            value={data.blink_timer}
            onChange={handleChange}
            label="blink_timer"
          >
            
            <MenuItem value="5">5</MenuItem>
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="15">15</MenuItem>
          </Select>
          
        </FormControl>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="select-label">ibi timer: {userSettings.userIbiTimer}</InputLabel>
          <Select
            labelId="select-label"
            name="ibi_timer"
            // displays the users current settings
            value={data.ibi_timer}
            onChange={handleChange}
            label="ibi_timer"
          >
            <MenuItem value="20">20</MenuItem>
            <MenuItem value="25">25</MenuItem>
            <MenuItem value="30">30</MenuItem>
          </Select>
        </FormControl>
        
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    );
  };