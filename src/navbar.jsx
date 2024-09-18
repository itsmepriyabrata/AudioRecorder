import { useState } from "react";
import React, { useEffect } from 'react';
import axios from "axios";
import image from './user.jpg';
import { Link } from 'react-router-dom';

const NavBar = () => {
    // Initialize user as an empty object
    let [user, setUser] = useState({});

    const getUser = async () => {
        try {
            const response = await axios.get("https://recorder-back-7sml.onrender.com/login/success", { withCredentials: true });
            const userDa = response.data.user;
            localStorage.setItem('user', JSON.stringify(userDa));
            setUser(JSON.parse(localStorage.getItem('user')));
        } catch (error) {
            console.log("error", error);
        }
    };

    // Fetch user data on component mount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        // Check if userData exists and is not empty
        if (userData && Object.keys(userData).length !== 0) {
            setUser(userData);
        } else {
            console.log("Fetching user data");
            getUser(); // Fetch user data if not found in localStorage
        }
        console.log(user);
    }, []); // Add an empty dependency array to run this effect only once on mount

    return (
        <div className="-m-8 max-h-[768px] w-[calc(100%+48px)] overflow-hidden mt-2">
            <nav x-data="{ open: false }" className="flex h-auto w-3/4 mx-auto bg-white shadow-lg rounded-lg justify-between md: h-16 border-[white] border-2 border-solid rounded-3xl">
                <div className="flex px-6 w-1/2 items-center font-semibold md:w-1/5 md:px-1 md:flex md:items-center md:justify-center text-[black]">
                    {Object.keys(user).length !== 0 ? (
                        <Link 
                            to="/dashboard"
                            className={`flex items-center space-x-4 ${window.location.pathname === '/dashboard' ? 'text-[blue]' : ''}`}
                        >
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
                <div className="flex px-6 w-1/2 items-center font-semibold md:w-1/5 md:px-1 md:flex md:items-center md:justify-center text-[black]">
                    <Link to="/" className={`flex items-center space-x-4 ${window.location.pathname === '/' ? 'text-[blue]' : ''}`}>
                        Recorder
                    </Link>
                </div>
                <div className="flex px-6 w-1/2 items-center font-semibold md:w-1/5 md:px-1 md:flex md:items-center md:justify-center text-[black]">
                    <Link to="/rewards" className={`flex items-center space-x-4 ${window.location.pathname === '/rewards' ? 'text-[blue]' : ''}`}>
                        Rewards
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default NavBar;
