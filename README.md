# MultiCall Tutorial

This repo covers examples of using a MultiCall smart contract. Giving he ability to call multiple contracts in a single call or bulk transactions in a single call.  Saving on RPC requests and combining transactions.

### Video Companion
[Walkthrough](https://www.youtube.com/watch?v=gn9M155d7rU)


### Files:

`MultiCall.sol` - This contract is a fork of MultiCall3, it's backwards compatible with MultiCall and MultiCall2 which lets you execute multiple transactions in a single call

`MultiCallRead.sol` - Is a sampler reading contract that does a `staticCall` to read data from a contract and return the contracts.  No transaction execution, just read.

`TestContract.sol` - Contract with 2 functions to read only with a return and two functions that update the timestamp of a variable. Also included are encoded functions to verify your encodes are matching.

`SecondTestContract.sol` - Two additional functions, 1 to update the timestamp and 1 to check to encode.  Here to showcase the ability of multicall on a second contract.

### Testing
The test showcases when you call the function individually in single transactions, it's happening after every block.

```
    --Test Regular Calls--
Timestamp with a regular tx Function 3: 1713998404n
Timestamp with a regular tx Function 4: 1713998405n
Timestamp with a regular tx Function 5: 1713998406n
      ✔ Read the functions timestamps (1307ms)
```

Second Test shows the format that multicall will take in the arguments.  An array of calls following the format of [Contracts address, Boolean (if the function is allow to fail and continue or stop), encoded function]  Example: `["0x5FbDB2315678afecb367f032d93F642f64180aa3",true,"0x74135154"]` 

It will send the call to the contract and read the return data.  The data is in bytes.
`[
  '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000066298a43',
  '0x00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000066298a43'
]`

You can decode the data, if you know the return format of contents (In this case uint256,uint256).  You can also use open source tools suchs as [Swiss Knife](https://calldata.swiss-knife.xyz/decoder)

![example](/images/data.jpg)


### Third Test

First goes through calling each function again seperately to show how it takes 1 block to go through each transaction whether it's the same or different contract.

Since we are using different contract addresses for some functions we setup our call actions as objects and then run it through out encode functions script portion.
We setup the calls to meet the appropriate format and then place the arguments in the Aggregrate3 function call.

We then console log each timestamp to show the each function was called on the same block.

```
******Timestamp Called with a Normal Tx******
Normal Call of Function 3: 1713998404n
Normal Call of Function 4: 1713998405n
Normal Call of Function 5: 1713998406n
******Timestamp Called with MultiCall3 - Should be the same timestamp******
Timestamp after Function 3: 1713998407n
Timestamp after Function 4: 1713998407n
Timestamp after Function 5: 1713998407n
      ✔ --Test with MultiCall3 Function Call Including Different Contract--
```

### Running a live Script

Scripts Directory
- ABIS
- MultiCallScript.js

The abis, folder containts the abis of both MultiCall Contracts.
The MulticCallScript does not utilize hardhat tools so it can be ported over to any framework of choosing (i.e. Foundry) or a standalone.  

It follows the same format as the tests above but also manually did the test contract ABIs manually to show that sometimes you will see ABIs being used like this as well.
```
const testContractABI = [
    "function func1() external view returns (uint, uint)",
    "function func2() external view returns (uint, uint)",
    "function func3() external",
    "function func4() external",
    "function timestampf3() external view returns (uint256)",
    "function timestampf4() external view returns (uint256)"
]
```
Make sure to enter your .env details to be able to run the transactions on the deployed contracts.

You can deploy your own contracts or use the existing ones

```
npx hardhat ignition deploy ignition/modules/Deploy.js --network yourChain
```
You can run the script with 

```shell
npx hardhat run scripts/MultiCallScript.js
or
node scripts/MulticallScript.js
```
