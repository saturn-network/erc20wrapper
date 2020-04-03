const SATURN223 = artifacts.require("SATURN223");
const ERC20Wrapper = artifacts.require("ERC20Wrapper");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(SATURN223).then(() => {
    return deployer.deploy(ERC20Wrapper, SATURN223.address, "Wrapped Saturn", "SATURN20");
  });
};
