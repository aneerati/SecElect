// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract Election {
    uint256 endTime; //1701131621

    // if race has ended or not
    bool raceStatus;

    // fee candidates must pay
    uint256 entranceFee;

    uint256 currentCandidatesNum;

    address[] candidateList;

    // create election instance
    constructor(uint256 endingTime, uint fee, uint candidatesNum) {
        raceStatus = true;
        endTime = endingTime;
        entranceFee = fee;
        candidateList = new address[](candidatesNum);
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

    function getRaceStatus() public view returns (bool) {
        return raceStatus;
    }

    function getNumOfCandidates() public view returns (uint) {
        return currentCandidatesNum;
    }

    function enterRace() public payable {
        if (block.timestamp > endTime) {
            raceStatus = false;
        }

        require(raceStatus == true);

        candidateList[currentCandidatesNum] = msg.sender;
        currentCandidatesNum++;
    }
}
