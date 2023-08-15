

import { useCallback, useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from "react";
import { Link } from 'react-router-dom'
import { Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import USDToken from "../../constant_contract/USDToken.json";
import Lotto666 from "../../constant_contract/Lotto666.json";
import Address from "../../constant_contract/Address_Local";


function Fund(props) {
    //state
    const {status,pool,jackpool,treasuryFee,treasuryAddress,rewardsBreakdown}=props;
    //update state
    const {updateRewardsBreakdown,updateTreasuryFee,updateTreasury}=props;

    const ethereum = (window as any).ethereum;
    const [feeOpen, setFeeOpen]=useState(false);

    const [fee,setFee]=useState(0);// treasury fee
    const [move,setMove]=useState(0);// treasury fee
    const [listFee,setListFee]=useState(); // rewardsBreakdown
    const [address,setAddress]=useState(""); //treasury address

    // 1. Lottery only can set the treasury fee before the open lottery (can do at status pending).
    const changeTreasuryFee=async(e)=>{
         if (ethereum === undefined) {
          return;
        }
        try {
            //   setLoading(true);
              const provider = new ethers.providers.Web3Provider(ethereum);
              const signer = provider.getSigner();
              const contract = new ethers.Contract(
                Address.LOTTO666_ADDRESS,
                Lotto666.abi,
                signer
              );
        
              console.log("fee: "+ fee);
              const num=Number(fee);
              const transaction = await contract.setTreasuryFee(num);
              await transaction.wait();
              updateTreasuryFee();
              console.log("change treasury fee successfully!");
              // const updateStatus=await contract.status();
              // setStatus(stage[updateStatus]);
            //   updateStatus();
              console.log("startLottory: "+status);
    
        
            //   setToast("Success");
            //   setLoading(false);
            } catch (error) {
            //   setLoading(false);
              console.log("Error: ", error);
              const msg = error.message;
            //   setErrorToast(msg);
            }
    }


    const handleFeeInputChange=(e)=>{
        // const input= e.target.value.replace(/\D/g, '');
            if(fee>0&&fee<100){
                setFee(e.target.value); 
              }
              setMove(e.target.value);
              if(fee<move&&move<100){
                  setFee(e.target.value);
              }
        }
        

    const handleFeeOpen=()=>{
        setFeeOpen(true);
    }
    const handleFeeClose=()=>{
        setFeeOpen(false);
    }



    return(
    <div>
        <div>
        <Button variant="outlined" onClick={handleFeeOpen}>
          Change Treasury Fee
        </Button>
        <Dialog open={feeOpen} onClose={handleFeeClose}>
          <DialogTitle> Treasury Fee </DialogTitle>
          <DialogContent>
            <DialogContentText>
                Please entry number (1-100) which repersents the percentage of pool. And we 
                will update the Treasury Fee.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              type="number"
              fullWidth
              variant="standard"
              defaultValue={0} 
              value={fee}
              onChange={(e) =>handleFeeInputChange(e) }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFeeClose}>Cancel</Button>
            <Button onClick={changeTreasuryFee}>Comfire</Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* <div>
      <Button variant="outlined" onClick={handleFeeOpen}>
          Change Treasury Address
        </Button>
        <Dialog open={feeOpen} onClose={handleFeeClose}>
          <DialogTitle> Treasury Account </DialogTitle>
          <DialogContent>
            <DialogContentText>
                Please entry Treasury Adddress. And we will update the Treasury Address.
            </DialogContentText>
          
          <TextField
              autoFocus
              margin="dense"
              id="name"
              type="String"
              fullWidth
              variant="standard"
              defaultValue={0} 
              value={fee}
              onChange={(e) =>handleFeeInputChange(e) }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFeeClose}>Cancel</Button>
            <Button onClick={changeTreasuryFee}>Comfire</Button>
          </DialogActions>
        </Dialog>
      </div> */}



    </div>


    )
}
  
export default Fund;