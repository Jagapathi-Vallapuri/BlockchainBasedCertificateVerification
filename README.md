# Blockchain Based Certificate Verification

## Monorepo & Workspaces
This project uses a monorepo structure with [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) for managing both backend and frontend. All dependencies are installed from the root, and scripts can be run for each workspace from the root as well.

**Workspaces:**
- `backend/` — Express server for file upload, IPFS, and hashing
- `frontend/` — React + Vite UI for certificate management and verification

**Key commands (run from project root):**
```bash
# Install all dependencies for all workspaces
npm install

# Start the backend server
npm run start:backend

# Start the frontend dev server
npm run start:frontend

# Build the frontend for production
npm --workspace frontend run build
```

> Only the root `package-lock.json` is needed. Do not keep `package-lock.json` files in `backend/` or `frontend/`.



A decentralized application (dApp) for issuing and verifying academic (or any) certificates on Ethereum. Certificates are stored on IPFS, and the IPFS CID (Content Identifier) is saved on-chain for tamper-proof, decentralized verification. Verification is performed in the browser by recomputing the CID and comparing it to the on-chain value.


## Features (Current Version)
- Solidity `CertificateRegistry` contract (admin-issued certificates stored per student + certificate type)
- Truffle migration / build setup (Solidity 0.8.20)
- React + Vite frontend (MetaMask / injected wallet) with RainbowKit + wagmi foundations
- Express backend for file upload, IPFS integration, and SHA-256 hashing
- IPFS Docker node for decentralized file storage
- On-chain storage of IPFS CID (and optionally file hash)
- Browser-based verification: computes CID in-browser and compares to on-chain value



---
## Prerequisites
- Node.js (LTS 18+ recommended)
- npm or yarn (examples use `npm`)
- Truffle CLI (`npm install -g truffle`) OR use npx (`npx truffle ...`)
- Local Ethereum JSON-RPC node (Ganache UI or Ganache CLI or Hardhat node). Examples use Ganache default `127.0.0.1:8545`.
- MetaMask browser extension


Optional:
- Docker (for running a local IPFS node)
- `curl` or a REST client (Postman) for testing file upload API

---

## Project Structure
```
contracts/               Solidity source
migrations/              Truffle deployment scripts
build/contracts/         Compiled artifacts (ABI + bytecode) after `truffle compile`
backend/server.js        Express file upload, IPFS integration, and SHA-256 hashing
frontend/                React + Vite UI (MetaMask, IPFS CID verification)
truffle-config.js        Network & compiler config
```

---


## Smart Contract Overview
Contract: `CertificateRegistry.sol`

```solidity
struct Certificate { string ipfsCid; uint256 issuedAt; }
issueCertificate(address student, string certType, string ipfsCid)  // admin only
getCertificate(address student, string certType) -> (ipfsCid, issuedAt)
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

## 5. Install & Run Frontend (with Workspaces)
From the project root:
```bash
npm install                # Installs all dependencies for all workspaces
npm run start:frontend     # Starts the frontend dev server (Vite)
```
Vite will show a local URL (default `http://127.0.0.1:5173`). Open it in the same browser where MetaMask is installed.

Click the wallet connect button (RainbowKit) or custom Connect component. Ensure network is the local Ganache network.

### Build Frontend for Production
```bash
npm --workspace frontend run build
```
The production build will be output to `frontend/dist/`.

---


## 6. Run Backend with IPFS Integration (with Workspaces)
In another terminal, from the project root:
```bash
npm run start:backend
```
Service listens on `http://localhost:4000`.

### IPFS Docker Node
To run a local IPFS node (required for decentralized storage):
```bash
docker run -d \
  --name ipfs-node \
  -v ipfs_staging:/export \
  -v ipfs_data:/data/ipfs \
  -p 4001:4001 \
  -p 5001:5001 \
  -p 8080:8080 \
  ipfs/kubo:latest daemon
```
This will expose the IPFS API at `http://127.0.0.1:5001` and the gateway at `http://127.0.0.1:8080`.

### Uploading a File
Upload a file (e.g., with `curl`):
```bash
curl -F "file=@/path/to/certificate.pdf" http://localhost:4000/upload-certificate
```
Response example:
```json
{
  "fileUrl": "http://localhost:4000/certificates/1691512345678-certificate.pdf",
  "fileHash": "d2ab3c...sha256hex",
  "ipfsHash": "Qm... (the CID)"
}
```
Use the `ipfsHash` as the argument to `issueCertificate` (the frontend automates this).

> Integrity Note: The backend also returns a SHA-256 hash for legacy or off-chain verification, but the main verification is now CID-based.

---

## 7. Issue a Certificate (Admin)
1. Ensure MetaMask is using the admin (deployer) account.
2. Upload the certificate file via the frontend. The backend will store it on IPFS and return the CID.
3. Enter the student's wallet address and certificate type in the frontend form.
4. The frontend will call `issueCertificate` with the student address, cert type, and CID.
5. Confirm the transaction in MetaMask.
6. Wait for transaction confirmation. You should see an emitted `CertificateIssued` event.

On-chain storage key is `(student, certType)` mapping to CID + timestamp.

---

## 8. Verify a Certificate (Browser-based, IPFS-powered)
To verify you need:
- Student address
- Certificate type string
- The original certificate file (PDF)

The frontend will:
1. Call `getCertificate(student, certType)` to get the stored CID from the contract.
2. Compute the CID of the uploaded file in the browser using [`ipfs-only-hash`](https://www.npmjs.com/package/ipfs-only-hash).
3. Compare the computed CID to the on-chain CID.
4. If they match, the certificate is valid and untampered.

You can also access the file directly from IPFS using the CID:
```
http://127.0.0.1:8080/ipfs/<CID>
```

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

# Install all dependencies (workspaces)
npm install

# Run backend (workspaces)
npm run start:backend

# Run frontend (workspaces)
npm run start:frontend

# Build frontend for production
npm --workspace frontend run build
```

---

## 16. MetaMask & IPFS Verification Flow (Condensed)
1. User receives file + (student addr, certType)
2. User uploads file in the frontend verification form
3. Frontend computes the IPFS CID in-browser
4. Frontend calls `getCertificate(student, certType)` -> returns stored CID
5. Compare computed CID to stored CID; if they match, the certificate is valid

---

---
## Troubleshooting Workspaces
- If you see missing dependencies, always run `npm install` from the root.
- Only the root `package-lock.json` should exist; delete any in subfolders.
- Use workspace scripts from the root for consistency.

## Contributing
Open issues or PRs for: revocation, tests, Hardhat migration, UI polish.

---
## Disclaimer
Educational prototype. Not production audited.
