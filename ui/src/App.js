// import './App.css';
import { useState, useEffect } from 'react';//change
import { ethers } from 'ethers';//change
import moment from 'moment';
import Button from "@mui/material/Button";
import Buy from './componentsForApp/User_Function/buy_Ticket.tsx';
import NumberSelector from "./componentsForApp/User_Function/num_selection.js";
import WinningNum from './componentsForApp/CommonFunction/WinningNum.js';
// import Login from "./components/login";
import Account from './componentsForApp/CommonFunction/account';
import LotteryLifecycle from './componentsForApp/Owner_Function/LottoryLifecycle.js';
import Fund from './componentsForApp/Owner_Function/Fund.tsx'
import Address from './constant_contract/Address_Local.js';
import USDToken from './constant_contract/USDToken.json';
import LOTTO666 from './constant_contract/Lotto666.json';


import {BrowserRouter,Route,Link, Routes, Outlet} from "react-router-dom";
import UserApp from './componentsForApp/TwoApp/UserApp.js';
import OwnerApp from './componentsForApp/TwoApp/OwnerApp.js';

function App() {
  //keep the account address. first, it was null, then parent component will send the value to the login page and other pages(router) when 
  // it need the account address.  
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [identity,setIdentity]=useState("");
  const [login,setLogin]=useState(false); //login button default cannot be chosen.
  const [status,setStatus]=useState("");// record the lottery status.
  const [jackpot,setJackpot]=useState(0);//record the jackpot, which means the bonous which do not be claimed by user. It will add to the First Prize.
  const [pool,setPool]=useState(0);//record the total amount of the pool
  const [startTime,setStartTime]=useState("");// start selling tickets
  const [endTime,setEndTime]=useState(""); // end selling tickets
  const [endRewardTime,setEndRewardTime]=useState(""); // uses must claim their prizes before this time.
  const [treasuryAddress,setTreasuryAddress]=useState(''); // use to record the treasury address
  const [treasuryFee,setTreasuryFee]=useState(0); // the percentage of pool(without jackpot) sent to treasury. 
  const [rewardsBreakdown,setRewardsBreakdown]=useState([]);// the percentage of pool(without jackpot) for each prize.

  
  
  // "pending"-- a new lottery is setted up; "open"--owner has started the lottery and user can buy; 
  //"close"--owner closed the lottery and then owner can make the winning number; "claimable"--after owner make the winning number, lottery will be claimable
  //and users can claim their tickets.
  const stage=["Pending","Open","Close","Claimable"];

  const ownerAddress=Address.LOTTO666_OWNER_ADDRESS;
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(window.ethereum);


  //---------------------------------- functions which are invoked by children component ------------------------//

  // 1. handle the changes of the lottery status.
  const updateStatus=async()=>{
      if (ethereum === undefined) {
        return;
      }
      try {
        // setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          Address.LOTTO666_ADDRESS,
          LOTTO666.abi,
          signer
        );
        const status=await contract.status();
        setStatus(stage[status]);
        // console.log("Lottery status is "+ stage[status]);
        // await transaction.wait();
        // setToast("Approved Success");
        // setLoading(false);
      } catch (error) {
        // setLoading(false);
        console.log("Error: ", error);
        const msg = error.message;
        // setErrorToast(msg);
      }
    }

   // 2. The function is used to update time(start,end,endreward).
  const updateTime=async()=>{
    // if (ethereum === undefined) {
    //   return;
    // }
    try {
      // setLoading(true);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        Address.LOTTO666_ADDRESS,
        LOTTO666.abi,
        signer
      );


      const start_time=await contract.startTime();
      const end_time=await contract.endTime();
      const end_Reward_time=await contract.endRewardTime();

      const start=moment(parseInt(start_time*1000)).format("YYYY-MM-DD HH:mm:ss");
      const end=moment(parseInt(end_time*1000)).format("YYYY-MM-DD HH:mm:ss");
      const endreward=moment(parseInt(end_Reward_time*1000)).format("YYYY-MM-DD HH:mm:ss");

      setStartTime(start);
      setEndTime(end);
      setEndRewardTime(endreward);


      console.log("start time is : "+ moment(parseInt(start_time*1000)).format("YYYY-MM-DD HH:mm:ss"));
      console.log("end time is : "+ moment(parseInt(end_time*1000)).format("YYYY-MM-DD HH:mm:ss"));
      console.log("end reward time is : "+ moment(parseInt(end_Reward_time*1000)).format("YYYY-MM-DD HH:mm:ss"));

      // await transaction.wait();
      // setToast("Approved Success");
      // setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.log("Error: ", error);
      const msg = error.message;
      // setErrorToast(msg);
    }
  }

  //3. update the jackpot

  const updatejackPot=async()=>{
    if (ethereum === undefined) {
      return;
    }
    try {
      // setLoading(true);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        Address.LOTTO666_ADDRESS,
        LOTTO666.abi,
        signer
      );
      const amount=await contract.jackpotAmount();
      const a=ethers.utils.formatEther(amount);

      setJackpot(Number(a));
      // console.log("jackPot amount is "+ amount);
      // await transaction.wait();
      // setToast("Approved Success");
      // setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.log("Error: ", error);
      const msg = error.message;
      // setErrorToast(msg);
    }
  }


    //4. update the total bonus pool

    const updatePool=async()=>{
      if (ethereum === undefined) {
        return;
      }
      try {
        // setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          Address.USD_TOKEN_ADDRESS,
          USDToken.abi,
          signer
        );
        const pool = await contract.balanceOf(Address.LOTTO666_ADDRESS);
        const p = ethers.utils.formatEther(pool);

        setPool(Number(p));
        // console.log("total bonus pool "+ p);
        // await transaction.wait();
        // setToast("Approved Success");
        // setLoading(false);
      } catch (error) {
        // setLoading(false);
        console.log("Error: ", error);
        const msg = error.message;
        // setErrorToast(msg);
      }
    }

    // 5. update treasuryAddress
    const updateTreasury=async()=>{
      if (ethereum === undefined) {
        return;
      }
      try {
        // setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          Address.LOTTO666_ADDRESS,
          LOTTO666.abi,
          signer
        );
        const treasury = await contract.treasuryAddress();
        
        setTreasuryAddress(treasury);
        // console.log("treasury address is "+ treasury);
        // await transaction.wait();
        // setToast("Approved Success");
        // setLoading(false);
      } catch (error) {
        // setLoading(false);
        console.log("Error: ", error);
        const msg = error.message;
        // setErrorToast(msg);
      }
    }

    //6. update treasure fee.
    const updateTreasuryFee=async()=>{
      if (ethereum === undefined) {
        return;
      }
      try {
        // setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          Address.LOTTO666_ADDRESS,
          LOTTO666.abi,
          signer
        );
        const fee = await contract.treasuryFee();
        
        setTreasuryFee(Number(fee));
        // console.log("treasury fee is "+ fee);
        // await transaction.wait();
        // setToast("Approved Success");
        // setLoading(false);
      } catch (error) {
        // setLoading(false);
        console.log("Error: ", error);
        const msg = error.message;
        // setErrorToast(msg);
      }
    }

    //7. update the rewards breakdown.
    const updateRewardsBreakdown=async()=>{
      if (ethereum === undefined) {
        return;
      }
      try {
        // setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          Address.LOTTO666_ADDRESS,
          LOTTO666.abi,
          signer
        );
        const List=[];
        const list=await contract.viewRewardsBreakdown();
        for(let i=0;i<list.length;i++){
          const p=Number(list[i]);
          List.push(p);
      }
        
        setRewardsBreakdown(List);
        // console.log("Reward Breakdown is "+ list);
        // await transaction.wait();
        // setToast("Approved Success");
        // setLoading(false);
      } catch (error) {
        // setLoading(false);
        console.log("Error: ", error);
        const msg = error.message;
        // setErrorToast(msg);
      }
    }


  useEffect(() => {
    handleLogInPage();
    updateTime();
    updatePool();
    updatejackPot();
    updateTreasury();
    updateTreasuryFee();
    updateRewardsBreakdown();
    const { ethereum } = window;
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      sethaveMetamask(true);
    };
    checkMetamaskAvailability();

    updateStatus();

  }, []);



  const connectUserWallet = async () => {;
    try {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      setIdentity("User");
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      // let balance = await provider.getBalance(accounts[0]);
      // let bal = ethers.utils.formatEther(balance);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        Address.USD_TOKEN_ADDRESS,
        USDToken.abi,
        signer
      );
      const balance = await contract.balanceOf(accounts[0]);
      const bal = ethers.utils.formatEther(balance);

      setAccountAddress(accounts[0]);
      setAccountBalance(bal);
      setIsConnected(true);
      console.log("after click user button" + isConnected+ accountAddress+ accountBalance);
    } catch (error) {
      setIsConnected(false);
    }
  };



  const connectOwnerWallet = async () => {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      setIdentity("Owner");
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

        if(accounts[0]===ownerAddress.toLowerCase()){
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            Address.USD_TOKEN_ADDRESS,
            USDToken.abi,
            signer
          );
          const balance = await contract.balanceOf(accounts[0]);
          const bal = ethers.utils.formatEther(balance);
          setIsConnected(true);
          setAccountAddress(accounts[0]);
          setAccountBalance(bal);
          console.log("after click owner button" + isConnected+ accountAddress+ accountBalance);
          return;
      }
    } catch (error) {
      setIsConnected(false);
    }
  };

  const DoLogIn=()=>{
    setLogin(true);
  }

  const handleLogInPage=()=>{
    setLogin(false);
  }


  const userInterface=()=>{
    return(
      <div className='nav'>
      <Button variant="contained" color="error" onClick={connectUserWallet}>
       CHOOSE USER
      </Button>

      <Button variant="contained" color="error" onClick={connectOwnerWallet}>
       CHOOSE OWNER
      </Button>

      <Button variant="contained" color="error"  onClick={DoLogIn} >
        LOGIN
      </Button>
      </div>

    )
}


const ownerInterface=()=>{
  return(
    <div className='nav'>
    <Button variant="contained" color="error" onClick={connectUserWallet}>
     CHOOSE USER
    </Button>

    <Button variant="contained" color="error" onClick={connectOwnerWallet}>
     CHOOSE OWNER
    </Button>

    <Button variant="contained" color="error"  onClick={DoLogIn} >
      LOGIN
    </Button>
    </div>

  )
}

 const NoIdentity=()=>{
  return(
    <div className='nav'>
    <Button variant="contained" color="error" onClick={connectUserWallet}>
     CHOOSE USER
    </Button>

    <Button variant="contained" color="error" onClick={connectOwnerWallet}>
     CHOOSE OWNER
    </Button>

    <Button variant="contained" color="error"   onClick={DoLogIn} disabled={true}>
      LOGIN
    </Button>
    </div>

  )
}

const show=()=>{
  if ((identity==="User")&& (isConnected===true)){
    return (
      <div>
         {userInterface()}
      </div>
    )
  }
  else if((identity==="Owner") && (isConnected===true)){
    return (
      <div>
        {ownerInterface()}
      </div>
    )
  }
  return(
    <div>
      {NoIdentity()}
    </div>
  )

}


const AppPage=()=>{
  if (identity==="User"){
    return(
    <div>
      <div className='nav'>
        <Link to="/user/account">User Account</Link> |
        <Link to="/user/buy">Buy Tickets</Link> |
        <Link to="/winningNumber">Winning Number</Link> |
        <Link to="/owner/lotterylifecycle">LotteryLifecycle</Link> |
        <Link to="/owner/Fund">Fund</Link> |
      </div>

      <div>
          <p>{identity} Address: {accountAddress}</p>
          <p>USD Balance: {accountBalance} </p>
      </div>

    </div>
    )
  }
  if (identity==="Owner"){
    return(
      <div>
        <div className='nav'>
        <Link to="/owner/lotterylifecycle">LotteryLifecycle</Link> |
        <Link to="/owner/Fund">Fund</Link> |


      </div>

      <div>
        <p>{identity} Address: {accountAddress}</p>
        <p>USD Balance: {accountBalance} </p>
      </div>

      </div>
      
      
    )
  }
}




 

  return (
    <BrowserRouter>
        {login?(
          
          <div>
            {AppPage()}
          </div>
        ):(
          <div>
            {show()}
          </div>
        )}


        

        <Routes>
          <Route path="/" Component={Outlet} exact />
          {/* <Route path="/user" element={<UserApp Status={status} AccAddress={accountAddress} AccBalance={accountBalance} identity={identity} />} exact /> */}
          <Route path="/winningNumber" element={<WinningNum status={status} loginPage={handleLogInPage} />} exact />

          {/* <Route path="/login"  element={<Login AccAddress={accountAddress} AccBalance={accountBalance} haveWallet={haveMetamask} 
          connect={isConnected} doConnected={connectWallet}/>} /> */}
          <Route path="/user/account" Component={Account}/>
          <Route path="/user/buy" element={<Buy jackpot={jackpot} pool={pool} updatePool={updatePool} status={status} startTime={startTime} endTime={endTime} />}/>
          <Route path="/user/buy/numberselector" Component={NumberSelector}/>


          <Route path="/owner/account" Component={Account}/>

          <Route path="/owner/fund" element={<Fund status={status} pool={pool} jackpot={jackpot} treasuryFee={treasuryFee} treasuryAddress={treasuryAddress} rewardsBreakdown={rewardsBreakdown}
           updateRewardsBreakdown={updateRewardsBreakdown} updateTreasuryFee={updateTreasuryFee} updateTreasury={updateTreasury} />} />

          <Route path="/owner/lotterylifecycle" element={<LotteryLifecycle AccAddress={accountAddress} AccBalance={accountBalance} status={status} startTime={startTime} endTime={endTime} 
          handleLogin={DoLogIn} updateStatus={updateStatus} updateTime={updateTime} />}/>

       </Routes>
         {/* <Routes>
          <Route path="/"  Component={Outlet} exact/>
          <Route path="/address" element={<Address Addresses={addr} />}  exact/>
          <Route path="/transaction" element={<Transactions list={List}/>} />
          <Route path="/wallet" element={<Wallet user={User} />} />
          <Route path="/address/:id"  element={<Transfer Todo={Todo} user={User} updateList={handleList} />}
          />
         </Routes> */}
      </BrowserRouter>


  )
}

export default App;