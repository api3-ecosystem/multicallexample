const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Deploy", (m) => {
  const multiCallRead = m.contract("MultiCallRead");

  return { multiCallRead};
});
