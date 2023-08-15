// import './App.css';
import { useState, useEffect } from 'react';//change
import { ethers } from 'ethers';//change
import Buy from "./components/buy_ticket2";
import Login from "./components/login";
import Check from "./components/check_ticket";
import App from './App';
import {BrowserRouter,Route,Link, Routes, Outlet} from "react-router-dom";

function TRY() {

  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(window.ethereum);

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
      if (!ethereum) {
        sethaveMetamask(false);
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      let balance = await provider.getBalance(accounts[0]);
      let bal = ethers.utils.formatEther(balance);
      setAccountAddress(accounts[0]);
      setAccountBalance(bal);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };


  return(
    <BrowserRouter>
        <div>
            <button type="primary" round>
                <Link to="/UserApp">USER</Link>
            </button>
            <button type="primary" round>
                <Link to="/OwnerApp">OWNER</Link>
            </button>

        </div>

        <Routes>
            <Route path="/"  Component={Outlet} exact />
            <Route path="/UserApp"  Component={App} />
            <Route path="/OwnerApp"  Component={Check} />
            <Route path="/login"  element={<Login AccAddress={accountAddress} AccBalance={accountBalance} haveWallet={haveMetamask} 
          connect={isConnected} doConnected={connectWallet}/>} />
          <Route path="/buy" Component={Buy}/>
        </Routes>
    </BrowserRouter>
  )
}

export default TRY;
