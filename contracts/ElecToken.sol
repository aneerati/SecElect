pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ElecToken is ERC20 {
    constructor(uint256 initialSupply, address contractOwner) ERC20("ElecToken", "ELC") {
        _mint(contractOwner, initialSupply);
    }
}
