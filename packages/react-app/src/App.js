import React, { useState } from 'react'
import 'antd/dist/antd.css';
//import { gql } from "apollo-boost";
import { ethers } from "ethers";
//import { useQuery } from "@apollo/react-hooks";
import "./App.css";
import { useExchangePrice, useGasPrice } from "./hooks"
import { Header, Account, Provider, Faucet } from "./components"

import SmartContractWallet from './SmartContractWallet.js'

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet","2717afb6bf164045b5d5468031b93f87")
const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER?process.env.REACT_APP_PROVIDER:"http://localhost:8545")

function App() {

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(mainnetProvider)
  const gasPrice = useGasPrice("fast")

  return (
    <div className="App">
      <Header />
      <div style={{position:'fixed',textAlign:'right',right:0,top:0,padding:10}}>
        <Account
          address={address}
          setAddress={setAddress}
          localProvider={localProvider}
          injectedProvider={injectedProvider}
          setInjectedProvider={setInjectedProvider}
          mainnetProvider={mainnetProvider}
          price={price}
        />
      </div>
      <div style={{padding:40,textAlign: "left"}}>
        <SmartContractWallet
          address={address}
          injectedProvider={injectedProvider}
          localProvider={localProvider}
          price={price}
          gasPrice={gasPrice}
        />
      </div>
      <div style={{position:'fixed',textAlign:'right',right:0,bottom:20,padding:10}}>
        <div style={{padding:8}}>
          <Provider name={"mainnet"} provider={mainnetProvider} />
        </div>
        <div style={{padding:8}}>
          <Provider name={"local"} provider={localProvider} />
        </div>
        <div style={{padding:8}}>
          <Provider name={"injected"} provider={injectedProvider} />
        </div>
      </div>
      <div style={{position:'fixed',textAlign:'left',left:0,bottom:0,padding:10}}>
        <Faucet
          localProvider={localProvider}
          dollarMultiplier={price}
        />
      </div>

    </div>
  );
}

export default App;
