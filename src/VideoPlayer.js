import React from 'react';
import './App.css';

function VideoPlayer({
  videoRef,
  videoURL,
  videoFile,
  isPaused,
  handlePause,
  handlePlay,
  handlePlayerDetect,
  handleRemoveVideo
}) {
  return (
    <div className="video-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          controls
          onPause={handlePause}
          onPlay={handlePlay}
        >
          <source src={videoURL} type={videoFile.type} />
          Your browser does not support the video tag.
        </video>
        {isPaused && (
          <button className="default-button" onClick={handlePlayerDetect}>
            Detect Players
          </button>
        )}
      </div>
      <button className="remove-button" onClick={handleRemoveVideo}>
        Remove Video
      </button>
    </div>
  );
}

export default VideoPlayer;
