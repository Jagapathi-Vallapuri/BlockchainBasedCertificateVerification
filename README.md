# Blockchain Based Certificate Verification

A decentralized application (dApp) for issuing and verifying academic (or any) certificates on Ethereum. Certificates are represented on-chain by a hash (or IPFS CID) rather than the raw file, preserving integrity and minimizing storage costs.

## Features (Current Version)
- Solidity `CertificateRegistry` contract (admin-issued certificates stored per student + certificate type)
- Truffle migration / build setup (Solidity 0.8.20)
- React + Vite frontend (MetaMask / injected wallet) with RainbowKit + wagmi foundations
- Simple Express backend for file upload & SHA-256 hashing (optional helper)
- On-chain storage of certificate hash and timestamp



---
## Prerequisites
- Node.js (LTS 18+ recommended)
- npm or yarn (examples use `npm`)
- Truffle CLI (`npm install -g truffle`) OR use npx (`npx truffle ...`)
- Local Ethereum JSON-RPC node (Ganache UI or Ganache CLI or Hardhat node). Examples use Ganache default `127.0.0.1:8545`.
- MetaMask browser extension

Optional (backend file hashing):
- `curl` or a REST client (Postman) for testing file upload API

---
## Project Structure
```
contracts/               Solidity source
migrations/              Truffle deployment scripts
build/contracts/         Compiled artifacts (ABI + bytecode) after `truffle compile`
backend/server.js        Express file upload + SHA-256 hashing helper
frontend/                React + Vite UI
truffle-config.js        Network & compiler config
```

---

## Smart Contract Overview
Contract: `CertificateRegistry.sol`

```solidity
struct Certificate { string fileHash; uint256 issuedAt; }
issueCertificate(address student, string certType, string fileHash)  // admin only
getCertificate(address student, string certType) -> (fileHash, issuedAt)
```
Access Control: Only `admin` (deployer) can issue.
Uniqueness: A student+certType pair can be issued only once.
Events: `CertificateIssued` emitted on issuance.

Currently implemented: issue and get certificate only. Revocation and related features are not present in this version.

---
## Workflow Summary
1. Start local blockchain (Ganache)
2. Compile & deploy contract with Truffle
3. Import a Ganache account (admin) into MetaMask
4. Update frontend with deployed contract address (if different)
5. Run backend (optional) to hash uploaded certificate files
6. Use frontend to connect wallet and interact

---
## 1. Start Local Blockchain (Ganache)
You can use either Ganache UI or CLI.

Ganache UI: Just open the app; note RPC port (default 8545) and mnemonic.

Ganache CLI example:
```bash
npx ganache -p 8545 -d
```
`
-d` gives deterministic accounts; the first account will deploy the contract and become `admin`.

---
## 2. Compile & Deploy with Truffle
From project root:
```bash
npm install        # (installs any root-level deps if you add them later; currently minimal)
truffle compile
truffle migrate --network development
```
If you don't have global truffle:
```bash
npx truffle compile
npx truffle migrate --network development
```
On success, artifact JSON files (including ABI + networks section containing deployed address) appear under `build/contracts/`.

Grab the deployed address of `CertificateRegistry` from the artifact (look for the latest network id entry) or the migration output logs.

---
## 3. Configure MetaMask
1. Open MetaMask > Networks > Add a network manually
2. RPC URL: `http://127.0.0.1:8545`
3. Chain ID: (Ganache will usually expose 1337 or 5777—verify in Ganache output)
4. Currency symbol: ETH
5. Save
6. Import the private key of the first Ganache account (admin) to issue certificates:
   - In Ganache UI copy the private key
   - MetaMask > Import Account > paste private key

> Security: Never use Ganache private keys on public networks.

---

## 4. Sync Frontend Contract Address & ABI
File: `frontend/src/utils/contractABI.js`

Update `CONTRACT_ADDRESS` to the deployed address from step 2.

Ensure the ABI in this file matches the deployed contract. As of this version, only `issueCertificate` and `getCertificate` are present. No revocation or extra fields are implemented.

---
## 5. Install & Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Vite will show a local URL (default `http://127.0.0.1:5173`). Open it in the same browser where MetaMask is installed.

Click the wallet connect button (RainbowKit) or custom Connect component. Ensure network is the local Ganache network.

---
## 6. (Optional) Run Backend File Hashing Service
In another terminal:
```bash
cd backend
npm install
node server.js
```
Service listens on `http://localhost:4000`.

Upload a file (e.g., with `curl`):
```bash
curl -F "file=@/path/to/certificate.pdf" http://localhost:4000/upload-certificate
```
Response example:
```json
{
  "fileUrl": "http://localhost:4000/certificates/1691512345678-certificate.pdf",
  "fileHash": "d2ab3c...sha256hex"
}
```
Use the `fileHash` as the `fileHash` argument to `issueCertificate` (front-end may automate this).

> Integrity Note: You can alternatively compute the hash client-side (preferred for trust minimization) using `crypto.subtle.digest('SHA-256', ...)` or a library.

---
## 7. Issue a Certificate (Admin)
1. Ensure MetaMask is using the admin (deployer) account.
2. Obtain the student's wallet address (the recipient) and a `certType` string (e.g., "BSC2025").
3. Hash the certificate file (backend or client) to get `fileHash`.
4. In the frontend form, enter student address, cert type, and hash, then submit.
5. Confirm the transaction in MetaMask.
6. Wait for transaction confirmation. You should see an emitted `CertificateIssued` event.

On-chain storage key is `(student, certType)` mapping to hash + timestamp.

---
## 8. Verify a Certificate
To verify you need:
- Student address
- Certificate type string

Call `getCertificate(student, certType)` via the frontend (or Truffle console):
```bash
truffle console
truffle(development)> const reg = await CertificateRegistry.deployed()
truffle(development)> await reg.getCertificate("0xStudent...", "BSC2025")
```
Return values: `[ fileHash, issuedAt ]` (will revert if not found).

Compare the returned `fileHash` with a freshly computed hash of the presented certificate file. If they match, the certificate is authentic and unaltered.

---
## 9. Truffle Console Tips
```bash
truffle console --network development
truffle(development)> const reg = await CertificateRegistry.deployed()
truffle(development)> (await reg.admin())
truffle(development)> await reg.issueCertificate(studentAddr, "BSC2025", hash)
```

---
## 10. Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| MetaMask shows wrong network | RPC mismatch | Re-add local network with correct Chain ID |
| Transaction reverts "Only admin can issue" | Using non-admin account | Switch MetaMask to deployer account |
| "Certificate already exists" | Duplicate (student, certType) | Choose new certType or modify contract to allow versioning |
| Frontend call fails "method not found" | ABI mismatch | Replace ABI with compiled version |
| Hash mismatch on verification | File changed or different hash algorithm | Ensure SHA-256 both sides |

---

## 11. ABI / Contract Sync
The ABI in `frontend/src/utils/contractABI.js` now matches the deployed contract. Only `issueCertificate` and `getCertificate` are implemented. If you add new features to the contract, update the ABI and frontend accordingly.

---

## 12. Suggested Next Enhancements
- Add `revokeCertificate` + event (future)
- Role-based multi-issuer (OpenZeppelin AccessControl)
- Client-side hashing + remove backend dependency for core flow
- Add tests (Truffle or migrate to Hardhat) for issue/duplicate/unauthorized fetch
- Event listener in frontend to auto-refresh state

---
## 13. Security Notes
- Do NOT deploy this exact contract/admin key to mainnet.
- Admin key compromise allows unauthorized issuance.
- Public chain storage: certificate type strings may leak metadata; consider hashing the type as well.
- Always verify hash algorithm consistency (SHA-256 vs Keccak-256). Current contract stores arbitrary string; you must standardize off-chain.

---
## 14. License
SPDX-License-Identifier: MIT (see contract header). Add a root LICENSE file for clarity if distributing.

---
## 15. Quick Reference Commands
```bash
# Start Ganache
npx ganache -p 8545 -d

# Compile & migrate
truffle compile
truffle migrate --network development

# Run backend
cd backend && npm install && node server.js

# Run frontend
cd frontend && npm install && npm run dev
```

---
## 16. MetaMask Verification Flow (Condensed)
1. User receives file + (student addr, certType)
2. User hashes file locally (SHA-256) -> H
3. Frontend calls `getCertificate(student, certType)` -> returns storedHash
4. Compare `H === storedHash` and ensure call succeeded (not reverted)

---
## Contributing
Open issues or PRs for: revocation, tests, Hardhat migration, UI polish.

---
## Disclaimer
Educational prototype. Not production audited.
