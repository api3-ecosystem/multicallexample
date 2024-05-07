// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract TestMulti {

    uint256 public timestampf3;
    uint256 public timestampf4;

    function func1()external view returns (uint, uint){
        return (1, block.timestamp);
    }

    function func2()external view returns (uint, uint){
        return (2, block.timestamp);
    }

    function func3() external{
        timestampf3 = block.timestamp;
    }

    function func4() external {
        timestampf4 = block.timestamp;
    }

    function getData1() external pure returns (bytes memory){
        return abi.encodeWithSelector(this.func1.selector);
    }
    
    function getData2() external pure returns (bytes memory){
        return abi.encodeWithSelector(this.func2.selector);
    }

    function getData3() external pure returns (bytes memory){
        return abi.encodeWithSelector(this.func3.selector);
    }

    function getData4() external pure returns (bytes memory){
        return abi.encodeWithSelector(this.func4.selector);
    }
}