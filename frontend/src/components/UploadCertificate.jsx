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
        setStatus('Upload successful ');
      } else {
        setStatus('Upload failed ');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error uploading file');
    }
  };

  return (
    <div>
      <h3>Upload Certificate File (PDF)</h3>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload to Server</button>
      <p>{status}</p>
    </div>
  );
};

export default UploadCertificate;
