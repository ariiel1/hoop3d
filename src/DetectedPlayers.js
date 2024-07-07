import React from 'react';
import './App.css';

function DetectedPlayers({ images, handleImageClick }) {
  return (
    <section className="detected-players-section">
      <h2>Detected Players</h2>
      <div className="image-grid">
        {images.map((image, index) => (
          <div key={index} className="image-container">
            <img
              src={image}
              alt={`Processed ${index}`}
              onClick={() => handleImageClick(image)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default DetectedPlayers;
