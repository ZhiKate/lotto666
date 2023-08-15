// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IRandomNumberGenerator.sol";

contract RandomNumberGenerator is Ownable, IRandomNumberGenerator {
    uint256 internal seedHash;
    uint256 internal blockRandomResult;
    uint256 internal requestBlockNumber;
    uint256 public randomResult;

    function requestRandomValue(uint256 _seedHash) external override onlyOwner {
        seedHash = _seedHash;
        blockRandomResult =
            uint256(blockhash(block.number)) ^
            uint256(block.timestamp) ^
            seedHash;
        requestBlockNumber = block.number;
    }

    function revealRandomValue(
        uint256 _seed
    ) external override onlyOwner returns (uint256) {
        require(
            seedHash != 0 && blockRandomResult != 0,
            "RandomNumberGenerator: not ready"
        );
        require(
            block.number > requestBlockNumber,
            "RandomNumberGenerator: can not request and reveal in same block"
        );
        uint256 _seedHash = uint256(keccak256(abi.encodePacked(_seed)));
        require(
            _seedHash == seedHash,
            "RandomNumberGenerator: seedHash mismatch"
        );
        randomResult = uint256(blockRandomResult ^ _seed);

        return randomResult;
    }

    function viewRandomResult() external view override returns (uint256) {
        return randomResult;
    }
}
