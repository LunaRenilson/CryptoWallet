// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Lunaris} from "./Lunaris.sol";
import {Test} from "forge-std/Test.sol";

// Solidity tests are compatible with foundry, so they
// use the same syntax and offer the same functionality.

contract Lunaristest is Test {
  Lunaris lunaris;

  function setUp() public {
    lunaris = new Lunaris();
  }

  function testName() public view {
    assertEq(lunaris.name(), "Lunaris");
  }

  // Intentionally failing test to demonstrate test failure reporting
  function testBalanceOf() public view {
    uint256 totalSupply = lunaris.totalSupply();
    assertEq(lunaris.balanceOf(address(this)), totalSupply, "Deployer should have the half of the total supply");
  }

  function testTransfer() public {
    address reciever = address(0x123);
    uint256 amount = 1000 * uint256(lunaris.decimals());

    uint256 initialSenderBalance = lunaris.balanceOf(address(this));
    uint256 initialRecieverBalance = lunaris.balanceOf(reciever);

    bool success = lunaris.transfer(reciever, amount);
    assertTrue(success, "Transfer should succeed");
    assertEq(lunaris.balanceOf(address(this)), initialSenderBalance - amount, "Sender balance should decrease by amount");
    assertEq(lunaris.balanceOf(reciever), initialRecieverBalance + amount, "Reciever balance should increase by amount");
  }
}
