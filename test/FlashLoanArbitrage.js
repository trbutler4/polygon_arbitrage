const { expect } = require("chai");
const { networkConfig } = require("../helper-config");
const hre = require("hardhat");
const { ethers } = require("hardhat");

describe("FlashLoanArbitrage contract", function () {
    it("Should deploy", async function () {
        const poolAddressesProvider = networkConfig[hre.network.config.chainId].aavePoolAddressesProvider;
        const uniswapSwapRouter = networkConfig[hre.network.config.chainId].uniswapSwapRouter;
        //console.log("poolAddressesProvider: ", poolAddressesProvider);
        //console.log("uniswapSwapRouter: ", uniswapSwapRouter);
        console.log("deploying FlashLoanArbitrage contract...");
        const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
        const flashLoanArbitrage = await FlashLoanArbitrage.deploy(poolAddressesProvider, uniswapSwapRouter);
        await flashLoanArbitrage.deployed();

        expect(await flashLoanArbitrage.ADDRESSES_PROVIDER()).to.equal(poolAddressesProvider);
    });

    it("should accept deposits", async function () {
        const poolAddressesProvider = networkConfig[hre.network.config.chainId].aavePoolAddressesProvider;
        const uniswapSwapRouter = networkConfig[hre.network.config.chainId].uniswapSwapRouter;
        //console.log("poolAddressesProvider: ", poolAddressesProvider);
        //console.log("uniswapSwapRouter: ", uniswapSwapRouter);
        console.log("deploying FlashLoanArbitrage contract...");
        const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
        const flashLoanArbitrage = await FlashLoanArbitrage.deploy(poolAddressesProvider, uniswapSwapRouter);
        await flashLoanArbitrage.deployed();

        await flashLoanArbitrage.deposit({value: 100})
        expect(await ethers.provider.getBalance(flashLoanArbitrage.address)).to.be > 0
    })

    it("Should flash loan");

    it("should swap tokens", async function () {
        const poolAddressesProvider = networkConfig[hre.network.config.chainId].aavePoolAddressesProvider;
        const uniswapSwapRouter = networkConfig[hre.network.config.chainId].uniswapSwapRouter;
        const matic = networkConfig[hre.network.config.chainId].maticToken;
        const dai = networkConfig[hre.network.config.chainId].daiToken
        const wmatic = networkConfig[hre.network.config.chainId].wmaticToken;

        signer = await ethers.getSigner()
        console.log(`signer: ${signer.address}`)

        const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
        console.log('deploying FlashLoanArbitrage ...')
        const flashLoanArbitrage = await FlashLoanArbitrage.deploy(poolAddressesProvider, uniswapSwapRouter);
        await flashLoanArbitrage.deployed();

        // fund the contract with matic 
        console.log(`signer balance: ${await signer.getBalance()}`)
        const fundAmount = ethers.utils.parseEther("1")
        console.log(`funding contract with: ${fundAmount}`)
        await flashLoanArbitrage.depositToken(matic, fundAmount, {from: signer.address})
        console.log('swapping matic for dai')
        const swapAmount = ethers.utils.parseEther("0.1")
        expect (await flashLoanArbitrage.uniswapSwapExactInputSingle(matic, dai, swapAmount)).to.be > 0;
    });


});
