const ethers =require("hardhat").ethers;

// 这个是用来先把USDToken和RamdomNumberGenerator smart contracts 先实例化，即先部署到网络里。 因为lotto666 smart contract需要这两个实例化的
//smart contracts,从而实例化lotto666它自己。
async function main() {

    // deploy the USDToken smart contract. 
    const USDToken= await ethers.getContractFactory("USDToken");
    const usdToken= await USDToken.deploy();

    //deploy the RandomNumberGenerator smart contract.
    const RandomNumberGenerator= await ethers.getContractFactory("RandomNumberGenerator");
    const randomNumberGenerator= await RandomNumberGenerator.deploy();

    // console log the contract addresses and contract owner.
    console.log("USDToken Smart Contract deploy to(its address): ", usdToken.address,
    " on fuji testnet deployed by ",
    JSON.stringify(usdToken.signer)    
    );

    console.log("RandomNumberGenerator Smart Contract deploy to(its address): ", randomNumberGenerator.address,
    " on fuji testnet deployed by ",
    JSON.stringify(randomNumberGenerator.signer)    
    );

    console.log("Next Step: Please copy the deployed USDToken and RandomNumberGenerator smart contract addresses, and uses these addresses to deploy lotto666 smart contract(by the script my_lotto666_deploy,js)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })