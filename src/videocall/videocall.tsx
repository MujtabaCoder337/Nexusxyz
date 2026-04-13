import React, { useRef, useState } from 'react';

const Videocall: React.FC = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCallActive(true);
    } catch {
      alert('Please allow camera and microphone access');
    }
  };

  const endCall = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      mediaStreamRef.current = null;
    }
    setIsCallActive(false);
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const toggleAudio = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Video Call</h2>
      <div className="bg-gray-900 rounded-lg mb-4 flex justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-lg"
          style={{ maxHeight: '400px' }}
        />
      </div>
      <div className="flex gap-3 justify-center">
        {!isCallActive ? (
          <button
            onClick={startCall}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Start Call
          </button>
        ) : (
          <>
            <button
              onClick={endCall}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              End Call
            </button>
            <button
              onClick={toggleVideo}
              className={`px-6 py-2 rounded-lg ${isVideoOn ? 'bg-blue-600' : 'bg-gray-600'} text-white`}
            >
              {isVideoOn ? 'Video On' : 'Video Off'}
            </button>
            <button
              onClick={toggleAudio}
              className={`px-6 py-2 rounded-lg ${isAudioOn ? 'bg-blue-600' : 'bg-gray-600'} text-white`}
            >
              {isAudioOn ? 'Mic On' : 'Mic Off'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Videocall;