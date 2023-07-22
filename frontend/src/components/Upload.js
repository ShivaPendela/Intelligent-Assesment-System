
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './upload.css';
import { useNavigate } from 'react-router-dom';


const Upload = () => {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Token doesn't exist, navigate to the error page
      navigate("/");
    }
  }, [navigate]);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file || !language) {
      setError('Please select a file and language');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          language: language.toLowerCase()
        }
      });

      if (response.status === 200) {
        const data = response.data;
        setMessage(data.message);
        setError('');
        console.log('File uploaded successfully');
      } else {
        setError('Error uploading file');
        setMessage('');
        console.log('Error uploading file');
      }
    } catch (error) {
      console.log('Error uploading file', error);
      setError('An error occurred while uploading the file');
      setMessage('');
    }
  };

  return (
    <div>
      <div className="upload-form-container">
        <h1>File Upload</h1>
        <form onSubmit={handleSubmit} className="upload-form">
          <label htmlFor="file-upload">Select file to upload:</label>
          <p>Topic/Difficulty/Question/Answer</p>
          <input type="file" id="file-upload" name="file-upload" onChange={handleFileChange} />
          <div>
            <label htmlFor="language">Language:</label>
            <select id="language" value={language} onChange={handleLanguageChange}>
              <option value="">Select Language</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>
          <button type="submit" disabled={!file || !language}>Upload</button>
        </form>
        <div className="message-container">
          {message && <p>{message}</p>}
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Upload;
