// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Election is Ownable{

    constructor(address initialOwner, uint256 endingTime, uint fee, uint candidatesNum) Ownable(initialOwner) {
        raceStatus = true;
        endTime = endingTime;
        entranceFee = fee;
        candidateList = new address[](candidatesNum);
        totalEarnings = 0;
    }

    uint256 endTime;

    // if race has ended or not
    bool raceStatus;

    // fee candidates must pay
    uint256 entranceFee;

    uint256 currentCandidatesNum;

    address[] candidateList;

    uint256 totalEarnings;


    function getTime() public view returns(uint) {
        return block.timestamp;
    }

    function getEndTime() public view returns(uint) {
        return endTime;
    }

    function getEntraceFee() public view returns(uint) {
        return entranceFee;
    }

    function getRaceStatus() public view returns(bool) {
        return raceStatus;
    }

    function getNumOfCandidates() public view returns(uint) {
        return currentCandidatesNum;
    }


    // create election instance
    function createElection(uint256 endingTime, uint fee, uint candidatesNum) public {
        raceStatus = true;
        endTime = endingTime;
        entranceFee = fee;
        candidateList = new address[](candidatesNum);
        totalEarnings = 0;
    }

    function enterRace() public payable {
        if (getEndTime() > endTime) {
            raceStatus = false;
        }

        require(raceStatus == true);
        require(msg.value == entranceFee);

        totalEarnings = totalEarnings + msg.value;
        
        candidateList[currentCandidatesNum] = msg.sender;
        currentCandidatesNum++;


    }

     function receiveFunds() public onlyOwner{
        require(getTime() > endTime);
        
        payable(owner()).transfer(totalEarnings);
    }


}
