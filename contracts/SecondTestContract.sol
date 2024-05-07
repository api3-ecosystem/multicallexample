// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract SecondTestMulti {

    uint256 public timestampf5;

    function func5() external{
        timestampf5 = block.timestamp;
    }

    function getData5() external pure returns (bytes memory){
        return abi.encodeWithSelector(this.func5.selector);
    }
}