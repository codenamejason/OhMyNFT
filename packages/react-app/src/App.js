import { Button, Col, Row } from 'antd';
import 'antd/dist/antd.css';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import './App.css';
import { Ramp } from './components';
import { useContractLoader, useExchangePrice, useGasPrice } from './hooks';
import NftyWallet from './NftyWallet.js';

const mainnetProvider = new ethers.providers.InfuraProvider(
  'mainnet',
  '9ea7e149b122423991f56257b882261c'
);

let localProvider;
if (process.env.REACT_APP_NETWORK_NAME) {
  localProvider = new ethers.providers.InfuraProvider(
    process.env.REACT_APP_NETWORK_NAME,
    '9ea7e149b122423991f56257b882261c'
  );
} else {
  localProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
}

let relayHubAddress = '0x2E0d94754b348D208D64d52d78BcD443aFA9fa52'; //require('./gsn/RelayHub.json').address
let stakeManagerAddress = '0x0ecf783407C5C80D71CFEa37938C0b60BD255FF8'; //require('./gsn/StakeManager.json').address
let paymasterAddress = '0x38489512d064106f5A7AD3d9e13268Aaf777A41c'; //require('./gsn/Paymaster.json').address

function App() {
  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const [metaProvider, setMetaProvider] = useState();
  const price = useExchangePrice(mainnetProvider);
  const gasPrice = useGasPrice('fast');

  //console.log("gasPrice",gasPrice)

  const readContracts = useContractLoader(localProvider);

  const gsnConfig = { relayHubAddress, stakeManagerAddress, paymasterAddress };

  return (
    <div className="App">
      <NftyWallet
        address={address}
        setAddress={setAddress}
        localProvider={localProvider}
        injectedProvider={injectedProvider}
        setInjectedProvider={setInjectedProvider}
        mainnetProvider={mainnetProvider}
        price={price}
        minimized={true}
        readContracts={readContracts}
        setMetaProvider={setMetaProvider}
        metaProvider={metaProvider}
        gsnConfig={gsnConfig}
        gasPrice={gasPrice}
      />

      <div
        style={{
          position: 'fixed',
          textAlign: 'left',
          left: 0,
          bottom: 20,
          padding: 10,
        }}
      >
        <Row gutter={8}>
          <Col>
            <Ramp price={price} address={address} />
          </Col>
          <Col>
            <Button
              onClick={() => {
                window.open('https://ethgasstation.info/');
              }}
              size="large"
              shape="round"
            >
              <span style={{ marginRight: 8 }}>⛽️</span>
              {parseInt(gasPrice) / 10 ** 9}g
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
