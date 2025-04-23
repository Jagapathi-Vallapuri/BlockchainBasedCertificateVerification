import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import UploadCertificate from "./components/UploadCertificate";
import IssueCertificate from "./components/IssueCertificate";
import VerifyCertificate from "./components/VerifyCertificate";

function App() {
  const [account, setAccount] = useState(null);
  const [fileHash, setFileHash] = useState("");
  const [fileUrl, setFileUrl] = useState(""); // optional display

  const styles = {
    app: {
      backgroundColor: "#0f0f0f",
      color: "#ffffff",
      minHeight: "100vh",
      padding: "2rem",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    heading: {
      color: "#b19cd9", // light purple
      textAlign: "center",
      marginBottom: "2rem",
    },
    section: {
      backgroundColor: "#1e1e2f",
      padding: "1.5rem",
      borderRadius: "12px",
      boxShadow: "0 0 20px rgba(128, 0, 128, 0.3)",
      marginBottom: "2rem",
    },
    hr: {
      borderColor: "#333366",
      margin: "3rem 0",
    }
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.heading}>Student Certificate DApp</h1>
      <div style={styles.section}>
        <ConnectWallet setAccount={setAccount} />
      </div>
      {account && (
        <>
          <div style={styles.section}>
            <UploadCertificate setFileHash={setFileHash} setFileUrl={setFileUrl} />
          </div>
          <div style={styles.section}>
            <IssueCertificate fileHash={fileHash} account={account} />
          </div>
        </>
      )}
      <hr style={styles.hr} />
      <div style={styles.section}>
        <VerifyCertificate />
      </div>
    </div>
  );
}

export default App;
