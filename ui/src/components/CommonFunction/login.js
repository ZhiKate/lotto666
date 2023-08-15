import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// function Login() {
const Login=(props)=>{
// From here to the following I mention.

// const {Address,Balance}=props.user;
// const {id}=useParams();
const {doConnected}=props;
const {AccAddress,AccBalance,haveWallet,connect}=props;

const connectWallet=async() => {
  // console.log("before accountAddress is :" + connect);
  doConnected();
  // console.log("after accountAddress is :" + connect);
}
// the above codes are changed by me and uncertain, if it does not work, cancel all of them.

  // const [haveMetamask, sethaveMetamask] = useState(true);
  // const [accountAddress, setAccountAddress] = useState('');
  // const [accountBalance, setAccountBalance] = useState('');
  // const [isConnected, setIsConnected] = useState(false);

  // const { ethereum } = window;
  // const provider = new ethers.providers.Web3Provider(window.ethereum);

  // useEffect(() => {
  //   const { ethereum } = window;
  //   const checkMetamaskAvailability = async () => {
  //     if (!ethereum) {
  //       sethaveMetamask(false);
  //     }
  //     sethaveMetamask(true);
  //   };
  //   checkMetamaskAvailability();
  // }, []);

  // const connectWallet = async () => {
  //   try {
  //     if (!ethereum) {
  //       sethaveMetamask(false);
  //     }
  //     const accounts = await ethereum.request({
  //       method: 'eth_requestAccounts',
  //     });
  //     let balance = await provider.getBalance(accounts[0]);
  //     let bal = ethers.utils.formatEther(balance);
  //     setAccountAddress(accounts[0]);
  //     setAccountBalance(bal);
  //     setIsConnected(true);
  //   } catch (error) {
  //     setIsConnected(false);
  //   }
  // };

  return (
    <div className="App">
      <header className="App-header">
        {haveWallet ? (
          <div className="App-header">
            {connect ? (
              <div className="card">
                <div className="card-row">
                  <h3>Wallet Address:</h3>
                  <p>
                    {AccAddress.slice(0, 4)}...
                    {AccAddress.slice(38, 42)}
                  </p>
                </div>
                <div className="card-row">
                  <h3>Wallet Balance:</h3>
                  <p>{AccBalance}</p>
                </div>
              </div>
            ) 
            : (
            //   <img src={logo} className="App-logo" alt="logo" />
            <h1>Not Connected！！</h1>
            )}
            {connect ? (
              <p className="info">🎉 Connected Successfully</p>
            ) : (
              <button className="btn" onClick={connectWallet}>
                Connect
              </button>
            )}
          </div>
        ) : (
          <p>Please Install MataMask</p>
        )}
      </header>
    </div>
  );
}

export default Login;