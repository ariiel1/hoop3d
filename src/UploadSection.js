import React from 'react';
import './App.css';

function UploadSection({ videoURL, getVideoRootProps, getVideoInputProps, isVideoDragActive }) {
  return (
    <section className="upload-section">
      {!videoURL ? (
        <div {...getVideoRootProps({ className: 'dropzone' })}>
          <input {...getVideoInputProps()} />
          {isVideoDragActive ? (
            <p>Drop the video here...</p>
          ) : (
            <p>Drag & drop a video here, or click to select a video</p>
          )}
        </div>
      ) : null}
    </section>
  );
}

export default UploadSection;
