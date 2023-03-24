pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingToken is ERC20, Ownable {
    constructor() ERC20("Staking Token", "STT") {
        uint256 totalSupply = 500000000 * 10 ** decimals();
        _mint(msg.sender, totalSupply);
        
        // Send 10% of the total supply to a given wallet address
        uint256 tenPercent = totalSupply / 10;
        _transfer(msg.sender, 0x4a78a8ac0c301D5f71Fbea7Bf797a2200403f28A, tenPercent);
    }
}
