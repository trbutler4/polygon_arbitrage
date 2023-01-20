const hre = require("hardhat");
const { networkConfig } = require("../helper-config");

const AMOUNT = hre.ethers.utils.parseEther("0.1");

async function getWeth() {
    const { deployer } = await getNamedAccounts();
    console.log("Deployer: ", deployer);
};

getWeth();
