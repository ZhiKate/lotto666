import { useCallback, useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import Button from "@mui/material/Button";
import React from "react";
import { Link } from 'react-router-dom'
import { Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
// import config from "./config";
import USDToken from "../../constant_contract/USDToken.json";
// import RandomNumberGenerator.sol from './artifacts/contracts/RandomNumberGenerator.sol.sol/RandomNumberGenerator.sol.json'
import Lotto666 from "../../constant_contract/Lotto666.json";
import Address from "../../constant_contract/Address_Local";


function Buy() {
    // const { ethereum } = window;
    const ethereum = (window as any).ethereum;
    async function buyARandomTicket() {
        if (ethereum === undefined) {
        return;
        }
        try {
        // setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            Address.LOTTO666_ADDRESS,
            Lotto666.abi,
            signer
        );

        const randomValue = ethers.BigNumber.from(ethers.utils.randomBytes(32));
        const ticketNumber = await contract.getRandomTicketNumber(randomValue);
        const transaction = await contract.buyTickets([ticketNumber]);
        await transaction.wait();
        const ticketNumber666 = await contract.viewTicketNumber(ticketNumber);
        // setToast("Buy Success! Ticket Number 666: " + ticketNumber666.toString());
        console.log("gas used: ", transaction.gasLimit.toString());
        // setLoading(false);
        } catch (error) {
        // setLoading(false);
        console.log("Error: ", error);
        const msg = error.message;
        // setErrorToast(msg);
    }
  }

  async function buyTenRandomTickets() {
    if (ethereum === undefined) {
      return;
    }
    try {
      // setLoading(true);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        Address.LOTTO666_ADDRESS,
        Lotto666.abi,
        signer
      );
      const list: ethers.BigNumber[] = [];
      for (let i = 0; i < 10; i++) {
        const randomValue = ethers.BigNumber.from(ethers.utils.randomBytes(32));
        const ticketNumber = await contract.getRandomTicketNumber(randomValue);
        list.push(ticketNumber);
      }
      const transaction = await contract.buyTickets(list);
      await transaction.wait();
      // setToast("Buy Success! ");
      console.log("gas used: ", transaction.gasLimit.toString());
      // setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.log("Error: ", error);
      const msg = error.message;
      // setErrorToast(msg);
    }
  }

  return(
    <Stack direction="column" spacing={2}>
    <Button variant="contained" color="warning" onClick={buyARandomTicket}>
    Test Buy
    </Button>

    <Button variant="contained" color="success" onClick={buyTenRandomTickets}>
    Buy ten random tickets
    </Button>

    <Button variant="contained" color="success" component={Link} to="/user/buy/numberselector">
     Custom Numbers
    </Button>
    </Stack>
  )
}
  
export default Buy;