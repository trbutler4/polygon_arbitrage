const { expect } = require("chai");

describe("FlashLoanArbitrage contract", function () {
  it("Should deploy", async function () {
    const poolAddressesProvider = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb";
    const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
    const flashLoanArbitrage = await FlashLoanArbitrage.deploy(poolAddressesProvider);
    await flashLoanArbitrage.deployed();

    expect(await flashLoanArbitrage.ADDRESSES_PROVIDER()).to.equal(poolAddressesProvider);
  });

});
