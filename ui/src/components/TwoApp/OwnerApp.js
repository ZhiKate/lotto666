// import './App.css';
import { useState, useEffect } from 'react';//change
import { ethers } from 'ethers';//change
import Buy from "../User_Function/num_selection.js";
import Login from "../CommonFunction/login";
import WelcomeOwner from '../Owner_Function/Owner_first';
// import UserApp from './UserApp';
import USDToken from "../../constant_contract/USDToken.json";
import Address from '../../constant_contract/Address_Local';
import {BrowserRouter,Route,Link, Routes, Outlet} from "react-router-dom";

function OwnerApp() {
  //keep the account address. first, it was null, then parent component will send the value to the login page and other pages(router) when 
  // it need the account address.  
  //需要改一些，因为下面是登入user 的方法，并不是登入owner的方法。

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  //both user and owner app
  const [status,setStatus]=useState("");

  // set fixed owner address
  const ownerAddress='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

  useEffect(() => {
    const { ethereum } = window;
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      sethaveMetamask(true);
    };
    checkMetamaskAvailability();
  }, []);

  const connectWallet = async () => {
    try {
      // console.log("owner login step 1");
      if (!ethereum) {
        sethaveMetamask(false);
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      // console.log("step2 and address: "+ (accounts[0]==ownerAddress));

      for(let i=0;i<accounts.length;i++){
        if(accounts[i]===ownerAddress.toLowerCase()){
          // console.log("step3 check if the for work or not: ");
          // let balance = await provider.getBalance(accounts[i]);
          // let bal = ethers.utils.formatEther(balance);

          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            Address.USD_TOKEN_ADDRESS,
            // "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
            USDToken.abi,
            signer
          );
          const balance = await contract.balanceOf(accounts[i]);
          const bal = ethers.utils.formatEther(balance);

          setIsConnected(true);
          setAccountAddress(accounts[i]);
          setAccountBalance(bal);
          return;
        }
      }
    } catch (error) {
      // console.log("step4 check if there has error or not: "+error);
      setIsConnected(false);
    }
  };


  // 上面的code都是我尝试修改的，不行的话，全删了。

  return (
    <BrowserRouter>
     {/* <div> */}
        <div className='nav'>
          <Link to="/owner/login">Login</Link> |
          <Link to="/owner/buy">Buy Tickets</Link> |
          {/* <Link to="/order">Order</Link> | */}
          {/* <Link to="/address">Address</Link> |
          <Link to="/wallet">Wallet</Link> */}

        </div>
 
        <Routes>
          
          <Route path="/" Component={WelcomeOwner} exact/>
          <Route path="/owner/login"  element={<Login AccAddress={accountAddress} AccBalance={accountBalance} haveWallet={haveMetamask} 
          connect={isConnected} doConnected={connectWallet}/>} />
          <Route path="/owner/buy" Component={Buy}/>
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

export default OwnerApp;