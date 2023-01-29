const { expect } = require("chai");
const { networkConfig } = require("../helper-config");
const hre = require("hardhat");
const { ethers } = require("hardhat");

describe("FlashLoanArbitrage contract", function () {

    it("should accept deposits", async function () {
        const poolAddressesProvider = networkConfig[hre.network.config.chainId].aavePoolAddressesProvider;
        const uniswapSwapRouter = networkConfig[hre.network.config.chainId].uniswapSwapRouter;
        const sushiswapSwapRouter = networkConfig[hre.network.config.chainId].sushiswapSwapRouter;
        console.log("deploying FlashLoanArbitrage contract...");
        const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
        const flashLoanArbitrage = await FlashLoanArbitrage.deploy(poolAddressesProvider, uniswapSwapRouter, sushiswapSwapRouter);
        await flashLoanArbitrage.deployed();

        await flashLoanArbitrage.deposit({value: 100})
        expect(await ethers.provider.getBalance(flashLoanArbitrage.address)).to.be > 0
    })


    it.only("should swap on uniswap", async function () {
        const poolAddressesProvider = networkConfig[hre.network.config.chainId].aavePoolAddressesProvider;
        const uniswapSwapRouter = networkConfig[hre.network.config.chainId].uniswapSwapRouter;
        const sushiswapSwapRouter = networkConfig[hre.network.config.chainId].sushiswapSwapRouter;
        const matic = networkConfig[hre.network.config.chainId].maticToken;
        const dai = networkConfig[hre.network.config.chainId].daiToken
        const wmatic = networkConfig[hre.network.config.chainId].wmaticToken;

        signer = await ethers.getSigner()
        console.log(`signer: ${signer.address}`)

        const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
        console.log('deploying FlashLoanArbitrage ...')
        const flashLoanArbitrage = await FlashLoanArbitrage.deploy(poolAddressesProvider, uniswapSwapRouter, sushiswapSwapRouter);
        console.log(await flashLoanArbitrage.deployed());

        // fund the contract with matic
        console.log(`signer balance: ${await signer.getBalance()}`)
        const fundAmount = ethers.utils.parseEther("0.00001")
        console.log(`funding contract with: ${fundAmount}`)
        await flashLoanArbitrage.deposit({value: fundAmount})
        console.log('swapping matic for dai')
        const swapAmount = ethers.utils.parseEther("0.00001")
        expect (await flashLoanArbitrage.uniswapSwap(matic, dai, swapAmount)).to.be > 0;
    });

    it("should swap on sushiswap", async function () {
        const poolAddressesProvider = networkConfig[hre.network.config.chainId].aavePoolAddressesProvider;
        const uniswapSwapRouter = networkConfig[hre.network.config.chainId].uniswapSwapRouter;
        const sushiswapSwapRouter = networkConfig[hre.network.config.chainId].sushiswapSwapRouter;
        const matic = networkConfig[hre.network.config.chainId].maticToken;
        const dai = networkConfig[hre.network.config.chainId].daiToken
        const wmatic = networkConfig[hre.network.config.chainId].wmaticToken;

        signer = await ethers.getSigner()
        console.log(`signer: ${signer.address}`)

        const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
        console.log('deploying FlashLoanArbitrage ...')
        const flashLoanArbitrage = await FlashLoanArbitrage.deploy(poolAddressesProvider, uniswapSwapRouter, sushiswapSwapRouter);
        await flashLoanArbitrage.deployed();

        // fund the contract with matic
        console.log(`signer balance: ${await signer.getBalance()}`)
        const fundAmount = ethers.utils.parseEther("1")
        console.log(`funding contract with: ${fundAmount}`)
        await flashLoanArbitrage.depositToken(matic, fundAmount, {from: signer.address})

        console.log('swapping matic for dai')
        const swapAmount = ethers.utils.parseEther("0.1")
        expect (await flashLoanArbitrage.sushiswapSwap(matic, dai, swapAmount)).to.be > 0;
    });

    it("should execute arbitrage", async function () {
        const poolAddressesProvider = networkConfig[hre.network.config.chainId].aavePoolAddressesProvider;
        const uniswapSwapRouter = networkConfig[hre.network.config.chainId].uniswapSwapRouter;
        const sushiswapSwapRouter = networkConfig[hre.network.config.chainId].sushiswapSwapRouter;
        const matic = networkConfig[hre.network.config.chainId].maticToken;
        const dai = networkConfig[hre.network.config.chainId].daiToken
        const wmatic = networkConfig[hre.network.config.chainId].wmaticToken;

        signer = await ethers.getSigner()
        console.log(`signer: ${signer.address}`)

        const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
        console.log('deploying FlashLoanArbitrage ...')
        const flashLoanArbitrage = await FlashLoanArbitrage.deploy(poolAddressesProvider, uniswapSwapRouter, sushiswapSwapRouter);
        await flashLoanArbitrage.deployed();

        // execute flash loan arbitrage
        expect(await flashLoanArbitrage.executeArbitrage(matic, dai, ethers.utils.parseEther("100"))).to.be == true;
    });

});
