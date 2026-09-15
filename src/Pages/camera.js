
import { createContext, useContext, useState,useCallback, useRef, useEffect } from "react";
import Webcam from 'react-webcam';
import {Snackbar, Alert, Box, Typography} from '@mui/material/';
import '../App.css';
import { useContextData } from "../Context/contextData";


export const cameraContextData = createContext("");


const ContextWebcamVideo = (props) => {
  
  //initalising all variables and states that will be used
  const { Em,timer,blink_timer,ibi_timer} = useContextData();
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [autoRestart, setAutoRestart] = useState(true);  //flag for auto-restart
  const [intervalId, setIntervalId] = useState(null);
  const [delayId, setDelayId] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  let seqNumber = 0
  
  // Snackbar close handler when x is pressed this funtion is called to close snakebar
  const handleClose = () => {
    setOpen(false);
    if (autoRestart) {
      handleStartRecording();
    }
  };
//if capturing is true gets the predictions of 1 or 0 if 1 then it means your ibi over the 5 min(or specified byt user) is not normal 
//and so a 20 sec timer (or specified by user) is initiated and stoped automatically once it has finsished. this is done every 20 min (or specified by user)
  useEffect(() => {
    if (capturing) {
      const Did = setInterval(async () => {
        try {
          const url = new URL('http://127.0.0.1:5000/get_predictions');
          url.searchParams.append('email', Em);
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.start_timer == 1) {
            setMessage('TAKE A BREAK');
            setOpen(true);
            stopRecording();
            setSeverity('warning');
            setAutoRestart(false); 
            
            const timer1 = setTimeout(() => {
                setOpen(false);
              }, (timer*1000));
        
             //timer*1000
              return () => clearTimeout(timer1);
           
          }
        } catch (error) {
          setMessage(`Error: ${error.message}`);
        }
      }, (ibi_timer*1000*60));
      setDelayId(Did);
      return () => clearInterval(Did);
    }
  }, [capturing, Em]);

  // Start recording blink_timer *60*1000
  //after every 5 min (or specified by user) recoridng  post the video to the backend for processing
  const handleStartRecording = () => {
    setCapturing(true);
    setAutoRestart(true);
    handleStartCaptureClick();
    const id = setInterval(() => {
      
      stopAndDownloadRecording();
    }, (blink_timer*1000*60));
    setIntervalId(id);
  };

  // Stop recording ibi_timer*60*1000
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };
//stops the recording calls the function that has the post request logic and restarts recoriding once again
  const stopAndDownloadRecording = () => {
    stopRecording();
    handleDownload();
    setRecordedChunks([]);
    if (autoRestart) {
      handleStartRecording();
    }
  };

  //stores recorded chucks in a list
  const handleDataAvailable = useCallback(({ data }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  }, []);

//function that is starting the actual recording
  const handleStartCaptureClick = useCallback(() => {
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/mp4',
    });
    mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
    mediaRecorderRef.current.start();
    console.log("started the recording")
  },[handleDataAvailable]);

  //stops the whole thing like the recoriding and break timer for when the user wants to stop using the apps main feature
  const handleStopCaptureClick = useCallback(() => {
    setCapturing(false);
    setAutoRestart(false);  // Explicitly prevent auto-restart
    clearInterval(intervalId);
    stopRecording();
  });
  seqNumber=seqNumber+1

  //post request for sending the vedio to the backend
  const handleDownload = useCallback(() => {
    console.log("recordedChunks", recordedChunks.length);
  
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/mp4' }); // Use webm format
      const filename = `recordedVideo${seqNumber++}.mp4`; // Use .webm extension
      const formData = new FormData();
      formData.append('file', blob, filename);
      formData.append("email", Em);
      
      // Send video data to backend
      fetch('http://127.0.0.1:5000/video_recording', {
        method: 'POST',
        body: formData,
      }).then(response => response.json())
        .then(data => console.log('Video uploaded:', data))
        .catch(err => console.error('Error uploading video:', err));
    } else {
      console.warn('No chunks to upload.');
    }
  }, [recordedChunks]);

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, [intervalId]);


  return (
    //makes the values specified available to other compontents outiside the context
    <div>
      <cameraContextData.Provider
        value={{
          handleDataAvailable, 
          handleStartCaptureClick, 
          handleStopCaptureClick, 
          stopRecording,
          capturing,
          handleStartRecording,
        }}>
        {props.children}
      </cameraContextData.Provider>
      {/* displayes webcame */}
      <div className="corner-div">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="300"
        />
      </div>

      {/* break time alert shown via snakebar */}
      <Snackbar
        open={open}
        autoHideDuration={20000}
        onClose={handleClose}
        anchorOrigin={{ 
          vertical: 'top', 
          horizontal: 'center' 
        }}
      >
        <Box
          border='2px solid grey'
          display='flex'
          alignItems='center'
          bgcolor="grey"
          sx={{
            width: '80%',
            height: 'auto',
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          <Alert onClose={handleClose} severity={severity}>
            <Typography
              fontSize={20}
              display='flex'
              alignItems='center'
              justifyContent='center'
              color='black'
            >
              {message}
            </Typography>
          </Alert>
        </Box>
      </Snackbar>
    </div>
  );
}

export const useCameraContextData = () => useContext(cameraContextData);
export default ContextWebcamVideo;
