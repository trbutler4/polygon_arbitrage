require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.17",
    networks: {
        hardhat: {
            forking: {
                url: `https://polygon-mainnet.infura.io/v3/${process.env.WEB3_INFURA_PROJECT_ID}`,
            }
        },
        mumbai: {
            chainId: 80001,
            url: `https://polygon-mumbai.infura.io/v3/${process.env.WEB3_INFURA_PROJECT_ID}`,
            accounts: [process.env.DEV_PRIVATE_KEY]
        }
    },
    etherscan: {
        apiKey: process.env.POLYGON_SCAN_API_KEY
    }
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
