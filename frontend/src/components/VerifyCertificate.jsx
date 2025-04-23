import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../utils/contractABI";

const IssueCertificate = ({ fileHash, account }) => {
  const [student, setStudent] = useState("");
  const [certType, setCertType] = useState("");
  const [status, setStatus] = useState("");

  const issueCert = async () => {
    if (!fileHash) return alert("Please upload a certificate first");

    if (!ethers.isAddress(student)) {
      setStatus("❌ Invalid Ethereum address");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.issueCertificate(student, certType, fileHash);
      await tx.wait();

      setStatus("✅ Certificate issued on-chain!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to issue certificate");
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
      backgroundColor: "#551A8B",
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
      <h3>Issue Certificate</h3>
      <input
        style={styles.input}
        type="text"
        placeholder="Student Address (0x...)"
        value={student}
        onChange={(e) => setStudent(e.target.value)}
      />
      <input
        style={styles.input}
        type="text"
        placeholder="Certificate Type (e.g., BTech)"
        value={certType}
        onChange={(e) => setCertType(e.target.value)}
      />
      <button style={styles.button} onClick={issueCert}>Issue Certificate</button>
      <p style={styles.status}>{status}</p>
    </div>
  );
};

export default IssueCertificate;
