import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Recorder from './Recorder';
import Marketplace from './marketplace';
import Dashboard from './dashboard';
import Password from './password';
import Rewards from './rewards';
import LogoutWrapper from './LogoutWrapper';
import IdleTimerContainer from './IdleTimerContainer';
import Login from './login';
import About from './About';  // Ensure the path is correct
import Help from './Help';    // Ensure the path is correct
import backgroundImage from './BGpic.jpg';

function App() {
  return (
    <div className="App">
      <div
        className="login-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
        }}
      >
        <Router>
          <IdleTimerContainer />
          <Routes>
            <Route path="/" element={<Recorder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recorder" element={<Recorder />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/logout" element={<LogoutWrapper />} />
            <Route path="/password" element={<Password />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/about" element={<About />} />  {/* About Route */}
            <Route path="/help" element={<Help />} />    {/* Help Route */}
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
