const { expect } = require("chai");
const { networkConfig } = require("../../helper-config");
const hre = require("hardhat");
const { ethers } = require("hardhat");
const { setBalance } = require("@nomicfoundation/hardhat-network-helpers")

describe("UniswapExample contract", function () {
    const SWAP_ROUTER = networkConfig[hre.network.config.chainId].uniswapSwapRouter;
    const WETH = networkConfig[hre.network.config.chainId].wethToken;
    const DAI = networkConfig[hre.network.config.chainId].daiToken;

    let uniswapExample;
    let signer;

    before(async function () {

        // deploy contract 
        const UniswapExample = await ethers.getContractFactory("UniswapExample");
        uniswapExample = await UniswapExample.deploy(
            SWAP_ROUTER,
            DAI,
            WETH
        );

        // get signer 
        [signer] = await ethers.getSigners();
    });

    it("Should swap", async function () {
        console.log(`Signer: ${signer.address}`)

        // get matic balance 
        let maticBalance = await ethers.provider.getBalance(ethers.constants.AddressZero)
        maticBalance = await ethers.utils.formatEther(maticBalance)
        console.log(`Matic Balance: ${maticBalance} MATIC`)

        expect(1).to.be == 0
    })

});
