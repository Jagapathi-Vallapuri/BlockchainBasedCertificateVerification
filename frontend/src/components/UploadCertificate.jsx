import { useState } from 'react';

const UploadCertificate = ({ setFileHash, setFileUrl, setCid }) => {
    const [file, setFile] = useState(null);
    const [cid, localSetCid] = useState("");
    const [status, setStatus] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert('Please select a file first');
        setStatus('Uploading...');

        const formData = new FormData();
        formData.append('file', file);
        console.log("Before upload");

        try {
            const res = await fetch('http://localhost:4000/upload-certificate', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (data.fileHash) {
                setFileHash(data.fileHash);
                setFileUrl(data.fileUrl);
                if (setCid && data.ipfsHash) setCid(data.ipfsHash);
                if (data.ipfsHash) localSetCid(data.ipfsHash);

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
            {cid && (
                <div>
                    <strong>IPFS CID:</strong>
                    <span style={{ wordBreak: 'break-all', marginLeft: 8 }}>{cid}</span>
                </div>
            )}
        </div>
    );
};

export default UploadCertificate;
