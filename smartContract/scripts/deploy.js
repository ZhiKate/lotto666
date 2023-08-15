const { ethers } = require("hardhat");

// deploy to avalanche c-chain
async function main() {
  const usdTokenAddress = "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7"; // usdt
  const randomFactory = await ethers.getContractFactory(
    "RandomNumberGenerator"
  );
  const randomGenerator = await randomFactory.deploy();
  await randomGenerator.deployed();
  console.log(
    "RandomNumberGenerator Contract deployed to: ",
    randomGenerator.address,
    " on fuji testnet deployed by ",
    JSON.stringify(randomGenerator.signer)
  );

  const lottoFactory = await ethers.getContractFactory("Lotto666");
  const lotto666 = await lottoFactory.deploy(
    usdTokenAddress,
    randomGenerator.address,
    "0x67E8284440A145cd812C2A6469A600c237cbC487"
  );
  await lotto666.deployed();
  console.log(
    "Lotto666 Contract deployed to: ",
    lotto666.address,
    " on fuji testnet deployed by ",
    JSON.stringify(lotto666.signer)
  );
  await randomGenerator.transferOwnership(lotto666.address);
  console.log("randomGenerator new owner:", await randomGenerator.owner());

  process.exit(0);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
