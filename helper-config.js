const networkConfig = {
    31337: {
        name: 'hardhat',
        wethToken: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        maticToken: '0x0000000000000000000000000000000000001010',
        wmaticToken: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        daiToken: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        aavePoolAddressesProvider: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
        uniswapSwapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        sushiswapSwapRouter: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"
    },
    137: {
        name: 'polygon-mainnet',
    },
    80001: {
        name: 'polygon-mumbai',
        maticToken: '0xFb4a42f442E53C95Bb30Dc6505E7f39bb121EbF2',
        wmaticToken: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
        daiToken: '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253',
        aavePoolAddressesProvider: "0xeb7A892BB04A8f836bDEeBbf60897A7Af1Bf5d7F",
        uniswapSwapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        sushiswapSwapRouter: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"
    }
};

module.exports = { networkConfig };
