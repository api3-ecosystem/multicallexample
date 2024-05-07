const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Deploy", function () {
  async function deployContracts() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const TestContract = await ethers.getContractFactory("TestMulti");
    const testContract = await TestContract.deploy();

    const TestContract2 = await ethers.getContractFactory("SecondTestMulti");
    const testContract2 = await TestContract2.deploy();

    const MultiCall = await ethers.getContractFactory("Multicall3");
    const multiCall = await MultiCall.deploy();

    const MultiCallRead = await ethers.getContractFactory("MultiCallRead");
    const multiCallRead = await MultiCallRead.deploy();

    return { testContract, testContract2, multiCall, multiCallRead, owner, otherAccount };
  }

  describe("--Test Regular Calls--", function () {
    it("Read the functions timestamps", async function () {
      const { testContract, testContract2 } = await loadFixture(deployContracts);
     
      await testContract.func3();
      await testContract.func4();
      await testContract2.func5();
      console.log(
        "Timestamp with a regular tx Function 3:",
        await testContract.timestampf3()
      );
      console.log(
        "Timestamp with a regular tx Function 4:",
        await testContract.timestampf4()
      );
      console.log(
        "Timestamp with a regular tx Function 5:",
        await testContract2.timestampf5()
      );
    });
  });

  describe("--MultiCallTest--", function () {
    it("--Test with MultiCallRead--", async function () {
      const { testContract, multiCall, multiCallRead, owner } =
        await loadFixture(deployContracts);

      //const callActions = ["func1", "func2", "func3", "func4"]; // Function names to be called
      const callActions = ["func1", "func2"]; // Function names to be called
      const callsData = await Promise.all(
        callActions.map(async (funcName) => {
          return testContract.interface.encodeFunctionData(funcName, []);
        })
      );

      let contractAddress = await testContract.target;

      // Construct the calls array in the desired format
      const calls = callsData.map((callData) => [
        contractAddress,
        true,
        callData,
      ]);
      console.log(
        "Formatted batch calls for aggregate3:",
        JSON.stringify(calls)
      );

      try {
        const returnData = await multiCallRead.multiCall(calls);
        console.log("Return Data:", returnData);

        // Decode the return Data received from the read only call
        const decodedResults = returnData.map((data) =>
          ethers.AbiCoder.defaultAbiCoder().decode(["(uint256,uint256)"], data)
        );

        // const decodedResults = returnData.map(data => ethers.utils.defaultAbiCoder.decode(['uint256', 'uint256'], data));
        console.log("Decoded Results:", decodedResults);
      } catch (error) {
        console.error("Error executing aggregate3 call:", error);
      }
    });

    it("--Test with MultiCall3 Function Call--", async function () {
      const { testContract, multiCall, multiCallRead, owner } =
        await loadFixture(deployContracts);

      await testContract.func3();
      await testContract.func4();
      console.log("******Timestamp Called with a Normal Tx******");
      console.log(
        "Normal Call of Function 3:",
        await testContract.timestampf3()
      );
      console.log(
        "Normal Call of Function 4:",
        await testContract.timestampf4()
      );

      const callActions = ["func3", "func4"]; // Function names to be called
      const callsData = await Promise.all(
        callActions.map(async (funcName) => {
          return testContract.interface.encodeFunctionData(funcName, []);
        })
      );

      let contractAddress = await testContract.target;

      // Construct the calls array in the desired format
      const calls = callsData.map((callData) => [
        contractAddress,
        true,
        callData,
      ]);
      // console.log(
      //   "Formatted batch calls for aggregate3:",
      //   JSON.stringify(calls)
      // );

      try {
        const returnData = await multiCall.aggregate3(calls);
        //  console.log("Return Data:", returnData);
      } catch (error) {
        console.error("Error executing aggregate3 call:", error);
      }

      console.log("******Timestamp Called with MultiCall3 - Should be the same timestamp******");
      console.log(
        "Timestamp after Function 3:",
        await testContract.timestampf3()
      );
      console.log(
        "Timestamp after Function 4:",
        await testContract.timestampf4()
      );
    });

    it("--Test with MultiCall3 Function Call Including Different Contract--", async function () {
      const { testContract, testContract2, multiCall, multiCallRead, owner, otherContract } = 
        await loadFixture(deployContracts);
    
      await testContract.func3();
      await testContract.func4();
      await testContract2.func5();
      console.log("******Timestamp Called with a Normal Tx******");
      console.log("Normal Call of Function 3:", await testContract.timestampf3());
      console.log("Normal Call of Function 4:", await testContract.timestampf4());
      console.log("Normal Call of Function 5:", await testContract2.timestampf5());

    
      const callActions = [
        { contract: testContract, funcName: "func3" },
        { contract: testContract, funcName: "func4" },
        { contract: testContract2, funcName: "func5" }  
      ];
      
      const callsData = await Promise.all(
        callActions.map(async ({ contract, funcName }) => {
          return contract.interface.encodeFunctionData(funcName, []);
        })
      );
    
      const calls = callActions.map((action, index) => [
        action.contract.target,
        true,
        callsData[index],
      ]);
    
      // Uncomment to debug the constructed batch calls
      // console.log("Formatted batch calls for aggregate3:", JSON.stringify(calls));
    
      try {
        const returnData = await multiCall.aggregate3(calls);
        // Uncomment to log the return data
        // console.log("Return Data:", returnData);
      } catch (error) {
        console.error("Error executing aggregate3 call:", error);
      }
    
      console.log("******Timestamp Called with MultiCall3 - Should be the same timestamp******");
      console.log("Timestamp after Function 3:", await testContract.timestampf3());
      console.log("Timestamp after Function 4:", await testContract.timestampf4());
      console.log("Timestamp after Function 5:", await testContract2.timestampf5());
    });
    
  });
});
