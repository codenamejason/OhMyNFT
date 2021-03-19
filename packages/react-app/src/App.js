import { Col, Row } from "antd";
import "antd/dist/antd.css";
//import { gql } from "apollo-boost";
import { ethers } from "ethers";
import React, { useState } from "react";
//import { useQuery } from "@apollo/react-hooks";
import "./App.css";
import { Account, Faucet, Header, Provider, Ramp } from "./components";
import { useExchangePrice, useGasPrice } from "./hooks";
import SmartContractWallet from "./SmartContractWallet.js";

const mainnetProvider = new ethers.providers.InfuraProvider(
  "mainnet",
  "2717afb6bf164045b5d5468031b93f87"
);
const localProvider = new ethers.providers.JsonRpcProvider(
  process.env.REACT_APP_PROVIDER
    ? process.env.REACT_APP_PROVIDER
    : "http://localhost:8545"
);

function App() {
  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(mainnetProvider);
  const gasPrice = useGasPrice("fast");

  return (
    <div className="App">
      <Row align="middle">
        <Col xs={24} lg={14}>
          <Header />
        </Col>
        <Col xs={24} lg={10}>
          <div className="account">
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
        </Col>
      </Row>

      <div style={{ padding: "30px 30px 0" }}>
        <SmartContractWallet
          address={address}
          injectedProvider={injectedProvider}
          localProvider={localProvider}
          price={price}
          gasPrice={gasPrice}
        />
      </div>
      <div className="container text-center mt-4">
        <Row align="middle" gutter={4}>
          <Col className="mobile-spacer" xs={24} md={8}>
            <Provider name={"mainnet"} provider={mainnetProvider} />
          </Col>
          <Col className="mobile-spacer" xs={24} md={8}>
            <Provider name={"local"} provider={localProvider} />
          </Col>
          <Col className="mobile-spacer" xs={24} md={8}>
            <Provider name={"injected"} provider={injectedProvider} />
          </Col>
        </Row>
      </div>
      <div className="container mt-8">
        <Row align="middle" gutter={4}>
          <Col className="mobile-spacer text-center" xs={24} md={8}>
            <Ramp price={price} address={address} />
          </Col>
          <Col className="mobile-spacer" xs={24} md={16}>
            <Faucet localProvider={localProvider} price={price} />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
