const { expect } = require("chai");
const { networkConfig } = require("../helper-config");
const hre = require("hardhat");

describe("FlashLoanArbitrage contract", function () {
  it("Should deploy", async function () {
    const poolAddressesProvider = networkConfig[hre.network.config.chainId].aavePoolAddressesProvider;
    console.log("poolAddressesProvider: ", poolAddressesProvider);
    const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
    const flashLoanArbitrage = await FlashLoanArbitrage.deploy(poolAddressesProvider);
    await flashLoanArbitrage.deployed();

    expect(await flashLoanArbitrage.ADDRESSES_PROVIDER()).to.equal(poolAddressesProvider);
  });

});
