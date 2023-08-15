const ethers =require("hardhat").ethers;

// 这个是用来测试Lotto666 smart contract的functions。
async function main() {
    // lotto666 contract address.
    // past one:const Lotto="0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
    // renew one: 0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6
    const Lotto="0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
    const USD="0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

    // get the lotto666 contract object to invoke its functions.
    const Lotto666= await ethers.getContractFactory("Lotto666");
    const lotto666= await Lotto666.attach(Lotto);

    const USDToken= await ethers.getContractFactory("USDToken");
    const usdToken= await USDToken.attach(USD);


    // // 1. get the prizes.
    // const prizes= await lotto666.viewRewardsForBracket();
    // console.log("Prizes: ", prizes);

    // // 2. a big number transfer to 6 digits. --> each number of the result is bigger 1 than actual number.
    // const digits1= await lotto666.viewTicketNumber(7610032321);
    // console.log("Digits[1,2,3,4,5,6]: ", digits1);

    // const digits2= await lotto666.viewTicketNumber(8881339633);
    // console.log("Digits[1,2,3,4,6,7]: ", digits2);

    // // 3. the 2 is not true, try to use getRandomTicketNumber() and viewTicketNumber()--> get wrong.
    // const big= await lotto666.getRandomTicketNumber(8881339633);
    // const digits3=await lotto666.viewTicketNumber(big);
    // console.log("Digits[1,2,3,4,6,7]: ", digits3);

    //4. test buy tickets. return digit is [0,1,2,3,4,5]
    // lotto666.buyTickets([7610032321]);
    // const ticketId= lotto666.viewTicketsOfAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    // console.log("actor hold tickets list: ");

    //5. 
   var a= usdToken.balanceOf(Lotto);
   
  //  console.log("it has money"+ String(a));
  a.then((data)=>{
    console.log("get data");
  });


    // process.exit(0);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })