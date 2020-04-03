const ERC223Token = artifacts.require("ERC223Token");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(ERC223Token);
};
