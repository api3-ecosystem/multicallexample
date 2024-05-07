const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Deploy", (m) => {

   const multiCall3 = m.contract("Multicall3");

  return { multiCall3};
});
