const { ethers } = require("ethers");
require("dotenv").config();
const multicABI = require("./abis/Multicall3.json");
const multiCallReadABI = require("./abis/MultiCallRead.json");
// const testContractABI = require("./abis/TestContract.json");

// Setup provider and signer
const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);

const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// Contract setups
// Sepolia
// const multiCallREADONLYAddress = "0xb9D07d90b98182cd4DE542AB8FA1B4447c15A0f5";
// const multiCall3Address = "0x9835F00a3f5C539eBfE19DD01715749558CDe25A";
// const yourContractAddress = "0xc6143B395b0595063ae435bDBD6DfC74Bd598D28";
// const your2ndContractAddress = "0xDcc01DaFB8f43017b1e9b31C69480dE3138c60e4";

// abitbrumSepolia
const multiCallREADONLYAddress = "0x5d693071E698295eDE352df04c9BF837eC15993A";
const multiCall3Address = "0xFefDadb1c553a2d19ED43F6Aab0C7251470db1BA";
const yourContractAddress = "0xe60C701701C76E8a61963903542D7241a2eaC7D3";
const your2ndContractAddress = "0x88A92881c8298eB89C809868a6Da6A59bB98d3c9";

// Contract Object setup
const multiCallReadContract = new ethers.Contract(multiCallREADONLYAddress, multiCallReadABI.abi, wallet);
const multicallContract = new ethers.Contract(multiCall3Address, multicABI.abi, wallet);

// Manual way of inputting the ABI - You may see this style in some examples
const testContractABI = [
    "function func1() external view returns (uint, uint)",
    "function func2() external view returns (uint, uint)",
    "function func3() external",
    "function func4() external",
    "function timestampf3() external view returns (uint256)",
    "function timestampf4() external view returns (uint256)"
]
const yourContract = new ethers.Contract(yourContractAddress, testContractABI, wallet);

const secondTestContractABI = [
  "function func5() external",
  "function timestampf5() external view returns (uint256)",
];
const your2ndContract = new ethers.Contract(your2ndContractAddress, secondTestContractABI, wallet);


async function batchCallUsingAggregate3() {

  // Dynamically encode the calls to your functions
  console.log("**********************************************")
  console.log("*****Reading through MultiCall Contract*******")
  console.log("**********************************************")
  const callActions = ["func1", "func2"]; // Function names to be called
  const callsData = await Promise.all(callActions.map(async (funcName) => {
    return yourContract.interface.encodeFunctionData(funcName, []);
  }));

  // Construct the calls array in the desired format
  const calls = callsData.map((callData) => [
    yourContractAddress,
    true,
    callData,
  ]);
  //Preview how the arguments are formatted
  console.log("Formatted batch calls for aggregate3:", JSON.stringify(calls));

  try {
    const returnData = await multiCallReadContract.multiCall(calls);
    console.log("Return Data Read from Contract:", returnData);

  } catch (error) {
    console.error("Error executing aggregate3 call:", error);
  }

  console.log("**********************************************")
  console.log("*******Sending at Tx through multicall********")
  console.log("**********************************************")

  console.log("Check Timestamps with a regular tx Function calls to Function 3,4 and 5");

      let tx1 = await yourContract.func3();
       await tx1.wait();
      let tx2 = await yourContract.func4();
       await tx2.wait();
      let tx3 = await your2ndContract.func5();
        await tx3.wait();
      console.log(
        "Timestamp with a regular tx Function 3:",
        await yourContract.timestampf3()
      );
      console.log(
        "Timestamp with a regular tx Function 4:",
        await yourContract.timestampf4());
      console.log(
        "Timestamp with a regular tx Function 5:",
        await your2ndContract.timestampf5()
      );

  const callTxActions = [
    { contract: yourContract, funcName: "func3" },
    { contract: yourContract, funcName: "func4" },
    { contract: your2ndContract, funcName: "func5" }  
  ];

  const callsTxData = await Promise.all(
    callTxActions.map(async ({ contract, funcName }) => {
    return contract.interface.encodeFunctionData(funcName, []);
  }));

  // Construct the calls array but we have diffrerent contract addresses
  const callsTx = callTxActions.map((action, index) => [
    action.contract.target,
    true,
    callsTxData[index],
  ]);
  // Preview of argument
  console.log("Formatted batch callsTx for aggregate3:", JSON.stringify(callsTx));

  // Execute batch call
  try {
    const returnData = await multicallContract.aggregate3(callsTx);
    returnData.wait();
    // console.log("Return Data:", returnData);

  } catch (error) {
    console.error("Error executing aggregate3 call:", error);
  }

  console.log(
    "Timestamp after multiCall Function 3:",
    await yourContract.timestampf3()
  );
  console.log(
    "Timestamp after multiCall Function 4:",
    await yourContract.timestampf4());
  console.log(
    "Timestamp after multiCall Function 5:",
    await your2ndContract.timestampf5()
  );

}

batchCallUsingAggregate3().catch(console.error);