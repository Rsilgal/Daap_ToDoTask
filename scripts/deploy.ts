import { ethers } from "hardhat";

async function main() {
  
  const ToDo = await ethers.getContractFactory("ToDo");
  const toDo = await ToDo.deploy();

  await toDo.deployed();

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
