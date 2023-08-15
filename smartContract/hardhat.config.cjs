require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.6",
  paths: {
    artifacts: "./src/artifacts",
  },
  // networks: {
  //   fuji: {
  //     url: process.env.QUICKNODE_URL,
  //     accounts: [`0x` + process.env.PRIVATE_KEY],
  //     chainId: 43113,
  //   },
  //   avax: {
  //     url: process.env.QUICKNODE_URL,
  //     accounts: [`0x` + process.env.PRIVATE_KEY],
  //     chainId: 43113,
  //   },
  // },
};
