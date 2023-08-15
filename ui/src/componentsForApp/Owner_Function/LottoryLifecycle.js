import {useState,useEffect,useRef} from 'react';
// import { TiCheckbox, TiCheckboxGroup, TiCheckboxButton } from '@titian-design/mobile-react';
import { ethers } from 'ethers';//change
import Lotto666 from "../../constant_contract/Lotto666.json";
import USDToken from "../../constant_contract/Lotto666.json";
import Address from '../../constant_contract/Address_Local';
import Button from "@mui/material/Button";
// import {IntlProvider,FormattedDate,} from "react-intl";
import moment from 'moment';
// global.FormData = require('react-native/Libraries/Network/FormData');
const { ethereum } = window;


// We need to support for input a random value.
const randomBytes = ethers.utils.randomBytes(32);

const LotteryLifecycle=(props)=>{

  //Function to update state(Set state) updateStatus is used to access Lottery status and update it in react.
   const {handleLogin,updateTime,updateStatus}= props;
   //states from parent component.
   const {AccAddress,AccBalance,startTime,endTime,status}=props;
    // const stage=["Pending","Open","Close","Claimable"];
    // const [status,setStatus]=useState("");

    // const provider = new ethers.providers.Web3Provider(ethereum);
    // const signer = provider.getSigner();
    // const contract = new ethers.Contract(
    //   Address.LOTTO666_ADDRESS,
    //   Lotto666.abi,
    //   signer
    // );

    useEffect(()=>{
        // const provider = new ethers.providers.Web3Provider(ethereum);
        // const signer = provider.getSigner();
        // const contract = new ethers.Contract(
        //     Address.LOTTO666_ADDRESS,
        //     // "0x610178dA211FEF7D417bC0e6FeD39F05609AD788", //Lotto666 contract address
        //     Lotto666.abi,
        //     signer
        //         );

        // async function fetchData() {
        //     const status=await contract.status();
        //     // const index=Number(status);
        //     console.log("current lottery status is : "+ stage[status]);
        //     setStatus(stage[status]);
        //     console.log("is status has been set?: "+ stage[status]);               
        // }

        // fetchData();
        handleLogin();
        // updateStatus();

    },[]);

    async function approveUSD() {
      // if (ethereum === undefined) {
      //   return;
      // }
      try {
        // setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          Address.USD_TOKEN_ADDRESS,
          USDToken.abi,
          signer
        );
        const transaction = await contract.approve(
          Address.LOTTO666_ADDRESS,
          ethers.constants.MaxUint256
        );
        await transaction.wait();
        // setToast("Approved Success");
        // setLoading(false);
      } catch (error) {
        // setLoading(false);
        console.log("Error: ", error);
        const msg = error.message;
        // setErrorToast(msg);
      }
    }

    async function resetForNewLottery() {
        // if (ethereum === undefined) {
        //   return;
        // }
        try {
        //   setLoading(true);
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            Address.LOTTO666_ADDRESS,
            Lotto666.abi,
            signer
          );
    
          const currentBlock = await provider.getBlockNumber();
          const blockTimestamp = (await provider.getBlock(currentBlock)).timestamp;
          console.log(blockTimestamp);
    
          // because start time is 1 hour later than execute this function, therefore we only can
          // start lottery after 1 hour.
          const transaction = await contract.resetForNewLottery(
            blockTimestamp + 3600,
            0
          );
          await transaction.wait();

          // // update the status in page.
          // console.log("reset lottery success: ");
          // const updateStatus=await contract.status();
          // setStatus(stage[updateStatus]);
          // console.log("set status to be pending: "+updateStatus);
          updateStatus();
          updateTime();
          // console.log("reset lottery success and set status to be pending: "+updateStatus);
    
        //   setToast("Reset Lottery Success");
        //   setLoading(false);
        } catch (error) {
        //   setLoading(false);
          console.log("Error: ", error);
          const msg = error.message;
        //   setErrorToast(msg);
        }
      }

      // Only can change the percentage of each prizes on the pending. 
      async function changeRewardBreakdown() {
        // if (ethereum === undefined) {
        //   return;
        // }
        try {
          // setLoading(true);
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            Address.LOTTO666_ADDRESS,
            Lotto666.abi,
            signer
          );
    
          // [0, 15, 15, 15, 15, 40];
          //   const defaultList = [
          //     ethers.BigNumber.from(0),
          //     ethers.BigNumber.from(15),
          //     ethers.BigNumber.from(15),
          //     ethers.BigNumber.from(15),
          //     ethers.BigNumber.from(15),
          //     ethers.BigNumber.from(40),
          //   ];
    
          const testList = [
            ethers.BigNumber.from(20),
            ethers.BigNumber.from(10),
            ethers.BigNumber.from(10),
            ethers.BigNumber.from(10),
            ethers.BigNumber.from(10),
            ethers.BigNumber.from(40),
          ];
    
          const transaction = await contract.setRewardsBreakdown(testList);
          await transaction.wait();
    
          // setToast("Set Success");
          // setLoading(false);
        } catch (error) {
          // setLoading(false);
          console.log("Error: ", error);
          const msg = error.message;
          // setErrorToast(msg);
        }
      }


    async function startLottery() {
        // if (ethereum === undefined) {
        //   return;
        // }
        try {
        //   setLoading(true);
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            Address.LOTTO666_ADDRESS,
            Lotto666.abi,
            signer
          );
    
          // not check if correct or not. 
          const transaction = await contract.startLottery();
          await transaction.wait();
          // const updateStatus=await contract.status();
          // setStatus(stage[updateStatus]);
          updateStatus();
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

      async function closeLottery() {

        try {
        //   setLoading(true);
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            Address.LOTTO666_ADDRESS,
            Lotto666.abi,
            signer
          );
    
          const transaction = await contract.closeLottery();
          await transaction.wait();
          console.log("close lottery success: ");
          // const updateStatus=await contract.status();
          // setStatus(stage[updateStatus]);
          updateStatus();
          console.log("set status to be close: "+updateStatus);
    
        //   setToast("Success");
        //   setLoading(false);
        } catch (error) {
        //   setLoading(false);
          console.log("Error: ", error);
          const msg = error.message;
        //   setErrorToast(msg);
        }
      }

      //Draw is first requestRandomness()and then revelRandomness(),finally it returns the winning numbers.
      async function requestRandomness() {
        // if (ethereum === undefined) {
        //   return;
        // }
        try {
        //   setLoading(true);
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            Address.LOTTO666_ADDRESS,
            Lotto666.abi,
            signer
          );
    
          const randomHash = ethers.BigNumber.from(
            ethers.utils.keccak256(randomBytes)
          );
          const transaction = await contract.requestRandomness(randomHash);
          await transaction.wait();
        //   setToast("requestRandomness Success! ");
          console.log("gas used: ", transaction.gasLimit.toString());
        //   setLoading(false);
        } catch (error) {
        //   setLoading(false);
          console.log("Error: ", error);
          const msg = error.message;
        //   setErrorToast(msg);
        }
      }

 

      async function revealRandomness() {
        await requestRandomness();
        // if (ethereum === undefined) {
        //   return;
        // }
        try {
        //   setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            Address.LOTTO666_ADDRESS,
            Lotto666.abi,
            signer
        );
    
          // console.log("randomBytes: ", randomBytes);
          const randomSeed = ethers.BigNumber.from(randomBytes);
          const transaction = await contract.revealRandomness(randomSeed);
          await transaction.wait();
        //   setToast("Draw lottery Success! ");
          console.log("gas used: ", transaction.gasLimit.toString());

        // update the status in page.
          console.log(" draw success: ");
          // const updateStatus=await contract.status();
          // setStatus(stage[updateStatus]);
          updateStatus();
          console.log("set status to be claimable: "+status);
        //   setLoading(false);
        } catch (error) {
        //   setLoading(false);
          console.log("Error: ", error);
          const msg = error.message;
        //   setErrorToast(msg);
        }
      }

      // async function startTime(){
      //   const provider = new ethers.providers.Web3Provider(ethereum);
      //   const signer = provider.getSigner();
      //   const contract = new ethers.Contract(
      //       Address.LOTTO666_ADDRESS,
      //       Lotto666.abi,
      //       signer
      //   );
      //   const time=await contract.startTime();
      //   // const date = new Date(time * 1000)
      //   //  formatDate(date, 'yyyy/MM/dd hh:mm:ss')
      //   // const index=Number(status);
 
      //   console.log("start time in value: "+time);
      //   console.log("start time is : "+ moment(parseInt(time*1000)).format("YYYY-MM-DD HH:mm:ss"));
      //   console.log("current time is: "+ new Date());
      //   // setStatus(stage[status]);
      //   // console.log("is status has been set?: "+ stage[status]); 
      // }


      //----------------------------------------------use for test ------------------------------------------
      async function viewTime(){
        // const provider = new ethers.providers.Web3Provider(ethereum);
        // const signer = provider.getSigner();
        // const contract = new ethers.Contract(
        //     Address.LOTTO666_ADDRESS,
        //     Lotto666.abi,
        //     signer
        // );
        // //get the start time.
        // const start_time=await contract.startTime();
        // const end_time=await contract.endTime();
        // const end_Reward_time=await contract.endRewardTime();

        // const date = new Date(time * 1000)
        //  formatDate(date, 'yyyy/MM/dd hh:mm:ss')
        // const index=Number(status);



        // // console.log("start time in value: "+start_time);
        // console.log("start time is : "+ moment(parseInt(start_time*1000)).format("YYYY-MM-DD HH:mm:ss"));
        // console.log("end time is : "+ moment(parseInt(end_time*1000)).format("YYYY-MM-DD HH:mm:ss"));
        // console.log("end reward time is : "+ moment(parseInt(end_Reward_time*1000)).format("YYYY-MM-DD HH:mm:ss"));
        console.log("start time: "+startTime);
        console.log("end time: "+ endTime);

        // console.log("current time is: "+ new Date());
        // setStatus(stage[status]);
        // console.log("is status has been set?: "+ stage[status]); 
      }

      async function changeStartTime() {
        // if (ethereum === undefined) {
        //   return;
        // }
        try {
          // setLoading(true);
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            Address.LOTTO666_ADDRESS,
            Lotto666.abi,
            signer
          );
    
          const currentBlock = await provider.getBlockNumber();
          const blockTimestamp = (await provider.getBlock(currentBlock)).timestamp;
    
          const transaction = await contract.setStartTime(blockTimestamp);
          await transaction.wait();

          updateTime();
    
          // setToast("Set Success");
          // setLoading(false);
        } catch (error) {
          // setLoading(false);
          console.log("Error: ", error);
          const msg = error.message;
          // setErrorToast(msg);
        }
      }
      async function changeEndTime() {
        // if (ethereum === undefined) {
        //   return;
        // }
        try {
          // setLoading(true);
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            Address.LOTTO666_ADDRESS,
            Lotto666.abi,
            signer
          );
    
          const currentBlock = await provider.getBlockNumber();
          const blockTimestamp = (await provider.getBlock(currentBlock)).timestamp;
    
          const transaction = await contract.setEndTime(blockTimestamp);
          await transaction.wait();

          updateTime();
          // setToast("Set Success");
          // setLoading(false);
        } catch (error) {
          // setLoading(false);
          console.log("Error: ", error);
          const msg = error.message;
          // setErrorToast(msg);
        }
      }
      async function changeRewardTime() {
        // if (ethereum === undefined) {
        //   return;
        // }
        try {
          // setLoading(true);
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            Address.LOTTO666_ADDRESS,
            Lotto666.abi,
            signer
          );
    
          const currentBlock = await provider.getBlockNumber();
          const blockTimestamp = (await provider.getBlock(currentBlock)).timestamp;
    
          const transaction = await contract.setEndRewardTime(blockTimestamp);
          await transaction.wait();
          updateStatus();
          updateTime();
          // setToast("Set Success");
          // setLoading(false);
        } catch (error) {
          // setLoading(false);
          console.log("Error: ", error);
          const msg = error.message;
          // setErrorToast(msg);
        }
      }

      async function viewTiketbyAddress() {
        // if (ethereum === undefined) {
        //   return;
        // }
        try {
          // setLoading(true);
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            Address.LOTTO666_ADDRESS,
            Lotto666.abi,
            signer
          );

    
          const transaction = await contract.viewTicketsOfAddress(AccAddress);
          // await transaction.wait();

          console.log("view all your tickets: "+transaction);
          // setToast("Set Success");
          // setLoading(false);
        } catch (error) {
          // setLoading(false);
          console.log("Error: ", error);
          const msg = error.message;
          // setErrorToast(msg);
        }
      }


    

      
      


    const FormType=()=>{


        return(
            <div>
                <h1>Current status is : {status}</h1>
                <Button variant="contained" onClick={startLottery}>
                Start Lottery
                </Button>

                <Button variant="contained" onClick={closeLottery}>
                Close Lottery
                </Button>

                <Button variant="contained" onClick={resetForNewLottery}>
                reset For NewLottery
                </Button>

                <Button variant="contained" onClick={revealRandomness}>
                Draw the Winning Number
                </Button>

                <Button variant="contained" onClick={viewTime}>
                Time
                </Button>

                <Button variant="contained" color="error" onClick={changeStartTime}>
                  change StartTime to past
                </Button>
                <Button variant="contained" color="error" onClick={changeEndTime}>
                  change EndTime to past
                </Button>
                <Button variant="contained" color="error" onClick={changeRewardTime}>
                  change RewardTime to past
                </Button>
                <Button variant="contained" color="error" onClick={viewTiketbyAddress}>
                  View Ticket By Address
                </Button>
                

                
            </div>
        )

    }
    
      return(
        <>
            {FormType()}
        </>
      )
    }

    

    export default LotteryLifecycle;