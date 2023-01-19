const { networkConfig } = require("./helper-hardhat-config");
const hre = require("hardhat");

async function main() {
    // deploy contract
    const poolAddressesProvider = networkConfig[hre.network.config.chainId].aavePoolAddressesProvider;
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
