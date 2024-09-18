import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const LogoutWrapper = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const logout = () => {
        // Perform your logout logic here
        console.log('Logging out...');
        localStorage.setItem('user', JSON.stringify({}));
        // Redirect after logout if needed
        navigate('/');
      };
  
      logout();
    }, [navigate]);
};

export default LogoutWrapper;