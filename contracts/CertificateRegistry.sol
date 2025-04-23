// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateRegistry {
    address public admin;

    struct Certificate {
        string fileHash;       // SHA-256 hash of the certificate file
        uint256 issuedAt;
    }

    mapping(address => mapping(string => Certificate)) public certificates;

    event CertificateIssued(address indexed student, string certType, string fileHash);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can issue");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function issueCertificate(address student, string memory certType, string memory fileHash) public onlyAdmin {
        require(bytes(certificates[student][certType].fileHash).length == 0, "Certificate already exists");

        certificates[student][certType] = Certificate({
            fileHash: fileHash,
            issuedAt: block.timestamp
        });

        emit CertificateIssued(student, certType, fileHash);
    }

    function getCertificate(address student, string memory certType) public view returns (
        string memory fileHash,
        uint256 issuedAt
    ) {
        Certificate memory cert = certificates[student][certType];
        require(bytes(cert.fileHash).length != 0, "Certificate not found");

        return (cert.fileHash, cert.issuedAt);
    }
}
