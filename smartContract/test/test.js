/* eslint-disable no-undef */
import { expect } from "chai";
import {
  loadFixture,
  mine,
  time,
  //   setNextBlockTimestamp,
} from "@nomicfoundation/hardhat-network-helpers";
import pkg from "@nomicfoundation/hardhat-network-helpers";
// import { ethers } from "hardhat";

describe("Token contract", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const usdToken = await ethers.deployContract("USDToken");
    const randomGenerator = await ethers.deployContract(
      "RandomNumberGenerator"
    );
    const lotto666 = await ethers.deployContract("Lotto666", [
      usdToken.address,
      randomGenerator.address,
      addr1.address,
    ]);
    await randomGenerator.transferOwnership(lotto666.address);
    await usdToken.transfer(addr1.address, ethers.utils.parseEther("1000"));
    await usdToken.transfer(addr2.address, ethers.utils.parseEther("10000"));

    // Fixtures can return anything you consider useful for your tests
    return { usdToken, randomGenerator, lotto666, owner, addr1, addr2 };
  }

  it("check owner", async function () {
    const { randomGenerator, lotto666, owner } = await loadFixture(
      deployTokenFixture
    );
    // const randomNumber = await randomGenerator.requestRandomValue();
    // console.log("RandomNumberGenerator owner:", await randomGenerator.owner());
    // console.log("Lotto666 address:", lotto666.address);
    // console.log("Lotto666 owner:", await lotto666.owner());
    // console.log("randomGenerator address:", randomGenerator.address);
    expect(await randomGenerator.owner()).to.equal(lotto666.address);
    expect(await lotto666.owner()).to.equal(owner.address);
  });

  it("test generate ticket and show the number", async function () {
    const { lotto666 } = await loadFixture(deployTokenFixture);

    const ticketNumber = await lotto666.getRandomTicketNumber(
      BigInt(1234567890)
    );
    const viewTicketNumber = await lotto666.viewTicketNumber(ticketNumber);
    // console.log("viewTicketNumber:", viewTicketNumber.toString());
    expect(viewTicketNumber.toString()).to.equal("7,13,23,24,25,57");

    const ticketNumber2 = await lotto666.getRandomTicketNumber(
      BigInt(
        "34513695901386538358144367431959917511498001384976158701689972172069434217904"
      )
    );
    const viewTicketNumber2 = await lotto666.viewTicketNumber(ticketNumber2);
    // console.log("viewTicketNumber2:", viewTicketNumber2.toString());
    expect(viewTicketNumber2.toString()).to.equal("9,10,12,31,38,62");
  });

  it("test random generator", async function () {
    const randomGenerator = await ethers.deployContract(
      "RandomNumberGenerator"
    );
    const randomSeed = ethers.utils.keccak256("0x1234567890");
    const randomHash = ethers.utils.keccak256(randomSeed);
    const zero = await randomGenerator.viewRandomResult();
    await randomGenerator.requestRandomValue(randomHash);
    await mine();
    await randomGenerator.revealRandomValue(randomSeed);
    // console.log("randomNumber:", randomNumber);
    const result = await randomGenerator.viewRandomResult();
    // console.log("result:", result.toString());
    expect(zero.toString()).to.equal("0");
    expect(result.toString()).not.to.equal("0");
  });

  it("test buy, draw and claim", async function () {
    const { usdToken, owner, lotto666, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );

    // to get claim prize, we need to reward tickets which match 1 number...
    await lotto666.setRewardsBreakdown([20, 10, 10, 10, 10, 40]);
    const now = Math.floor(Date.now() / 1000);
    const oneHourLater = now + 3600;
    await lotto666.resetForNewLottery(oneHourLater, 0);
    await time.setNextBlockTimestamp(oneHourLater);
    // mine();
    await lotto666.startLottery();

    await usdToken
      .connect(addr1)
      .approve(lotto666.address, ethers.utils.parseEther("1000"));
    // ethers.BigNumber.from(ethers.utils.randomBytes(32))

    const ticketOne = await lotto666.getRandomTicketNumber(
      ethers.BigNumber.from(ethers.utils.randomBytes(32))
    );

    const ticketTwo = await lotto666.getRandomTicketNumber(
      ethers.BigNumber.from(ethers.utils.randomBytes(32))
    );

    const ticketThree = await lotto666.getRandomTicketNumber(
      ethers.BigNumber.from(ethers.utils.randomBytes(32))
    );

    await lotto666
      .connect(addr1)
      .buyTickets([ticketOne, ticketTwo, ticketThree]);

    const currentTicketId = await lotto666.currentTicketId();
    // console.log("currentTicketId:", currentTicketId.toString());

    const buyedTicket3 = await lotto666.viewTicket(currentTicketId - 1);
    const buyedTicket2 = await lotto666.viewTicket(currentTicketId - 2);
    const buyedTicket1 = await lotto666.viewTicket(currentTicketId - 3);

    expect(buyedTicket1[2].toString()).to.equal(addr1.address.toString());
    expect(buyedTicket2[2].toString()).to.equal(addr1.address.toString());
    expect(buyedTicket3[2].toString()).to.equal(addr1.address.toString());

    const balanceOfUSD = await usdToken.balanceOf(addr1.address);
    // console.log("balanceOfUSD:", balanceOfUSD.toString());
    expect(balanceOfUSD.toString()).to.equal(
      ethers.utils.parseEther("994").toString()
    );

    // addr2 buy ticket
    await usdToken
      .connect(addr2)
      .approve(lotto666.address, ethers.utils.parseEther("1000"));
    for (let i = 0; i < 10; i++) {
      const ticket1 = await lotto666.getRandomTicketNumber(
        ethers.BigNumber.from(ethers.utils.randomBytes(32))
      );
      const ticket2 = await lotto666.getRandomTicketNumber(
        ethers.BigNumber.from(ethers.utils.randomBytes(32))
      );
      await lotto666.connect(addr2).buyTickets([ticket1, ticket2]);
    }

    const balanceOfUSD2 = await usdToken.balanceOf(addr2.address);
    expect(balanceOfUSD2.toString()).to.equal(
      ethers.utils.parseEther("9960").toString()
    );

    // draw lottery
    const endTime = oneHourLater + 3600 * 24 * 5;
    await time.setNextBlockTimestamp(endTime);
    await lotto666.closeLottery();
    const randomSeed = ethers.utils.randomBytes(32);
    const randomHash = ethers.utils.keccak256(randomSeed);
    await lotto666.requestRandomness(ethers.BigNumber.from(randomHash));
    await lotto666.revealRandomness(ethers.BigNumber.from(randomSeed));

    const ticketNumber = (await lotto666.currentTicketId()).toNumber();
    console.log("ticketNumber:", ticketNumber);

    let prizedTicketIndexs = [];
    for (let index = 0; index < ticketNumber; index++) {
      const result = await lotto666.viewTicket(index);
      //   console.log("result:", result);
      //   console.log("result bracket : ", result[1].toString());
      const bracket = result[1].toString();
      const prizeOwner = result[2].toString();
      if (prizeOwner == addr2.address) {
        console.log("win prize: ", bracket);
        prizedTicketIndexs.push(ethers.BigNumber.from(index));
      }
    }
    const addr2Tickets = await lotto666.viewClaimableTicketsOfAddress(
      addr2.address
    );
    // console.log("addr2Tickets:", addr2Tickets);
    expect(addr2Tickets.length).to.equal(prizedTicketIndexs.length);
    if (prizedTicketIndexs.length > 0) {
      // get money.
      await lotto666.connect(addr2).claimTickets(prizedTicketIndexs);
      const balanceOfUSD3 = await usdToken.balanceOf(addr2.address);
      expect(balanceOfUSD3.toString()).not.equal(balanceOfUSD2.toString());
      console.log("balanceOfUSD3:", balanceOfUSD3.toString());
    }

    const endRewarding = endTime + 3600 * 24 * 2;
    await time.setNextBlockTimestamp(endRewarding);
    await lotto666.resetForNewLottery(endRewarding + 3600, 0);

    const balanceOfContract = await usdToken.balanceOf(lotto666.address);
    const jackpotAmount = await lotto666.jackpotAmount();
    console.log("jackpotAmount:", jackpotAmount.toString());
    expect(balanceOfContract.toString()).to.equal(jackpotAmount.toString());
  });

  it("test crash", async function () {
    const { lotto666 } = await loadFixture(deployTokenFixture);
    // this code will crash...
    // uint256 index = 65;
    // for (uint256 i = 0; i < 6; index--) {
    //     if (numbers[index] == 1) {
    //         current = current * 66 + index;
    //         i++;
    //         // although i equals 6, the loop will continue to calculate index--, then it will crash..
    //         // console.log("Index:  %s, i : %s", index - 1, i);
    //     }
    // }
    const randomNumber = ethers.BigNumber.from(
      "0x8100a8262fbe75233bb1f39bf6dd920cf8e825bc952f7779fc1e04365636f752"
    );
    const ticketNumber = await lotto666.getRandomTicketNumber(randomNumber);
    const viewTicketNumber = await lotto666.viewTicketNumber(ticketNumber);
    console.log("viewTicketNumber:", viewTicketNumber.toString());
  });
});
