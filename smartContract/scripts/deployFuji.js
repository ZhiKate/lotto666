// deploy to fuji testnet
async function main() {
  // const usdFactory = await ethers.getContractFactory("USDToken");
  // const usdToken = await usdFactory.deploy();
  // await usdToken.deployed();
  // console.log(
  //   "usdToken Contract deployed to: ",
  //   usdToken.address,
  //   " on fuji testnet deployed by ",
  //   JSON.stringify(usdToken.signer)
  // );
  // const usdTokenAddress = usdToken.address;
  const usdTokenAddress = "0x8dAF41395b810Ef556aeaf07556Fd75060B73B22";

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

  //   usdToken Contract deployed to:  0x8dAF41395b810Ef556aeaf07556Fd75060B73B22  on fuji testnet deployed by  "<SignerWithAddress 0x67E8284440A145cd812C2A6469A600c237cbC487>"
  // RandomNumberGenerator Contract deployed to:  0xbF69B4673bB4c4FD21b4C848cE47e0EFA2aC9CD9  on fuji testnet deployed by  "<SignerWithAddress 0x67E8284440A145cd812C2A6469A600c237cbC487>"
  // Lotto666 Contract deployed to:  0x291fF62b5f8e2BE5A20A1f1950c7f677a50E4474  on fuji testnet deployed by  "<SignerWithAddress 0x67E8284440A145cd812C2A6469A600c237cbC487>"
  // randomGenerator new owner: 0x67E8284440A145cd812C2A6469A600c237cbC487
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
