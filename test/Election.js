const {time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");


const feeToEnterRace = 10000;

describe("Election", function() {

  async function deployContractFixture() {

      const endTime = await time.latest() + 10000;

      const [owner, candidate, voter, candidate2, electionContractAddress] = await ethers.getSigners();

      const ElectionFactory = await ethers.getContractFactory("Election");
      const electionContract = await ElectionFactory.deploy(owner, endTime, feeToEnterRace, 3);

      //const electionContract = new ethers.Contract(ElectionFactory, ElectionFactory.interface, electionContractAddress);

      //const electionContract = new ethers.Contract('contract address goes here', abi, provider);

      await electionContract.connect(candidate).enterRace({value: feeToEnterRace});

      await electionContract.connect(owner).distributeToken(voter, 10);

      const ElecTokenFactory = await ethers.getContractFactory("ElecToken");

      let address = await electionContract.getTokenAddress();
      const elecTokenContract = ElecTokenFactory.attach(
        address
      );

      let electionAddress = await electionContract.getThisAddress();
      
      await elecTokenContract.connect(voter).approve(electionAddress, 10);

      return {electionContract, owner, candidate, voter, candidate2, endTime};
  }

  describe("Cannot vote or run after election has ended", function() {

    it("Should allow voting before end time", async function() {
      const {electionContract, owner, candidate, voter, candidate2, endTime} = await loadFixture(deployContractFixture);

      await expect(electionContract.connect(voter).vote(candidate, 5)).not.to.be.reverted;
    })

    it("Should not allow voting after end time", async function() {
      const {electionContract, owner, candidate, voter, candidate2, endTime} = await loadFixture(deployContractFixture);

      await time.increaseTo(endTime + 2);

      await expect(electionContract.connect(voter).vote(candidate, 5)).to.be.revertedWith(
        "The election has ended"
      );
    })

  })
})