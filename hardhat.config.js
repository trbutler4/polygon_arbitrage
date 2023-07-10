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
                url: process.env.POLYGON_MAINNET_RPC_URL,
            }
        },
        mumbai: {
            chainId: 80001,
            url: process.env.POLYGON_MUMBAI_RPC_URL,
            accounts: [process.env.DEV_PRIVATE_KEY]
        }
    },
    etherscan: {
        apiKey: process.env.POLYGONSCAN_API_KEY
    }
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
