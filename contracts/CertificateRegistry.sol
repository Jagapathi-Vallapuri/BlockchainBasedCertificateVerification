// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateRegistry {
    address public admin;

    struct Certificate {
        string cid;       // IPFS CID of the certificate file
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

    function issueCertificate(address student, string memory certType, string memory cid) public onlyAdmin {
        require(bytes(certificates[student][certType].cid).length == 0, "Certificate already exists");

        certificates[student][certType] = Certificate({
            cid: cid,
            issuedAt: block.timestamp
        });

        emit CertificateIssued(student, certType, cid);
    }

    function getCertificate(address student, string memory certType) public view returns (
        string memory cid,
        uint256 issuedAt
    ) {
        Certificate memory cert = certificates[student][certType];
        require(bytes(cert.cid).length != 0, "Certificate not found");

        return (cert.cid, cert.issuedAt);
    }
}
