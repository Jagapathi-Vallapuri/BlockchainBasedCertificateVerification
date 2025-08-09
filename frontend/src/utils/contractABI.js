export const CONTRACT_ADDRESS = "";
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
      { "internalType": "string", "name": "fileHash", "type": "string" }
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
      { "internalType": "string", "name": "fileHash", "type": "string" },
      { "internalType": "uint256", "name": "issuedAt", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
