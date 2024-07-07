import React, { useState } from 'react';

function UrlUpdatePage({ updateApiUrl }) {
  const [url, setUrl] = useState('');

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleUpdateClick = () => {
    updateApiUrl(url);
    alert(`API URL updated to: ${url}`);
  };

  return (
    <div className="url-update-page">
      <h2>Update API URL</h2>
      <input
        type="text"
        value={url}
        onChange={handleUrlChange}
        placeholder="Enter new API URL"
      />
      <button onClick={handleUpdateClick}>Update URL</button>
    </div>
  );
}

export default UrlUpdatePage;
