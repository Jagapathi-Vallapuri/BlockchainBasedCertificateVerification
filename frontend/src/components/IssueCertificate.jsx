import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../utils/contractABI";

const IssueCertificate = ({ fileHash, account }) => {
  const [student, setStudent] = useState("");
  const [certType, setCertType] = useState("");
  const [status, setStatus] = useState("");

  const issueCert = async () => {
    if (!fileHash) {
      alert("Please upload a certificate first");
      return;
    }

    if (!ethers.isAddress(student)) {
      setStatus(" Invalid Ethereum address");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.issueCertificate(student, certType, fileHash);
      await tx.wait();

      setStatus(" Certificate issued on-chain!");
    } catch (err) {
      console.error(err);
      setStatus(" Failed to issue certificate");
    }
  };

  return (
    <div>
      <h3>Issue Certificate</h3>
      <input
        type="text"
        placeholder="Student Address (0x...)"
        value={student}
        onChange={(e) => setStudent(e.target.value)}
      />
      <input
        type="text"
        placeholder="Certificate Type (e.g., BTech)"
        value={certType}
        onChange={(e) => setCertType(e.target.value)}
      />
      <button onClick={issueCert}>Issue Certificate</button>
      <p>{status}</p>
    </div>
  );
};

export default IssueCertificate;
