import { useEffect, useState } from "react";

const AudioRecorder = () => {
  

  useEffect(() => {
    getMicrophonePermission();
  }, []);

  
  return (
    <>
      {audio ? (
        <div className="audio-container">
          <audio src={audio} controls></audio>
          <a download href={audio}>
            Download Recording
          </a>
        </div>
      ) : null}
    </>
  );
};

export default AudioRecorder;
