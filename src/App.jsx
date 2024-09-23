import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Recorder from './Recorder';
import Marketplace from './Marketplace';
import Dashboard from './Dashboard';
import Password from './Password';
import Rewards from './Rewards';
import LogoutWrapper from './LogoutWrapper';
import IdleTimerContainer from './IdleTimerContainer';
import Login from './Login';  // Ensure file names are capitalized consistently
import About from './About';
import Help from './Help';

import backgroundImage from './BGpic.jpg';  // Ensure this is the correct path to your image

function App() {
  return (
    <div className="App">
      {/* Background image applied to the container */}
      <div
        className="login-container"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <Router>
          <IdleTimerContainer />
          <Routes>
            {/* Define all your routes here */}
            <Route path="/" element={<Recorder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recorder" element={<Recorder />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/logout" element={<LogoutWrapper />} />
            <Route path="/password" element={<Password />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
