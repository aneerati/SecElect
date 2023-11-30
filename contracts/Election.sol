// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./ElecToken.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Election is Ownable{

    uint256 endTime;

    // fee candidates must pay
    uint256 entranceFee;

    address[] candidateList;

    mapping(address => uint256) voteCount; //a mapping of the candidate address to the amonut of votes they have

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

        token = new ElecToken(1000, address(this)); //create a new ERC20 token instance that exists within the contract
    }

    function getTokenAddress() public view returns (address) {
        return address(token);
    }

    function getThisAddress() public view returns (address) {
        return address(this);
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
        token.transfer(voter, quantity); //transfers the contract's balance of tokens to the address
    }

    function vote(address candidate, uint32 quantity) public electionHasEnded {
        //if voteCount[address] is 0, then the the address is not a candidate
        //if it isn't 0, it is
        require(voteCount[candidate] != 0, "This address is not a candidate");
        require(voteCount[msg.sender] == 0, "Candidates cannot vote"); 
        
        //transfer quantity of tokens from the msg.sender to this contract
        //requires that msg.sender gave this contract an allowance beforehand
        token.transferFrom(msg.sender, address(this), quantity); //transferFrom will fail if voter does not have enough coins
        
        voteCount[candidate] += quantity;

    }

    //function for determining whether the event has ended
    function hasEnded() public view returns (bool) {
        return (block.timestamp > endTime);
    }

    
    function enterRace() public payable electionHasEnded{
        require(msg.value == entranceFee, "You did not pay enough to be in the race!");
        require(voteCount[msg.sender] == 0, "You are already in the race!");

        totalEarnings = totalEarnings + msg.value;
        
        candidateList.push(msg.sender); //add the sender to the list of candidates to vote for
        
        //start the voteCount of candidate (this assumes the candidate is voting for themselves)
        voteCount[msg.sender] = 1; 
    }


    function receiveFunds() public onlyOwner electionHasEnded {
        
        payable(owner()).transfer(totalEarnings);
    }

    function winner() public view electionHasEnded returns (address) {

        //simple find Maximum algorithm
        address winnerAddress = address(0);
        uint maxVotes = 0; //0 is the lowest amount of votes possible
        for (uint i = 0; i < candidateList.length; i++) {
            if (voteCount[candidateList[i]] > maxVotes) {
                maxVotes = voteCount[candidateList[i]];
                winnerAddress = candidateList[i];
            }
        }

        return winnerAddress;
    }
}