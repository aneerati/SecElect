// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const endTime = currentTimestampInSeconds + 10000;
  const initialOwner = "0x1aaD1f99fB12AF0C9a9B95BC58967A7596200a38";
  const fee = 10000;
  const candidateNum = 3;

  const lockedAmount = hre.ethers.parseEther("0.001");

  const secElec = await hre.ethers.deployContract("Election", [initialOwner, endTime, fee, candidateNum], {
  });

  await secElec.waitForDeployment();
 
  console.log(
    `Contract deployed to ${secElec.target}`
  );

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
