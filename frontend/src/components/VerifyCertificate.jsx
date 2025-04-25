import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../utils/contractABI";

const VerifyCertificate = () => {
  const [student, setStudent] = useState("");
  const [certType, setCertType] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const computeSHA256 = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  };

  const verify = async () => {
    if (!file) return alert("Please select a certificate file");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const [storedHash, issuedAt] = await contract.getCertificate(student, certType);
      const localHash = await computeSHA256(file);

      if (localHash === storedHash) {
        const timestamp = Number(issuedAt);
        setStatus(`Certificate is valid! Issued on ${new Date(timestamp * 1000).toLocaleString()}`);
      } else {
        setStatus("Certificate file is invalid or tampered");
      }
    } catch (err) {
      console.error(err);
      setStatus(" Verification failed. Check address and cert type.");
    }
  };

  return (
    <div>
      <h3>Verify Certificate</h3>
      <input
        type="text"
        placeholder="Student Wallet Address"
        value={student}
        onChange={(e) => setStudent(e.target.value)}
      />
      <input
        type="text"
        placeholder="Certificate Type"
        value={certType}
        onChange={(e) => setCertType(e.target.value)}
      />
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={verify}>Verify</button>
      <p>{status}</p>
    </div>
  );
};

export default VerifyCertificate;
