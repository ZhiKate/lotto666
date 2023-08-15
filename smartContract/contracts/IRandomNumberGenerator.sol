// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.6;

interface IRandomNumberGenerator {
    /**
     * Requests randomness from a user-provided seed Hash
     * @notice seedHash = keccak256(seed)
     */
    function requestRandomValue(uint256 seedHash) external;

    /**
     * revaeals random result = blockhash | block.timestamp | seed
     */
    function revealRandomValue(uint256 seed) external returns (uint256);

    /**
     * Views random result
     */
    function viewRandomResult() external view returns (uint256);
}
