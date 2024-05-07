// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract MultiCallRead {

    struct Call3 {
        address target;
        bool allowFailure;
        bytes callData;
    }

    function multiCall(Call3[] calldata calls) external view returns (bytes[] memory results) {
        results = new bytes[](calls.length);
        for (uint256 i = 0; i < calls.length; i++) {
            (bool success, bytes memory result) = calls[i].target.staticcall(calls[i].callData);
            if (!calls[i].allowFailure) {
                require(success, "MultiCallRead: call failed");
            }
            results[i] = result;
        }
        return results;
    }


}