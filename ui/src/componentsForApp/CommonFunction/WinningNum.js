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

const WinningNum=(props)=>{

    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const {status}=props;
    const noPrizes=[0,0,0,0,0,0];

    // Think about how to reload the new value when any of element in win page changed.
    const [winNum,setWinNum]=useState([]); //used to record the numbers after draw
    const [prizes,setPrizes]=useState([]); // use to record ecah prize
    const [open,setOpen]=useState(false); //use to show if draw or not
    

    useEffect(() => {
        async function fetchData() {
            const prizeList=[];
            const numList=[];  
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
            Address.LOTTO666_ADDRESS,
            Lotto666.abi,
            signer
            );

            const prize=await contract.viewRewardsForBracket();
            const numbers=await contract.viewResult();
          
            for(let i=0;i<prize.length;i++){
                const p=ethers.utils.formatEther(prize[i]);
                prizeList.push(p);
                // console.log("prize: " +p);
                // prizeList.push(Number(prize[i]));
            }
                 
            for(let i=0;i<numbers.length;i++){
                numList.push(Number(numbers[i]));
            }

            setPrizes(prizeList);
            setWinNum(numList);
            setOpen(true);
        }
        
        if(status==="Claimable"){
            fetchData();
            return
        }
        
        setPrizes(noPrizes);
        setWinNum([]);
        setOpen(false);

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
                    <h2>Winning Number has not been drawn yet</h2>
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