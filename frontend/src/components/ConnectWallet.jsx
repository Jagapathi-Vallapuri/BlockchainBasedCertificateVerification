import { useState } from "react";

const ConnectWallet = ({ setAccount }) => {
  const [connected, setConnected] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask first");

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    setConnected(true);
  };

  const styles = {
    button: {
      backgroundColor: "#333366",
      color: "#ffffff",
      border: "none",
      padding: "0.8rem 1.5rem",
      fontSize: "1rem",
      borderRadius: "8px",
      cursor: "pointer",
    }
  };

  return (
    <div>
      <button style={styles.button} onClick={connectWallet}>
        {connected ? "Wallet Connected" : "Connect MetaMask"}
      </button>
    </div>
  );
};

export default ConnectWallet;
