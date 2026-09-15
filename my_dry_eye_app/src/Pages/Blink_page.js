import '../App.css';
import Button from '@mui/material/Button';
import useCustomNavigation from './custom_nav';
import {useContextData} from "../Context/contextData"
import  React,{useEffect} from 'react';
import { useCameraContextData } from './camera';

//Blink main page


function Blink() {
  const navigate = useCustomNavigation()
  const {email,setEmail,Em}= useContextData();
  const { handleStopCaptureClick,capturing,handleStartRecording } = useCameraContextData();
  

  // from email context goes to users API with email parameter to get name
  // with corresponding email and display it as header
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        // Construct the URL with query parameters
        const url = new URL('http://127.0.0.1:5000/users');
        url.searchParams.append('email', Em);

        // Fetch data from the Flask API
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
      
        setEmail(data.name);
       
      } catch (err) {
        return err;
        
      }
  }

    fetchUserName();
  }, [email]);

 
  
  return (
   
    <div className="App">
      <h1>welcome {email}</h1>
      
      <div className='buttons_stack'>

     {/* if the camare has started capturing video feed the stop button will be displayed otherwise the start button will be displayed */}

    {!capturing ? (
      <Button onClick={handleStartRecording} variant="contained" >start</Button>): 
      // handleStartRecording will start recording and sending videos every 5 min to the backend for processing

      (<Button onClick={handleStopCaptureClick} variant="contained" >stop</Button>)} 
      {/* handleStopCaptureClick will stop the whole recording and sending of data. */}
      
      <Button onClick={() => navigate('/stats')} variant="contained" >show stats</Button>
      <Button onClick={() => navigate('/settings')} variant="contained" >settings</Button>
      
      </div>
  </div>
   
  );
}

export default Blink;