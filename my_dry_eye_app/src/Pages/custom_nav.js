
import { useState } from 'react';
import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

//function to navigate to diffrent pages

const useCustomNavigation = () => {
    const [navigateTo, setNavigateTo] = useState(null);
    const navigate = useNavigate();
  
    // Effect to navigate when `navigateTo` changes
    React.useEffect(() => {
      if (navigateTo) {
        navigate(navigateTo);
        setNavigateTo(null); // Reset state after navigation
      }
    }, [navigateTo, navigate]);
  
    const handleNavigation = (path) => {
      setNavigateTo(path);
    };
  
    return handleNavigation;
  };
  
  export default useCustomNavigation;