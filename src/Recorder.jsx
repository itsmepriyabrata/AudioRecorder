import React, { useEffect, useState } from 'react';
import axios from "axios";
import Navbar from './navbar'; 
import { useReactMediaRecorder } from "react-media-recorder";

const ReactRecorder = () => {
  const [user, setUser] = useState(null);
  const [recordBlobLink, setRecordBlobLink] = useState('');
  const [language, setLanguage] = useState('English');
  const [transcript, setTranscript] = useState('');
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [timer, setTimer] = useState(null);
  const [otherLanguage, setOtherLanguage] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    video: isVideoMode, // Switch between audio and video based on mode
    onStop: (blobUrl, blob) => {
      if (isVideoMode) {
        setVideoBlobUrl(blobUrl);
      } else {
        setRecordBlobLink(blobUrl);
      }
    },
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && Object.keys(userData).length !== 0) {
      setUser(userData);   
    } else {
      console.log("Fetching user data");
      getUser();
    }
    const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust the width as needed
            };
        
    window.addEventListener('resize', handleResize);
    handleResize(); // Set the initial state
        
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartRecording = () => {
    console.log('Recording started');
    setRecordingDuration(0);
    startRecording();
    if (isVideoMode){ 
    setTimeout(() => {
      startTimer(); 
    }, 2000);
  }
  else{
    startTimer();
  }
  };
  
  const handleStopRecording = () => {
    stopRecording(); 
    stopTimer();
  };

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

  const startTimer = () => {
    setRecordingDuration(0);
    setTimer(setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000));
  };

  const stopTimer = () => {
    clearInterval(timer);
    setTimer(null);
  };

  const clearHandle = () => {
    setRecordBlobLink('');
    setRecordingDuration(0); 
  };

  const clearVideoHandle = () => {
    setVideoBlobUrl(null);
    setRecordingDuration(0);
  };

  const saveRecording = async () => {
    if (recordBlobLink && language && transcript) {
      const response = await fetch(recordBlobLink);
      const audioBlob = await response.blob();
      console.log("Save Recording");
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.mp3');
      formData.append('language', language === 'Other' ? otherLanguage : language);
      formData.append('user', user?.googleID || '');
      formData.append('transcript', transcript);
      formData.append('Downloads', 0);
      formData.append('Duration', recordingDuration);

      try {
        const response = await axios.post('https://recorder-back-7sml.onrender.com/saveRecording', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Saved successfully:', response.data);
      } catch (error) {
        console.error('Error saving recording:', error);
      }
      clearHandle();
    }
  };

  const saveVideoRecording = async () => {
    if (videoBlobUrl && language && transcript) {
      const response = await fetch(videoBlobUrl);
      const videoBlob = await response.blob();
      const formData = new FormData();
      formData.append('file', videoBlob, 'recording.mp4');
      formData.append('language', language === 'Other' ? otherLanguage : language);
      formData.append('user', user?.googleID || '');
      formData.append('transcript', transcript);
      formData.append('Downloads', 0);
      formData.append('Duration', recordingDuration);

      try {
        const response = await axios.post('https://recorder-back-7sml.onrender.com/saveRecording', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Video saved successfully:', response.data);
      } catch (error) {
        console.error('Error saving video recording:', error);
      }
      clearVideoHandle();
    } else {
      console.log('No video to save');
    }
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
  };

  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  const indianLanguages = [
    'Hindi',
    'English',
    'Tamil',
    'Telugu',
    'Marathi',
    'Gujarati',
    'Kannada',
    'Malayalam',
    'Punjabi',
    'Oriya',
    'Bengali',
    'Assamese',
    'Urdu',
    'Kashmiri',
    'Sanskrit',
    'Sindhi',
    'Maithili',
    'Konkani',
    'Manipuri',
    'Bodo',
    'Santhali',
    'Nepali',
    'Mizo',
    'Khasi',
    'Dogri',
    'Rajasthani',
    'Other'
  ];

  return (
    <div className='-m-8 mt-2 max-h-[100vh] w-[100%]'>
      <Navbar/>    <div
      className={`flex flex-col w-[100%] max-w-[144vh] py-6 px-6 ${
        isMobile ? 'ml-8' : 'mx-auto'
      } mt-12 h-[100%] rounded-3xl border-black border-solid border-[1px] border-2 shadow-[15px_15px_15px_rgba(0,0,0,0.6)]`}
    >
        <div className='flex-none w-[100%] h-[100%] py-4 px-6 mx-auto my-auto'>
          <div className='flex flex-col'>
            <button onClick={() => {setIsVideoMode(!isVideoMode);setRecordingDuration(0);clearHandle();
              clearVideoHandle();stopTimer();}} className="bg-[rgb(255,255,255,0.9)] mx-auto border-solid border-[1px] border-[black] text-[black] rounded-md font-semibold text-[16px] w-[18rem] max-w-[100vh]">
              Toggle to {isVideoMode ? 'Audio Recorder' : 'Video Recorder'}
            </button>
            <label htmlFor="language-select" className='text-[black] font-semibold'>Choose a language:</label>
            <select id="language-select" className="bg-[rgb(0,0,0,0.4) border-black border-solid border-2 ml-5 rounded-md text-[black] w-[10vh" value={language} onChange={handleLanguageChange}>
              {indianLanguages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            {language === 'Other' && (
              <input
                type="text"
                value={otherLanguage}
                onChange={(e) => setOtherLanguage(e.target.value)}
                placeholder="Enter language"
                className="bg-[rgb(255,255,255,0.4)] rounded-12 text-[black] mt-2 text-[1.8vh] h-[3vh] indent-1 border-[black] border-[1px] border-solid"
              />
            )}
            <textarea placeholder='Enter text to record here' value={transcript} onChange={(e) => setTranscript(e.target.value)} className="bg-[rgb(255,255,255,0.4)] rounded-12 text-[black] mt-2 text-[18px]  w-[100%] max-w-[100vh] h-[32vh] indent-1 border-[black] border-[1px] border-solid] mx-auto" />
          </div> 
        </div>
        {videoBlobUrl && (
          <div className="flex flex-col w-[100%] max-w-[1340px] h-[60px] px-2 mx-auto mt-10 mb-10">
            <div className="flex-none mx-auto my-auto">
              <button onClick={clearVideoHandle} className="ml-4 bg-[rgb(255,255,255,0.9)] mx-auto border-solid border-[1px] border-[black] text-[black] rounded-md py-1 px-3 font-semibold text-[16px]">
                Clear
              </button>
              <a href={videoBlobUrl} target="_blank" rel="noopener noreferrer">
                <button className="ml-5 mt-2 w-[150px] bg-[rgb(255,255,255,0.9)] mx-auto border-solid border-[1px] border-[black] text-[black] rounded-md py-1 px-3 font-semibold text-[16px]">View Video</button> 
              </a>
              <button id='savev' onClick={saveVideoRecording} className="ml-5 mt-2 w-[150px] bg-[rgb(255,255,255,0.9)] mx-auto border-solid border-[1px] border-[black] text-[black] rounded-md py-1 px-3 font-semibold text-[16px]">
                Save Recording
              </button>
            </div>
          </div>
        )}
        {recordBlobLink && (
  <div className="flex flex-col w-[100%] max-w-[1340px] h-[60px] px-2 mx-auto mt-10 mb-10">
  <div className="flex-none mx-auto">
  <button onClick={clearHandle} className="rgb(255,255,255,0.9)] mx-auto border-solid border-[1px] border-[black] text-[black] rounded-md py-1 px-3 font-semibold text-[16px]">
                                        Clear
                                    </button>
                                    </div>
                                    <div className="flex-none mx-auto mt-2 mb-2">
                                    <audio controls src={recordBlobLink}/> </div>
                                    <div className="flex-none mx-auto">
<button id='save' onClick={saveRecording} className="w-[150px] bg-[rgb(255,255,255,0.9)] mx-auto border-solid border-[1px] border-[black] text-[black] rounded-md py-1 px-3 font-semibold text-[16px]">
                                        Save Recording
                                    </button></div>
</div>
)}
{isVideoMode ? (         
     <div className='flex flex-row w-[100%] max-w-[1340px] h-[100px] mx-auto mt-5'>
            <div className="flex-none mx-auto my-auto"><p className="text-[black] font-semibold text-[3.2vh]">{formatDuration(recordingDuration)}</p></div>
            <div className="flex-none mx-auto my-auto"> <p className="text-[black] font-semibold text-[2.8vh] text-[red]">{status}</p></div>
      <div className="flex-none mx-auto my-auto">
        {status !== 'recording' ? (
          <button id='startv' onClick={handleStartRecording} className="bg-[rgb(255,255,255,0.9)] mx-auto border-solid border-[1px] border-[black] text-[black] rounded-md py-1 px-3 font-semibold text-[1.6vh]">
            Start Video
          </button>
        ) : (
          <button id='stopv' onClick={handleStopRecording} className="bg-[rgb(255,255,255,0.9)] mx-auto border-solid border-[1px] border-[black] text-[black] rounded-md py-1 px-3 font-semibold text-[1.6vh]">
            Stop Video
          </button>
        )}

      </div>
      </div>):(
        <div className='flex flex-row w-[100%] max-w-[1340px] h-[100px] mx-auto mt-5'>
            <div className="flex-none mx-auto my-auto">
              <p className="text-[black] font-semibold text-[3.2vh]">{formatDuration(recordingDuration)}</p>
            </div>
            <div className="flex-none mx-auto my-auto"> <p className="text-[black] font-semibold text-[2.8vh] text-[red]">{status}</p></div>
            <div className="flex-none mx-auto my-auto">
            {status !== 'recording' ? (
          <button id='starta' onClick={handleStartRecording} className="bg-[rgb(255,255,255,0.9)] mx-auto border-solid border-[1px] border-[black] text-[black] rounded-md py-1 px-1 font-semibold text-[1.6vh]">
            Start Audio
          </button>
        ) : (
          <button id='stopa' onClick={handleStopRecording} className="bg-[rgb(255,255,255,0.9)] mx-auto border-solid border-[1px] border-[black] text-[black] rounded-md py-1 px-1 font-semibold text-[1.6vh]">
            Stop Audio
          </button>
        )}
            </div>
            </div>
      )}
            </div>
          </div>
    );
};

export default ReactRecorder;
