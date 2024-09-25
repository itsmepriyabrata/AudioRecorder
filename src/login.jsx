import { useState } from 'react';
import image from './unsplash2.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const navigate = useNavigate();

    const toggleForm = () => setIsLogin(!isLogin);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/login' : '/signup';
        const data = { email, password };
        if (!isLogin) data.displayName = displayName;

        // Set base URL dynamically based on the environment
        const baseURL = process.env.NODE_ENV === 'production'
            ? 'https://recorder-back-7sml.onrender.com'
            : 'http://localhost:6005';

        try {
            const response = await axios.post(`${baseURL}${endpoint}`, data);
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setLoginSuccess(true);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else if (response.data.created) {
                navigate('/login');
            }
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
        }
    };

    const LoginwithGoogle = () => {
        const baseURL = process.env.NODE_ENV === 'production'
            ? 'https://recorder-back-7sml.onrender.com'
            : 'http://localhost:6005';
        window.open(`${baseURL}/auth/google/callback`, "_self");
    };

    return (
        <div className='bg-cover h-[100vh] pt-10 text-white' style={{ backgroundImage: `url(${image})` }}>
            <div className='bg-[rgba(0,0,0,0.8)] h-[60vh] max-w-sm border py-4 px-6 mx-auto my-32 rounded-2xl w-[400px]'>
                {loginSuccess ? (
                    <div className="text-center text-xl font-bold mb-4">
                        <p>You have logged in successfully!</p>
                    </div>
                ) : (
                    <>
                        {isLogin ? (
                            <>
                                <h2 className="text-center text-xl font-bold mb-4">Login</h2>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="text-black w-full bg-[#e0e0e0] hover:bg-[#ffffff] focus:ring-4 focus:outline-none focus:ring-[#ffffff]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between my-px mb-2"
                                        placeholder='Email'
                                    />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="text-black w-full bg-[#e0e0e0] hover:bg-[#ffffff] focus:ring-4 focus:outline-none focus:ring-[#ffffff]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between my-2 mb-2"
                                        placeholder='Password'
                                    />
                                    <button className="text-white w-full bg-[#7e57c2] hover:bg-[#5e35b1] focus:ring-4 focus:outline-none focus:ring-[#7e57c2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                        Log in
                                    </button>
                                </form>
                                <button
                                    onClick={LoginwithGoogle}
                                    type="button"
                                    className="text-white w-full bg-[#4285F4] hover:bg-[#357ae8] focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-large rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between my-8 mb-2"
                                >
                                    {/* SVG for Google icon */}
                                </button>
                                <p className="text-center">
                                    Don't have an account? <span className="text-[#4285F4] cursor-pointer" onClick={toggleForm}>Sign up</span>
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-center text-xl font-bold mb-4">Sign Up</h2>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="text-black w-full bg-[#e0e0e0] hover:bg-[#ffffff] focus:ring-4 focus:outline-none focus:ring-[#ffffff]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between my-2 mb-2"
                                        placeholder='Display Name'
                                    />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="text-black w-full bg-[#e0e0e0] hover:bg-[#ffffff] focus:ring-4 focus:outline-none focus:ring-[#ffffff]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between my-2 mb-2"
                                        placeholder='Email'
                                    />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="text-black w-full bg-[#e0e0e0] hover:bg-[#ffffff] focus:ring-4 focus:outline-none focus:ring-[#ffffff]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between my-2 mb-2"
                                        placeholder='Password'
                                    />
                                    <button className="text-white w-full bg-[#7e57c2] hover:bg-[#5e35b1] focus:ring-4 focus:outline-none focus:ring-[#7e57c2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                        Sign Up
                                    </button>
                                </form>
                                <p className="text-center">
                                    Already have an account? <span className="text-[#4285F4] cursor-pointer" onClick={toggleForm}>Log in</span>
                                </p>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;
