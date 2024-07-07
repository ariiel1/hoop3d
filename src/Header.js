import React, { useState } from 'react';
import './App.css';

function Header() {
  const [showInstructions, setShowInstructions] = useState(false);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <>
      <header className="App-header">
        <h1>HOOP3D</h1>
        <div className="instructions" onClick={toggleInstructions}>
          Instructions
        </div>
      </header>
      {showInstructions && (
        <div className="instructions-popup" onClick={toggleInstructions}>
            <div className="instructions-content">
                <h2>How to Use HOOP3D</h2>
                <ol>
                    <li>Upload a Video: Upload a video of a basketball match into the upload box</li>
                    <li>Detect Players: During playback, pause the video at any time and click the "Detect Players" button to detect current players on the paused frame</li>
                    <li>View Detected Players: Images of the detected players will be displayed below the video.</li>
                    <li>Generate 3D Model: Click on a detected player to generate a 3D model of the player.</li>
                </ol>
                {/* <button onClick={toggleInstructions}>Close</button> */}
            </div>
        </div>
      )}
    </>
  );
}

export default Header;
