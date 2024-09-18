import { useState, useEffect } from "react";
import React from 'react';
import axios from "axios";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import * as XLSX from "xlsx";
import Navbar from './navbar';

const MarketPlace = () => {
    const [data, setData] = useState([]);
    const [user, setUser] = useState(null);
    const [languageFilter, setLanguageFilter] = useState("");
    const [phraseFilter, setPhraseFilter] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [mediaType, setMediaType] = useState('audio'); // State to toggle between audio and video
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user')) ;
        console.log(userData)
        if (Object.keys(userData).length !== 0) {
            setUser(userData);
        } 
        console.log(user)
    }, []);
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredMediaData);
        }
        setIsAllSelected(!isAllSelected);
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('https://recorder-back-7sml.onrender.com/data');
            const modifiedData = response.data.map(item => ({
                ...item,
                filePath: item.filePath.replace(/\\/g, '/')
            }));

            setData(modifiedData);
        } catch (error) {
            console.error('There was an error fetching the data!', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSelectItem = (item) => {
        setSelectedItems(prev => {
            const isSelected = prev.some(selectedItem => selectedItem._id === item._id);
            if (isSelected) {
                return prev.filter(selectedItem => selectedItem._id !== item._id);
            } else {
                return [...prev, item];
            }
        });
    };

    const handleConfirmPurchase = async () => {
        const zip = new JSZip();
        const mediaPromises = selectedItems.map(async (item) => {
            try {
                const response = await fetch(item.filePath);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${item.filePath}`);
                }
                const blob = await response.blob();
                if (mediaType == "video"){
                    zip.file(`${item.language}-${item._id}.mp4`, blob);
                }
                else{
                    zip.file(`${item.language}-${item._id}.mp3`, blob);
                }
            } catch (error) {
                console.error('Error fetching media file:', error);
            }
        });

        await Promise.all(mediaPromises);

        const worksheet = XLSX.utils.json_to_sheet(selectedItems.map(item => ({
            id: item._id,
            Transcript: item.transcript,
            Language: item.language
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Items");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        zip.file("selected_items.xlsx", new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "files.zip");

        try {
            await fetch('https://recorder-back-7sml.onrender.com/update-downloads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemIds: selectedItems.map(item => item._id) })
            });
            await fetchData(); // Re-fetch data to update download counts
        } catch (error) {
            console.error('Error updating download counts:', error);
        }

        setIsAllSelected(false);
        setSelectedItems([]);
        setTotalCost(0);
    };

    useEffect(() => {
        setTotalCost(selectedItems.length);
    }, [selectedItems]);

    const filteredData = data.filter(item => {
        return (
            (languageFilter === "" || item.language.toLowerCase().includes(languageFilter.toLowerCase())) &&
            (phraseFilter === "" || item.phrase.toLowerCase().includes(phraseFilter.toLowerCase()))
        );
    });

    const handleToggleMediaType = () => {
        setMediaType(prev => (prev === 'audio' ? 'video' : 'audio'));
        setSelectedItems([]);
        setIsAllSelected(false);
        
    };

    const filteredMediaData = filteredData.filter(item => item.filePath.endsWith(mediaType === 'audio' ? '.mp3' : '.mp4'));

    return (
            <div className="-m-8 mt-2 max-h-[768px] w-[100%] overflow-x-hidden overflow-y-hidden">
                <Navbar/>
            <div className="mx-auto my-auto mt-16 w-[95%] h-[100vh]">
                <h1>{mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} Table</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Filter by language"
                        value={languageFilter}
                        onChange={(e) => setLanguageFilter(e.target.value)}
                        className="p-2 border rounded mr-4"
                    />
                    <input
                        type="text"
                        placeholder="Filter by phrase"
                        value={phraseFilter}
                        onChange={(e) => setPhraseFilter(e.target.value)}
                        className="p-2 border rounded"
                    />
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="ml-5"
                    />
                    <label>Select All</label>
                    <button
                        onClick={handleToggleMediaType}
                        className="p-2 bg-black text-white rounded mt-2 ml-4"
                    >
                        Switch to {mediaType === 'audio' ? 'Video' : 'Audio'} Table
                    </button>
                </div>
                <div className="table-container overflow-y-auto max-h-[500px]">
                <table className="w-full text-sm text-left rtl:text-right text-white-500 dark:text-white">
                    <thead className="text-xs text-gray-700 uppercase bg-[blue] dark:bg-[gray] dark:text-white h-[50px]">
                        <tr>
                            <th></th>
                            <th>Language</th>
                            <th>Transcript</th>
                            <th>{mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}</th>
                            <th>Duration (seconds)</th>
                            <th>Download Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMediaData.map(item => (
                            <tr key={item._id} className="odd:dark:bg-[rgb(0,0,0,0.2)] even:dark:bg-[rgb((0,0,0,0.4)] border-b dark:border-gray-700 text-black" style={{ height: '70px' }}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.some(selectedItem => selectedItem._id === item._id)}
                                        onChange={() => handleSelectItem(item)}
                                    />
                                </td>
                                <td>{item.language}</td>
                                <td>{item.transcript}</td>
                                <td>
                                    {mediaType === 'audio' ? (
                                        <audio controls src={item.filePath} className="my-2" />
                                    ) : (
                                        <a href={item.filePath} target="_blank" rel="noopener noreferrer">
                                            View Video
                                        </a>
                                    )}
                                </td>
                                <td><p className="text-black bold ml-12 text-[14px]">{item.Duration}</p></td>
                                <td><p className="text-black bold ml-12 text-[14px]">{item.Downloads}</p></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                <div className="mb-4 flex items-center">
                    <p className="mt-2 mr-4">Total Cost: ${totalCost}</p>
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

export default MarketPlace;
