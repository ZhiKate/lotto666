// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDToken is ERC20("USD Token", "USD") {
    constructor() {
        _mint(msg.sender, 10000000 ether);
    }
}
