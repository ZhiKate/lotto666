import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CasinoIcon from '@mui/icons-material/Casino';
import {yellow} from "@mui/material/colors"
import '../css/winningNum.css';
import { useState, useEffect } from 'react';//change
import { ethers } from 'ethers';//change
import Lotto666 from "../../constant_contract/Lotto666.json";
import Address from '../../constant_contract/Address_Local';
const { ethereum } = window;
// import DeleteIcon from '@mui/icons-material/Delete';

// const winNum=[1,2,3,4,5,6];
// const prizes=[0,0,0,0,0,0];
const WinningNum=(props)=>{

    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Think about how to reload the new value when any of element in win page changed.
    const [winNum,setWinNum]=useState([]); //used to record the numbers after draw
    const [prizes,setPrizes]=useState([]); // use to record ecah prize
    const [open,setOpen]=useState(false); //use to show if draw or not
    

    useEffect(() => {

        const signer = provider.getSigner();
        const contract = new ethers.Contract(
        Address.LOTTO666_ADDRESS,
        // "0x610178dA211FEF7D417bC0e6FeD39F05609AD788", //Lotto666 contract address
        Lotto666.abi,
        signer
         );

        async function fetchData() {
            const prize=await contract.viewRewardsForBracket();
            const number=await contract.finalNumber();
            const num=Number(number);
            const prizeList=[];
            const numList=[];

            for(let i=0;i<prize.length;i++){
                prizeList.push(Number(prize[i]));
            }

            // console.log("After Array(),typeof prize"+Prize+typeof(Prize));
            // console.log("show prizes:"+prize+"typeof it: "+typeof(prize));
            // console.log("show number:"+number+"typeof it: "+typeof(number));
   
            setPrizes(prizeList);
            if(num!==0){
               const numbers=await contract.viewResult(); 
               
               for(let i=0;i<numbers.length;i++){
                numList.push(Number(numbers[i]));
               }

               setWinNum(numList);
               setOpen(true);
               return;
            }
            setWinNum([]);
          }
          fetchData();
        },[]);


    
    
        const showWinNum=()=>{
            return winNum.map((item)=>{
                return (
                    <span key={"win-"+item} className="number">
                        {item}
                    </span>
                )
            })
        }

        const showPrizes=()=>{
            let i=0;
            return prizes.map((item)=>{
                i++;
                return (
                    <tr key={"fit-"+i}>
                        <th>{i}/6</th>
                        <th><MonetizationOnIcon sx={{color:yellow[700]}}></MonetizationOnIcon>{item}</th>
                    </tr>
                )
            })

        }

    return(
        <div>
            {open?(
                <div className="WinNum">
                <h3 className='title1'>WINNING NUMBERS</h3>
                {showWinNum()}
                <span><CasinoIcon color="success" sx={{ fontSize: 120 }}></CasinoIcon></span>
                </div>

            ):(
                <div className="WinNum">
                    <h2>The Lotto666 has not been drawn yet</h2>
                </div>
            )}

            <table className='prizes'>
                <tbody>
                    <tr className='title2'>
                        <th>Matches</th>
                        <th>Prize</th>
                    </tr>
                    {showPrizes()}
                </tbody>
            </table>
        </div>

    )
}

export default WinningNum;