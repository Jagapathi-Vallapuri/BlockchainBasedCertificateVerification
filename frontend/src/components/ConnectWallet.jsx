import { useState } from "react";

const ConnectWallet = ({ setAccount }) => {
  const [connected, setConnected] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask first");

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    setConnected(true);
  };

  return (
    <div>
      <button onClick={connectWallet}>
        {connected ? "Wallet Connected" : "Connect MetaMask"}
      </button>
    </div>
  );
};

export default ConnectWallet;
