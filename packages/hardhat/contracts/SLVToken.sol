// contracts/SLVToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract SLVToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Silver", "SLV") {
        _mint(address(0xc5eB73eC67d451C18C4042bC30485609c5F80cC3), initialSupply);
    }
}
