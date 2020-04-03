pragma solidity ^0.4.18;

import "./ERC223.sol";

contract Saturn223 is ERC223I {
  function Saturn223() public {
    name = "Saturn 223 OG";
    symbol = "SATURNOG";
    decimals = 4;
    totalSupply = 1000000000 * 10**uint256(decimals);
    balances[msg.sender] = totalSupply;
  }
}
