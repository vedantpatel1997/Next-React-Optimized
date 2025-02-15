'use client';

import { useState } from 'react';

export default function ExternalStoragePage() {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    // Function to list files in the storage
    const listFiles = async () => {
        try {
            const response = await fetch('/api/listFiles');
            const data = await response.json();
            if (response.ok) {
                setFiles(data.files);
                setError(null);
            } else {
                setError(data.error || 'Failed to list files');
            }
        } catch (err) {
            setError(`Error listing files: ${err.message}`);
        }
    };

    // Function to upload a file
    const uploadFile = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/uploadFile', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setUploadStatus(`File "${file.name}" uploaded successfully.`);
                listFiles(); // Refresh the file list
            } else {
                setUploadStatus(`Error uploading file: ${data.error || 'Unknown error'}`);
            }
        } catch (err) {
            setUploadStatus(`Error uploading file: ${err.message}`);
        }
    };

    // Function to delete a file
    const deleteFile = async (fileName) => {
        try {
            const response = await fetch('/api/deleteFile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileName }),
            });
            const data = await response.json();
            if (response.ok) {
                setUploadStatus(`File "${fileName}" deleted successfully.`);
                listFiles(); // Refresh the file list
            } else {
                setUploadStatus(`Error deleting file: ${data.error || 'Unknown error'}`);
            }
        } catch (err) {
            setUploadStatus(`Error deleting file: ${err.message}`);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>External Storage Operations</h1>

            <button
                onClick={listFiles}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#0070f3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                }}
            >
                List Files
            </button>

            {error && (
                <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
            )}

            <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Files in Storage:</h2>
            <ul style={{ listStyle: 'none', padding: '0' }}>
                {files.map((file, index) => (
                    <li
                        key={index}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px',
                            borderBottom: '1px solid #ddd',
                        }}
                    >
                        <span>{file}</span>
                        <button
                            onClick={() => deleteFile(file)}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#ff4d4d',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <h2 style={{ fontSize: '20px', marginTop: '20px', marginBottom: '10px' }}>Upload a File:</h2>
            <input
                type="file"
                onChange={uploadFile}
                style={{ marginBottom: '20px' }}
            />
            {uploadStatus && (
                <p style={{ color: uploadStatus.includes('Error') ? 'red' : 'green' }}>{uploadStatus}</p>
            )}
        </div>
    );
}