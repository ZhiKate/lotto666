const ethers =require("hardhat").ethers;


// 这个是用来把Lotto666 smart contract实例化，即部署到网络里。它需要USDToken contract address和RandomNumberGenerator contract address来实例化。
async function main() {

    //(Fuji)record the addresses, and the owner is the account address that deployed these thress smart contract.
    // const USDToken="0xE9c1A7675f65E2D3cFa899120657DF0F142D1102";
    // const RandomGenerator="0x3fE8736fD18389eb362dE09CB3ceBC171644F695";
    // const OWNER="0x2930561189BfC58d3e1428FE3ADD1212Cc3F653b";

    //(Local)record the addresses, and the owner is the account address that deployed these thress smart contract.
    const USDToken="0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const RandomGenerator="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const TREASURY="0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

    // deploy the Lotto666 smart contract. 
    const Lotto666= await ethers.getContractFactory("Lotto666");
    const lotto666= await Lotto666.deploy(
        USDToken,
        RandomGenerator,
        TREASURY
    );

    // console log the contract addresses and contract owner.
    console.log("Lotto666 Smart Contract deploy to(its address): ", lotto666.address,
    " on fuji testnet deployed by ",JSON.stringify(lotto666.signer)    
    );

    // Following is the way that invoke the deployed smart contract. Therefore, we can use its contract address to set the contract object
    //which can invoke its contract functions. 
    const RandomNumberGenerator= await ethers.getContractFactory("RandomNumberGenerator");
    const randomNumberGenerator= await RandomNumberGenerator.attach(RandomGenerator);

    const USD= await ethers.getContractFactory("USDToken");
    const usdToken= await USD.attach(USDToken);

    // USDToken contract need to allow transfer USD Token to lotto666 smart contract. using its function 
    // approve(contract_address, amount);
    await usdToken.approve(lotto666.address,ethers.constants.MaxUint256);


    // lotto666 smart contract need to use the randomGenerator.Therefore, we need to change the randomGenerator owner
    //(owner will be the lotto666 contract address). Because most of randomGenerator functions just can be invoked by owner.
    await randomNumberGenerator.transferOwnership(lotto666.address);
    console.log("randomGenerator new owner change from(account to lotto666 contract address):", await randomNumberGenerator.owner());

    // process.exit(0);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })