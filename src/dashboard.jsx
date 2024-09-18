import React, { useState, useEffect } from 'react';
import axios from 'axios';
import image from './user.jpg';
import Navbar from './navbar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [editableUser, setEditableUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [recordings, setRecordings] = useState([]);
    const [totalAudioDuration, setTotalAudioDuration] = useState(0);
    const [totalVideoDuration, setTotalVideoDuration] = useState(0);
    const [points, setPoints] = useState(0);
    const[audioPoints,setAudioPoints]=useState(0);
    const[videoPoints,setVideoPoints]=useState(0); 
    const totalDownloads = recordings
    .filter(recording => recording.User_ID === user.googleID)
    .reduce((sum, recording) => sum + (recording.Downloads || 0), 0);
    const userRecordingsCount = recordings.filter(recording => recording.User_ID === user.googleID).length;
    const navigate = useNavigate();

    const openPasswordChangeWindow = () => {
        const newWindow = window.open('', 'Change Password', 'width=500,height=400');
        newWindow.location = `${window.location.origin}/password`;
    };
    const logout = () => {
        navigate('/logout');
    };
    const getUser = async() =>{
        try{
            const response = await axios.get("https://recorder-back-7sml.onrender.com/login/success",{withCredentials:true})
            console.log(response.data.user);
            const userDa = response.data.user;
            console.log(userDa);
            localStorage.setItem('user', JSON.stringify(userDa));
            console.log("User data stored in local storage",JSON.parse(localStorage.getItem('user')));
            setUser(JSON.parse(localStorage.getItem('user')))
            setEditableUser(JSON.parse(localStorage.getItem('user')))
            console.log(editableUser);
        }catch(error){
            console.log("error",error)
        }
    }
    // Fetch user data on component mount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        console.log(userData);
        // Check if userData exists and has keys
        if (Object.keys(userData).length !== 0) {
          setUser(userData);
          setEditableUser(userData);    
        } else {
          console.log("Fetching user data");
          getUser(); // Assuming getUser is a function that fetches user data
        }
        console.log(user);
        axios.get('https://recorder-back-7sml.onrender.com/data')
            .then(response => {
                const modifiedData = response.data.map(item => ({
                    ...item,
                    filePath: item.filePath.replace(/\\/g, '/')
                }));
                setRecordings(modifiedData);
                const audioDuration = modifiedData
                .filter(recording => recording.User_ID === userData.googleID && recording.mediatype === 'audio')
                .reduce((sum, recording) => sum + recording.Duration, 0);

                const videoDuration = modifiedData
                    .filter(recording => recording.User_ID === userData.googleID && recording.mediatype === 'video')
                    .reduce((sum, recording) => sum + recording.Duration, 0);

                setTotalAudioDuration(audioDuration);
                setTotalVideoDuration(videoDuration);

            // Calculate points
                
                console.log(Math.floor(audioDuration / 60) * 5);
                setAudioPoints(Math.floor(audioDuration/ 60) * 1);
                setVideoPoints(Math.floor(videoDuration / 60) * 5);
                setPoints(audioPoints + videoPoints);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    // Handle changes in user details
    const handleChange = (e) => {
        setIsEditing(true);
        setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
    };

    // Handle update action
    const handleUpdate = async () => {
        try {
            const response = await axios.post("https://recorder-back-7sml.onrender.com/updateUser", editableUser);
            setUser(editableUser);
            setIsEditing(false);
            localStorage.setItem('user', JSON.stringify(editableUser));
            console.log('User updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };
    const [showFullEmail, setShowFullEmail] = useState(false);

    // Function to toggle the state
    const toggleEmailVisibility = () => {
        setShowFullEmail(!showFullEmail);
    };

    // Function to obfuscate the email
    const obfuscateEmail = (email) => {
        if (!email) return '';
        const emailParts = email.split('@');
        if (emailParts.length < 2) return email; // Handle invalid email
        const domain = emailParts[1];
        return `${email.slice(0, 2)}****@****.${domain.slice(domain.lastIndexOf('.') + 1)}`;
    };
    // Handle cancel action
    const handleCancel = () => {
        setEditableUser(user);
        setIsEditing(false);
    };

    const userRecordings = {
        audio: recordings.filter(recording => recording.User_ID === user.googleID && recording.mediatype === 'audio').length,
        video: recordings.filter(recording => recording.User_ID === user.googleID && recording.mediatype === 'video').length,
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar/>
        <div className="flex flex-col h-[85vh] mt-14">
            <div className="w-[full] bg-white p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">User Details</h2>
                {editableUser && (
                    <div>
                                    <div className="flex justify-center mb-4">
                <img 
                    src={editableUser?.image || image} 
                    alt="User Profile" 
                    className="w-25 h-50 rounded-3xl border-solid border-[black] border-[1px]"
                />
            </div>
                        <label className="block mb-2 font-semibold">Name</label>
                        <input 
                            type="text" 
                            name="displayName" 
                            value={editableUser.displayName} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded mb-4" 
                        />
            <label className="block mb-2 font-semibold">Email</label>
            <div className="flex items-center">
                <input
                    type="email"
                    name="email"
                    value={showFullEmail ? editableUser.email : obfuscateEmail(editableUser.email)}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-1"
                    disabled
                />
                <button
                    type="button"
                    onClick={toggleEmailVisibility}
                    className="ml-2 p-2 border rounded"
                >
                    {showFullEmail ? 'Hide' : 'Show'}
                </button>
            </div>
                        {/* Update and Cancel Buttons */}
                        {isEditing && (
                            <div className="flex justify-between">
                                <button 
                                    onClick={handleUpdate} 
                                    className="bg-blue-500 text-white py-2 px-4 rounded"
                                >
                                    Update
                                </button>
                                <button 
                                    onClick={handleCancel} 
                                    className="bg-gray-500 text-white py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
    <div className='flex-1 flex'>
            <button className="ml-15 mt-5 w-[150px] bg-[rgb(255,255,255,0.9)] border-solid border-[1px] border-[black] text-[black] rounded-md py-1 px-3 font-semibold text-[16px] h-[50px]" onClick={openPasswordChangeWindow}>Edit Password</button>
            <Link to="/logout" className={`flex items-center space-x-4`}>
      <button className="ml-10 mt-5 w-[150px] bg-[rgb(255,255,255,0.9)] border-solid border-[1px] border-[black] text-[black] rounded-md py-1 px-3 font-semibold text-[16px] h-[50px]" onClick={logout}>Logout</button>
      </Link>
                    </div>
                        <div className='flex flex-row mt-2'>
                        <div className='flex-1 border-[black] border-[solid] border-[1px] text-center font-nunito text-[18px] h-[75px] mr-5 rounded-xl semibold'>
                            <h5>Recordings</h5><span>{userRecordingsCount}</span>
                            </div>
                            <div className="flex-1 border-[black] border-[solid] border-[1px] text-center font-nunito text-[18px] h-[75px] rounded-xl semibold">
                                <h5 className="mt-50">Downloads</h5>
                                <span>{totalDownloads}</span>
                            </div>
                            </div>
                            <div className='flex flex-row mt-2'>
                    <div className='flex-1 border-[black] border-[solid] border-[1px] text-center font-nunito text-[18px] h-[75px] mr-5 rounded-xl semibold'>
                            <h5>Audio Points</h5><span>{audioPoints}</span>
                            </div>
                            <div className="flex-1 border-[black] border-[solid] border-[1px] text-center font-nunito text-[18px] h-[75px] rounded-xl semibold">
                                <h5 className="mt-50">Video Points</h5>
                                <span>{videoPoints}</span>
                            </div>
                            </div>
                            <div className='flex flex-row mt-2'>
                    <div className='flex-1 border-[black] border-[solid] border-[1px] text-center font-nunito text-[18px] h-[75px] mr-5 rounded-xl semibold'>
                            <h5>Audio Duration</h5><span>{totalAudioDuration} Seconds </span>
                            </div>
                            <div className="flex-1 border-[black] border-[solid] border-[1px] text-center font-nunito text-[18px] h-[75px] rounded-xl semibold">
                                <h5 className="mt-50">Video Duration</h5>
                                <span>{totalVideoDuration} Seconds </span>
                            </div>
                    </div>

                    </div>
                )}
            </div>

            {/* Right Side - Recordings Table */}
    <div className="flex flex-col w-[100%] bg-white p-8 shadow-lg">
    {/* <div className='flex-1'>
                        
                    </div> */}
    <div className="flex-1">
    <h2 className="text-2xl font-bold mb-4">Your Recordings</h2>
    <div className="overflow-x-auto max-h-[65vh]">
        <table className="min-w-full table-auto border-collapse">
            <thead>
                <tr>
                    <th className="px-4 py-2 border">Language</th>
                    <th className="px-4 py-2 border">Transcript</th>
                    <th className="px-4 py-2 border">Downloads</th>
                    <th className="px-4 py-2 border">Media Type</th>
                    <th className="px-4 py-2 border">Duration (Seconds)</th>
                    <th className="px-4 py-2 border">Media</th>
                </tr>
            </thead>
            <tbody>
                {recordings.map((recording) => (
                    recording.User_ID === user.googleID && (
                        <tr key={recording._id}>
                            <td className="px-4 py-2 border">{recording.language}</td>
                            <td className="px-4 py-2 border">{recording.transcript}</td>
                            <td className="px-4 py-2 border text-center">{recording.Downloads}</td>
                            <td className="px-4 py-2 border">{recording.mediatype}</td>
                            <td className="px-4 py-2 border text-center">{recording.Duration}</td>
                            <td className='text-center px-4 py-2 border'>
                                    {recording.mediatype === 'audio' ? (
                                        <audio controls src={recording.filePath} className="my-2" />
                                    ) : (
                                        <a href={recording.filePath} target="_blank" rel="noopener noreferrer">
                                            View Video
                                        </a>
                                    )}
                                </td>
                        </tr>
                    )
                ))}
            </tbody>
        </table>
    </div>
    </div>
</div>

        </div>
        </div>
    );
};

export default Dashboard;
