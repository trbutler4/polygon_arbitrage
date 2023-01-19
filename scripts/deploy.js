
const hre = require("hardhat");

async function main() {
    // deploy contract
    const poolAddressesProvider = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb";
    const FlashLoanArbitrage = await hre.ethers.getContractFactory("FlashLoanArbitrage");
    const flashLoanArbitrage = await FlashLoanArbitrage.deploy(poolAddressesProvider);
    await flashLoanArbitrage.deployed();
    console.log("FlashLoanArbitrage deployed to:", flashLoanArbitrage.address);
};


// enables using async/await in scripts and properly handle errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
