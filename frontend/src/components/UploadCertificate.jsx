import { useState } from 'react';

const UploadCertificate = ({ setFileHash, setFileUrl }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first');
    setStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:4000/upload-certificate', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.fileHash) {
        setFileHash(data.fileHash);
        setFileUrl(data.fileUrl);
        setStatus('Upload successful');
      } else {
        setStatus('Upload failed');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error uploading file');
    }
  };

  const styles = {
    input: {
      display: "block",
      margin: "0.5rem 0",
      background: "#1e1e2f",
      color: "#ffffff",
      border: "1px solid #555",
      padding: "0.5rem",
      borderRadius: "6px",
    },
    button: {
      backgroundColor: "#4b0082",
      color: "#ffffff",
      border: "none",
      padding: "0.6rem 1.2rem",
      fontSize: "1rem",
      borderRadius: "8px",
      cursor: "pointer",
    },
    status: {
      marginTop: "0.8rem",
      color: "#cccccc"
    }
  };

  return (
    <div>
      <h3>Upload Certificate File (PDF)</h3>
      <input style={styles.input} type="file" accept=".pdf" onChange={handleFileChange} />
      <button style={styles.button} onClick={handleUpload}>Upload to Server</button>
      <p style={styles.status}>{status}</p>
    </div>
  );
};

export default UploadCertificate;
