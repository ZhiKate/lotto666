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


function Buy(props) {

    const { updatePool}=props;
    const {jackpot, pool, status, endTime,startTime}=props;
    // const { ethereum } = window;
    const ethereum = (window as any).ethereum;

    const[open,setOpen]=useState(false);


    useEffect(()=>{
      if(status==="Open"){
        setOpen(true);
        return;
      }
        setOpen(false);
    },[])





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


  const pendingStatus=()=>{
    return(
      <div>
        <p>Lottery will open at {startTime} </p>
      </div>
    )
  }

  const openStatus=()=>{
    return(
      <div>
        <p>Lottery will end at {endTime} </p>
      </div>
    )
  }

  const endStatus=()=>{
    return(
      <div>
        <p>Lottery has closed. Look forward to seeing you in the next game.</p>
      </div>
    )
  }
  

  const show=()=>{
    if(status==="Pending"){
      return(
        <div>
          {pendingStatus()}
        </div>
      )
    }
    else if(status==="Open"){
      return(
        <div>
          {openStatus()}
        </div>
      )
    }
    return(
      <div>
        {endStatus()}
      </div>
    )
  }

  return(
    <div>
    <div className="buy_time">
      <p>Pool: {pool}</p>
      {show()}
    </div>
    <Stack direction="column" spacing={2}>
    <Button variant="contained" color="warning" onClick={buyARandomTicket} disabled={!open} >
    Test Buy
    </Button>

    <Button variant="contained" color="success" onClick={buyTenRandomTickets} disabled={!open} >
    Buy ten random tickets
    </Button>

    <Button variant="contained" color="success" disabled={!open} component={Link} to="/user/buy/numberselector" >
     Custom Numbers
    </Button>
    </Stack>

    </div>
  )
}
  
export default Buy;