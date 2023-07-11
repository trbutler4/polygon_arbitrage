const { expect } = require("chai");
const { networkConfig } = require("../helper-config");
const hre = require("hardhat");
const { ethers } = require("hardhat");
const { setBalance } = require("@nomicfoundation/hardhat-network-helpers");
const daiAbi = require("../abis/dai.json")
const wethAbi = require("../abis/weth.json")
const wmaticAbi = require("../abis/wmatic.json")

describe("FlashLoanArbitrage contract", function () {

    const poolAddressesProvider = networkConfig[hre.network.config.chainId].aavePoolAddressesProvider;
    const uniswapSwapRouter = networkConfig[hre.network.config.chainId].uniswapSwapRouter;
    const sushiswapSwapRouter = networkConfig[hre.network.config.chainId].sushiswapSwapRouter;
    const matic = networkConfig[hre.network.config.chainId].maticToken;
    const dai = networkConfig[hre.network.config.chainId].daiToken
    const weth = networkConfig[hre.network.config.chainId].wethToken;
    const wmatic = networkConfig[hre.network.config.chainId].wmaticToken;


    let flashLoanArbitrage;
    let signer;

    before(async function () {
        console.log("deploying FlashLoanArbitrage contract...");
        const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
        flashLoanArbitrage = await FlashLoanArbitrage.deploy(poolAddressesProvider, uniswapSwapRouter, sushiswapSwapRouter);
        await flashLoanArbitrage.deployed();

        // start signer with 1000 matic 
        const startingBalance = ethers.utils.parseEther("1000")
        signer = await ethers.getSigner()
        await setBalance(signer.address, startingBalance);
    })

    it("should accept deposits", async function () {
        await flashLoanArbitrage.deposit({value: 100})
        expect(await ethers.provider.getBalance(flashLoanArbitrage.address)).to.be > 0
    });


    it("should swap on uniswap", async function () {
        // get wmatic 
        const wmaticContract = new ethers.Contract(wmatic, wmaticAbi, signer);
        const depositAmount = ethers.utils.parseEther('5');
        console.log(`Wrapping ${ethers.utils.formatEther(depositAmount)} matic...`)
        let tx = await wmaticContract.deposit({value: depositAmount})
        await tx.wait(1)
        let wmaticBalance = await wmaticContract.balanceOf(signer.address)
        wmaticBalance = ethers.utils.formatEther(wmaticBalance.toString())
        console.log(`Signer WMATIC balance: ${wmaticBalance}`)

        // get dai balance
        const daiContract = new ethers.Contract(dai, daiAbi, signer)  
        const daiBalance = await daiContract.balanceOf(signer.address)
        console.log(`signer DAI balance: ${daiBalance}`)

        const amount = ethers.utils.parseEther("0.1")
        console.log('funding contract...')
        await flashLoanArbitrage.deposit({value: amount + 1})

        console.log('swapping wmatic for dai')
        const amountOut = await flashLoanArbitrage.uniswapSwap(wmatic, dai, amount, {gasLimit: 3e5})

        console.log(`amount out: ${amountOut} dai`);
        expect(amountOut).to.be > 0; 
        console.log('repaying dai..');
        amountOut = await flashLoanArbitrage.uniswapSwap(dai, matic, amountOut);
        console.log(`amount out: ${amountOut} matic`);
        expect(amountOut).to.be > 0;
    });

    /*

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

    */

});
