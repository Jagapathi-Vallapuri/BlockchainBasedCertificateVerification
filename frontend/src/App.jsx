import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import UploadCertificate from "./components/UploadCertificate";
import IssueCertificate from "./components/IssueCertificate";
import VerifyCertificate from "./components/VerifyCertificate";
import "./App.css";


function App() {
  const [account, setAccount] = useState(null);
  const [fileHash, setFileHash] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [cid, setCid] = useState("");

  return (
    <div>
      <h1>Student Certificate DApp</h1>
      <div>
        <ConnectWallet setAccount={setAccount} />
      </div>
      <>
        <div>
          <UploadCertificate setFileHash={setFileHash} setFileUrl={setFileUrl} setCid={setCid} />
        </div>
        <div>
          <IssueCertificate cid={cid} account={account} />
        </div>
      </>
      <hr />
      <div>
        <VerifyCertificate />
      </div>
    </div>
  );
}

export default App;
