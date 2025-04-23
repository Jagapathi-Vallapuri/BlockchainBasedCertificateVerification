module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,             // Ganache default
      network_id: "*",        // Match any network id
    },
  },
  compilers: {
    solc: {
      version: "0.8.20",      // Match your contract version
    },
  },
};
