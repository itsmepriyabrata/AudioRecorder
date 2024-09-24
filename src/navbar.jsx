import { useState } from "react";
import React, { useEffect } from 'react';
import axios from "axios";
import image from './user.jpg';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
    const [user, setUser] = useState({});
    const location = useLocation(); // Hook to get the current location (pathname)

    const getUser = async () => {
        try {
            const response = await axios.get("http://localhost:6005/login/success", { withCredentials: true });
            const userDa = response.data.user;
            localStorage.setItem('user', JSON.stringify(userDa));
            setUser(userDa); // No need to parse again
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            getUser();
        }
    }, []);

    const isActive = (path) => location.pathname === path ? 'text-[blue]' : ''; // Helper function for active link

    return (
        <div className="-m-8 max-h-[768px] w-[calc(100%+48px)] overflow-hidden mt-2">
            <nav className="flex h-auto w-3/4 mx-auto bg-white shadow-lg rounded-lg justify-between md:h-16 border-[white] border-2 border-solid rounded-3xl">
                
                {/* User Section */}
                <div className="flex px-6 w-1/2 items-center font-semibold md:w-1/5 md:px-1 md:flex md:items-center md:justify-center text-[black]">
                    {Object.keys(user).length !== 0 ? (
                        <Link to="/dashboard" className={`flex items-center space-x-4 ${isActive('/dashboard')}`}>
                            <img
                                src={user?.image || image}
                                alt="User Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <p className="ml-2">{user?.displayName}</p>
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="px-2 py-1 bg-blue-500 text-white rounded-md">
                                Login
                            </Link>
                            <Link to="/signup" className="px-2 py-1 bg-green-500 text-white rounded-md ml-2">
                                Signup
                            </Link>
                        </>
                    )}
                </div>

                {/* Recorder Link */}
                <div className="flex px-6 w-1/2 items-center font-semibold md:w-1/5 md:px-1 md:flex md:items-center md:justify-center text-[black]">
                    <Link to="/" className={`flex items-center space-x-4 ${isActive('/')}`}>
                        Recorder
                    </Link>
                </div>

                {/* Rewards Link */}
                <div className="flex px-6 w-1/2 items-center font-semibold md:w-1/5 md:px-1 md:flex md:items-center md:justify-center text-[black]">
                    <Link to="/rewards" className={`flex items-center space-x-4 ${isActive('/rewards')}`}>
                        Rewards
                    </Link>
                </div>

                {/* About Link */}
                <div className="flex px-6 w-1/2 items-center font-semibold md:w-1/5 md:px-1 md:flex md:items-center md:justify-center text-[black]">
                    <Link to="/about" className={`flex items-center space-x-4 ${isActive('/about')}`}>
                        About
                    </Link>
                </div>

                {/* Help Link */}
                <div className="flex px-6 w-1/2 items-center font-semibold md:w-1/5 md:px-1 md:flex md:items-center md:justify-center text-[black]">
                    <Link to="/help" className={`flex items-center space-x-4 ${isActive('/help')}`}>
                        Help
                    </Link>
                </div>

            </nav>
        </div>
    );
};

export default NavBar;
