import React, { useState, useEffect } from 'react';
import axios from 'axios';
import image from './user.jpg';
import Navbar from './navbar';

const Rewards = () => {
    const [user, setUser] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalAudioDuration, setTotalAudioDuration] = useState(0);
    const [totalVideoDuration, setTotalVideoDuration] = useState(0);
    const [points, setPoints] = useState(0);
    const[audioPoints,setAudioPoints]=useState(0);
    const [recordings, setRecordings] = useState([]);
    const[videoPoints,setVideoPoints]=useState(0); 
    const [totalCost,setTotalCost] = useState(0);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const rewards = {
        1: { cost: 150, prize: "10$", description: "Gift card worth 10$" },
        2: { cost: 500, prize: "25$", description: "Gift card worth 20$" },
        3: { cost: 1000, prize: "50$", description: "Gift card worth 30$" },
        4: { cost: 1500, prize: "75$", description: "Gift card worth 40$" }
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user')) ;
        if (Object.keys(userData).length !== 0) {
            setUser(userData);
        }
        axios.get('http://localhost:6005/data')
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

                setTotalAudioDuration(840);
                setTotalVideoDuration(videoDuration);

            // Calculate points
                
                console.log(Math.floor(840/ 60) * 5);
                setAudioPoints(Math.floor(840/ 60) * 1);
                setVideoPoints(Math.floor(videoDuration / 60) * 5);
                setPoints(audioPoints + videoPoints); })
            const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust the width as needed
            };
        
            window.addEventListener('resize', handleResize);
            handleResize(); // Set the initial state
        
            return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSelectItem = (rewardId) => {
        setSelectedItems(prev => {
            const isSelected = prev.includes(rewardId);
            if (isSelected) {
                return prev.filter(id => id !== rewardId);
            } else {
                return [...prev, rewardId];
            }
        });
    };
    
    const handleConfirmPurchase = () => {
        const totalCost = selectedItems.reduce((total, rewardId) => total + rewards[rewardId].cost, 0);
        console.log(`Total Cost: ${totalCost}`);
        console.log('Purchased Rewards:', selectedItems.map(id => rewards[id]));
        setSelectedItems([]);
        setTotalCost(0);
    };

    useEffect(() => {
        const newTotalCost = selectedItems.reduce((total, rewardId) => total + rewards[rewardId].cost, 0);
        setTotalCost(newTotalCost);
    }, [selectedItems]);

    return (
         <div className="-m-8 mt-2 max-h-[100%] w-[100%] overflow-x-hidden overflow-y-hidden">
            <Navbar/>
            <div className="mx-auto my-auto mt-16 w-[95%] h-[100vh]">
                <div className="flex ml-8 mb-8">
                    <h2 className="text-lg">User Points: {user?.points || 0}</h2>
                </div>
                <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
                    {Object.keys(rewards).map(rewardId => (
                        <div key={rewardId} className="bg-white rounded shadow-lg w-[94%] border-[black] border-[solid] border-[2px] ml-8 my-2">
                            <div className="font-bold text-lg ml-2 mb-2">
                                Reward : {rewards[rewardId].prize}
                            </div>
                            <div className="text-gray-700 text-base ml-2 mb-4">
                                <p>Description: {rewards[rewardId].description}</p>
                                <p>Cost: {rewards[rewardId].cost} points</p>
                            </div>
                            <div className="text-gray-700 text-base w-[100%] mr-2 mb-4 flex justify-center">
                            <button
                                onClick={() => handleSelectItem(parseInt(rewardId))}
                                className={`p-2 rounded ${selectedItems.includes(parseInt(rewardId)) ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
                            >
                                {selectedItems.includes(parseInt(rewardId)) ? 'Remove' : 'Redeem Now'}
                            </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 ml-10">
                    <p>Total Cost: {totalCost} points</p>
                    <button
                        onClick={handleConfirmPurchase}
                        className="p-2 bg-black text-white rounded mt-2"
                        disabled={selectedItems.length === 0}
                    >
                        Confirm Purchase
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Rewards;
