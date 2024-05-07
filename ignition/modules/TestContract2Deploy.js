const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Deploy", (m) => {

   const secondTestContract= m.contract("SecondTestMulti");

  return { secondTestContract };
});
