// import './App.css';
import { useState, useEffect } from 'react';//change
import { ethers } from 'ethers';//change
import NumberSelector from "../User_Function/num_selection.js";
import Login from "../CommonFunction/login";
import WelcomeUser from '../User_Function/User_first';
import WinningNum from '../CommonFunction/WinningNum.js';
import Buy from '../User_Function/buy_Ticket.tsx';
//the following is owner function pages
import LotteryLifecycle from '../Owner_Function/LottoryLifecycle';
//try to connect USDToken
import USDToken from "../../constant_contract/USDToken.json";
import Lotto666 from "../../constant_contract/Lotto666.json";
import Address from '../../constant_contract/Address_Local';
import {BrowserRouter,Route,Link, Routes, Outlet} from "react-router-dom";
import moment from 'moment';

function UserApp() {
  //keep the account address. first, it was null, then parent component will send the value to the login page and other pages(router) when 
  // it need the account address.  
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  //both user and owner app
  
  // const [status,setStatus]=useState("");
  const [status,setStatus]=useState("");
  const stage=["Pending","Open","Close","Claimable"];


  const { ethereum } = window;
  // const provider = new ethers.providers.Web3Provider(window.ethereum);


  async function updateStatus(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      Address.LOTTO666_ADDRESS,
      // "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",// USDToken contract address
      Lotto666.abi,
      signer
    );
    const Status=await contract.status();
    setStatus(stage[Status]);
    console.log("status is: "+ status);
    
   }

  useEffect(() => {
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

   


  const connectWallet = async () => {
    console.log("user login step 1");
    try {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      // let balance = await provider.getBalance(accounts[0]);
      // let bal = ethers.utils.formatEther(balance);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        Address.USD_TOKEN_ADDRESS,
        // "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",// USDToken contract address
        USDToken.abi,
        signer
      );
      const balance = await contract.balanceOf(accounts[0]);
      const bal = ethers.utils.formatEther(balance);


      setAccountAddress(accounts[0]);
      setAccountBalance(bal);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };







  // 上面的code都是我尝试修改的，不行的话，全删了。

  return (
    <BrowserRouter>
     {/* <div> */}
        <div className='nav'>
          <Link to="/user/login">Login</Link> |
          <Link to="/user/buy">Buy Tickets</Link> |
          <Link to="/user/order">Order</Link> |
          <Link to="/winningNumber">Winning Number</Link> |

          {/* here is owner link. */}
          <Link to="/LotteryLifecycle">LotteryLifecycle</Link> |

          <Link to="/testpage">TestPage</Link> |
          {/* <Link to="/address">Address</Link> |
          <Link to="/wallet">Wallet</Link> */}

        </div>
 
        <Routes>
          <Route path="/" Component={WelcomeUser} excat/>
          <Route path="/user/login"  element={<Login AccAddress={accountAddress} AccBalance={accountBalance} haveWallet={haveMetamask} 
          connect={isConnected} doConnected={connectWallet}/>} />
          <Route path="/user/buy" Component={Buy} excat/>
          <Route path="/user/buy/numberselector" element={<NumberSelector AccAddress={accountAddress} AccBalance={accountBalance}/>} />
          <Route path="/winningNumber" Component={WinningNum}/>

          {/* here is owner routes. */}
          <Route path="/LotteryLifecycle" element={<LotteryLifecycle status={status} updateStatus={updateStatus}/>}/>

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
      //</div>

  )
}

export default UserApp;