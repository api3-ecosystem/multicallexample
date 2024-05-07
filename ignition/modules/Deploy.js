const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Deploy", (m) => {

  const testingContract = m.contract("TestMulti");

  return { testingContract};
});
