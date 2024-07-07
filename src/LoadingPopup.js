import React from 'react';
import { Puff } from 'react-loader-spinner';
import './App.css';

function LoadingPopup() {
  return (
    <div className="loading-popup">
      <Puff color="cyan" height={100} width={100} />
      <p>Loading...</p>
    </div>
  );
}

export default LoadingPopup;
