# Lottery

<!-- 1. npm install
2. yarn add @titian-design/mobile-react
3. npm install ethers
3. yarn add  -->


# contract(excute in path/folder the lotto666 ):

1. install all dependencies in the package.json file.
   yarn install
   npm install --save-dev @nomiclabs/hardhat-ethers 'ethers@^5.0.0' (do not need to do, package.json has contain it)

2. Before compile the smart contract, you need to edit the .env file first. Because the file 'hardhat.config.cjs' has set the 
   testnet network(if you do use the testnet blockchain, delete the network and .env is not needed. And you can compile the smart contract directly). And there are some attributes in this file need to declear in the .env file. And the attributes in the .env file can 
   be protected. Others cannot access this file.
   how to set the env. file (set the following three attributes--- QUICKNODE_URL, PRIVATE_KEY, VITE_CONTRACT_ADDRESS):

    i. QUICKNODE_URL="https://prettiest-misty-owl.avalanche-testnet.discover.quiknode.pro/............."  --> this one is needed, because
       we need a node to interact with the testnet blockchain. 

    ii. PRIVATE_KEY=f9................   --> the private key is you one of the accounts in your wallet, this account is used to deploy    the smart contract into the testnet(blockchain) and this account will cost gas to do this deploy contract transaction.

    iii. VITE_CONTRACT_ADDRESS=0xc........  --> the VITE_CONTRACT_ADDRESS is the address of the contract, it cannot set at first, it 
        was set in the .env file after we deploy the smart contract into the testnet blockchain.

3. After set the .env file, we can compile the smart contract and after compile, smart contract ABI and bytecode will be generated and put 
   under the path 'lotto666/src/artifacts'.
   yarn hardhat compile
   

4. And after compile the smart contract, you are able to test the smart contract function by the 'test' file.
  yarn hardhat test

5. You can deploy the smart contract in the fuji network(here), you also can deploy in the another testnet, but you need to set this 
   tesnet in the 'network' in the hardhat.config.cjs file first. 
   yarn hardhat run scripts/deployFuji.js --network fuji          (use fuji testnet,if use another one, just change fuji)
   yarn hardhat run scripts/deployFuji.js --localhost             (use the local)

6. After done the step4, the terminal will return the smart contract address. Now copy it into the 'hardhat.config.cjs' file, and it was 
   the value of the attribute 'VITE_CONTRACT_ADDRESS'.

7. Moreover, copy all smart contracts addresses into the file 'config.tsx' which is under the path 'lotto66/src/assets'. This file is used
  to record all smart contracts addresses.

8. Now you can start your dapp: start the backend and start the frontend. 



# frontend(execute in the path/folder ui):
1.  npm install
2.  yarn add @titian-design/mobile-react
3.  yarn add @mui/icons-material
4.  yarn add @mui/material
5.  start the frontend: npm start





# Backend(excute in the path/folder backend):
1. npm install
2. start the backend: npm run dev




################## how to use metamask to connect the hardhat localhost testnet #########################

1. 在本地起一个节点， 通过hardhat去起并建立了本地的一个网络：
   npx hardhat node

2. 在metamask上添加这个节点对应的RPC地址, 即在metamask添加本地网络。
   rpc URL: http://localhost:8545
   chainId:31337
   Token: ETH

3. 查看交易的网络
   etherscan.io











############### the following is writed by my groupmate(do use) ############################

# lotto666

A simple lotto game on blockchain, selecting 6 numbers from 66

## start

yarn install

yarn run dev

## Contract

yarn hardhat compile
yarn hardhat test

edit .env

then:

yarn hardhat run scripts/deployFuji.js --network fuji

## Fuji test network

https://core.app/tools/testnet-faucet/?subnet=c&token=c

https://testnet.snowtrace.io/