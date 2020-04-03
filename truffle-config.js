const solcVersion = require('./compiler.json').solcVersion
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: "7545",
      network_id: "*"
    }
  },
  plugins: ["solidity-coverage"],
  compilers: {
    solc: {
      version: solcVersion,
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
