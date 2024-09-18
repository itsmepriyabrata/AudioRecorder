import { useEffect } from "react";
import React, { useState } from 'react';
import axios from 'axios';
const PasswordChange = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user,setUser] = useState('');
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user')) ;
        console.log(userData)
        if (Object.keys(userData).length !== 0) {
            setUser(userData);
        } 
        console.log(user)
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword === confirmPassword) {
            const updatedUser = { ...user, password: newPassword };
            setUser(updatedUser);
            try {
                await axios.post("https://recorder-back-7sml.onrender.com/updateUser", updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                alert('Password changed successfully!');
                window.close(); // Close the window after the password is changed
            } catch (error) {
                console.error('Error updating user:', error);
                alert('Failed to change password.');
            }
        } else {
            alert('Passwords do not match. Please try again.');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default PasswordChange;
