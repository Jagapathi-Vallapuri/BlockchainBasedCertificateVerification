export const CONTRACT_ADDRESS = "0xA3867993193526bcE803fC37126B6a0eD7d43A8B";
//paste deployed contract address here

export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "student", "type": "address" },
      { "internalType": "string", "name": "certType", "type": "string" },
      { "internalType": "string", "name": "cid", "type": "string" }
    ],
    "name": "issueCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "student", "type": "address" },
      { "internalType": "string", "name": "certType", "type": "string" }
    ],
    "name": "getCertificate",
    "outputs": [
      { "internalType": "string", "name": "cid", "type": "string" },
      { "internalType": "uint256", "name": "issuedAt", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
