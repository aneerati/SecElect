// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./ElecToken.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Election is Ownable{

    uint256 endTime; //1701131621

    // fee candidates must pay
    uint256 entranceFee;

    address[] candidateList;

    mapping(address => uint256) voteCount;

    ElecToken token;

    uint256 totalEarnings;

    modifier electionHasEnded() {
        require(!hasEnded(), "The election has ended");
        _;
    }

    // create election instance
    constructor(address initialOwner, uint256 endingTime, uint fee, uint candidatesNum) Ownable(initialOwner) {
        endTime = endingTime;
        entranceFee = fee;
        candidateList = new address[](candidatesNum);
        totalEarnings = 0;

        token = new ElecToken(1000);
    }

    function getTokenAddress() public view returns (address) {
        return address(token);
    }

    function getTime() public view returns (uint) {
        return block.timestamp;
    }

    function getEndTime() public view returns (uint) {
        return endTime;
    }

    function getEntraceFee() public view returns (uint) {
        return entranceFee;
    }

    function distributeToken(address voter, uint quantity) public onlyOwner {
        token.transfer(voter, quantity);
    }

    function vote(address candidate, uint32 quantity) public onlyOwner electionHasEnded {
        token.transferFrom(msg.sender, address(this), quantity); //transferFrom will fail if voter does not have enough coins
        
        voteCount[candidate] += quantity;

    }

    // reset election instance
    function resetElection(uint256 endingTime, uint fee, uint candidatesNum) public electionHasEnded {
        endTime = endingTime;
        entranceFee = fee;
        candidateList = new address[](candidatesNum);
        totalEarnings = 0;
    }

    function hasEnded() public view returns (bool) {
        return (getEndTime() > endTime);
    }

    function enterRace() public payable electionHasEnded{
        require(msg.value == entranceFee, "You did not pay enough to be in the race!");
        require(voteCount[msg.sender] == 0, "You are already in the race!");

        totalEarnings = totalEarnings + msg.value;
        
        candidateList.push(msg.sender);
        voteCount[msg.sender] = 1;
    }

    function receiveFunds() public onlyOwner {
        require(getTime() > endTime);
        
        payable(owner()).transfer(totalEarnings);
    }

}