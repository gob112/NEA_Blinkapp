import {React} from 'react';
import {BrowserRouter, Route, Routes,NavLink} from "react-router-dom"
// Importing components from 'react-router-dom' to handle client-side routing.
//NavLink is used for navigation links

import ContextDataProvider from './Context/contextData';
import ContextWebcamVideo from './Pages/camera';
//both are custom context provider --->context are  feature that allows you to share data across the component tree 
//without having to pass props(variables and fucntions) down manually at every level.

import Settings from './Pages/settings';
import Profile from './Pages/profile';
import HomePage from './Pages/home';
import Blink from './Pages/Blink_page';
import CustomNavLink from './Pages/customNav';
import Stats from './Pages/statistics';

//main page to allow navigation and routing between pages
const App = () => {
  return (
    <div>

     <BrowserRouter> {/* Wrapping the entire application with BrowserRouter to enable routing functionality */}
     <ContextDataProvider> {/* Wrapping the main content with ContextDataProvider to provide global state to the whole app */}
     <ContextWebcamVideo > {/* Wrapping the main content with ContextWebcamVideo to provide webcam-related state  */}
     
        <header>
        {/* navigation links in the header for easy navigation */}
          <nav>
            <h1>Blink App</h1>
            <CustomNavLink to="/">Home</CustomNavLink>
            <NavLink to="/settings">settings</NavLink>
            <NavLink to="/blink">blink</NavLink>
            <NavLink to="/stats">stats</NavLink>
          </nav>
        </header>
        
        {/* specifing routes/which link renders which page */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/blink" element={<Blink />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
        </ContextWebcamVideo>
        </ContextDataProvider>
        </BrowserRouter>
        </div>
  );
};

export default App;