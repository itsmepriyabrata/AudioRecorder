import { useState } from 'react';
import image from './unsplash2.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const toggleForm = () => setIsLogin(!isLogin);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const endpoint = isLogin ? '/login' : '/signup';
      const data = { email, password };
      if (!isLogin) data.displayName = displayName;
  
      try {
        const response = await axios.post(`https://recorder-back-7sml.onrender.com${endpoint}`, data);
        console.log(response.data.created);
        if (response.data.token) {
          console.log(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          // Redirect to /recorder
          navigate('/');
        
        } 
        
        else if (response.data.created) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error:', error.response?.data || error.message);
      }
    };
  
    const LoginwithGoogle =()=>{
      window.open("https://recorder-back-7sml.onrender.com/auth/google/callback","_self")
    }
  
    
    return (
      <div className='bg-cover h-[100vh] pt-10 text-white' style={{backgroundImage: `url(${image})`}}>
        <div className='bg-[rgb(0,0,0,0.8)] h-[60vh] max-w-sm border py-4 px-6 mx-auto my-32 rounded-2xl w-[400px]'>
          {isLogin ? (
            <>
              <h2 className="text-center text-xl font-bold mb-4">Login</h2>
              <form onSubmit={handleSubmit}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-black w-full bg-[#ffff] hover:bg-[#ffff] focus:ring-4 focus:outline-none focus:ring-[#ffff]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between my-px mb-2" placeholder='Email' />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-black w-full bg-[#ffff] hover:bg-[#ffff] focus:ring-4 focus:outline-none focus:ring-[#ffff]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between my-2 mb-2" placeholder='Password'/>
              <button className="text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Log in
              </button>
              </form>
              <button onClick={LoginwithGoogle} type="button" className="text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-large rounded-lg text-sm px-5 py-2.5 text-[center] inline-flex items-center justify-between my-8 mb-2">
                <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>Login with Google
              </button>
              <p className="text-center">
                Don't have an account? <span className="text-[#4285F4] cursor-pointer" onClick={toggleForm}>Sign up</span>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-center text-xl font-bold mb-4">Sign Up</h2>
              <form onSubmit={handleSubmit}>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="text-black w-full bg-[#ffff] hover:bg-[#ffff] focus:ring-4 focus:outline-none focus:ring-[#ffff]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between my-2 mb-2" placeholder='Display Name' />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-black w-full bg-[#ffff] hover:bg-[#ffff] focus:ring-4 focus:outline-none focus:ring-[#ffff]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between my-2 mb-2" placeholder='Email' />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-black w-full bg-[#ffff] hover:bg-[#ffff] focus:ring-4 focus:outline-none focus:ring-[#ffff]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between my-2 mb-2" placeholder='Password'/>
              <button className="text-white w-full bg -[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Sign Up
              </button>
              </form>
              <button onClick={LoginwithGoogle} type="button" className="text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between my-8 mb-2">
                <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>Sign up with Google
              </button>
              <p className="text-center">
                Already have an account? <span className="text-[#4285F4] cursor-pointer" onClick={toggleForm}>Log in</span>
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

export default Login;
