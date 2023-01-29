const hre = require("hardhat");
const { networkConfig } = require("../helper-config");


async function main() {
    // deploy contract
    console.log("deploying FlashLoanArbitrage contract...");
    console.log(hre.network.config.chainId);
    const poolAddressesProvider = await networkConfig[hre.network.config.chainId].aavePoolAddressesProvider;
    const uniswapSwapRouter = await networkConfig[hre.network.config.chainId].uniswapSwapRouter;
    const sushiswapSwapRouter = await networkConfig[hre.network.config.chainId].sushiswapSwapRouter;
    const FlashLoanArbitrage = await hre.ethers.getContractFactory("FlashLoanArbitrage");
    const flashLoanArbitrage = await FlashLoanArbitrage.deploy(poolAddressesProvider, uniswapSwapRouter, sushiswapSwapRouter);
    await flashLoanArbitrage.deployed();
    console.log("FlashLoanArbitrage deployed to:", flashLoanArbitrage.address);
};


// enables using async/await in scripts and properly handle errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
