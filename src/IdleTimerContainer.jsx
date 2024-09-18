import React, { useRef } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useNavigate } from 'react-router-dom';

function IdleTimerContainer() {
  const navigate = useNavigate();
  const idleTimerRef = useRef(null);

  const onIdle = () => {
    // Clear user session or toke
    
    // Redirect to the login page
    navigate('/logout');
  };

  const handleActive = () => {
    console.log('User is active');
  };

  const handleIdle = () => {
    console.log('User is idle');
  };

  useIdleTimer({
    ref: idleTimerRef,
    timeout: 1000 * 60*5,
    onIdle: onIdle,
    onActive: handleActive,
    onAction: handleIdle,
    debounce: 500
  });

  return<div></div>;
}

export default IdleTimerContainer;
