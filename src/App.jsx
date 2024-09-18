import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Recorder from './Recorder';
import Marketplace from './marketplace';
import Dashboard from './dashboard';
import Password from './password';
import Login from './login';
import Rewards from './rewards';

import LogoutWrapper from './LogoutWrapper';
import IdleTimerContainer from './IdleTimerContainer';
function App() {
  return(
  <Router>
    <IdleTimerContainer />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/recorder" element={<Recorder />} />
      <Route path="/rewards" element={<Rewards/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/logout" element={<LogoutWrapper />} />
      <Route path="/password" element={<Password/>}/>
      <Route path="/" element={<Recorder />} />
    </Routes>
  </Router>
  );
}

export default App;
