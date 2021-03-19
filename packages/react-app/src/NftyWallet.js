import { PlusOutlined } from '@ant-design/icons';
import { Badge, Button, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import AllNiftyInks from './AllNiftyInks.js';
import { Account } from './components';
import { useContractReader, useLocalStorage } from './hooks';
import InkCanvas from './InkCanvas.js';
import InkInfo from './InkInfo.js';
import MyNiftyHoldings from './MyNiftyHoldings.js';
import MyNiftyInks from './MyNiftyInks.js';
const { TabPane } = Tabs;

const isIPFS = require('is-ipfs');
const ipfsConfig = { host: 'ipfs.infura.io', port: '5001', protocol: 'https' };

export default function NftyWallet(props) {
  const [tab, setTab] = useState('1');

  const [mode, setMode] = useState('edit');

  const [drawing, setDrawing] = useLocalStorage('drawing');
  const [ipfsHash, setIpfsHash] = useState();
  const [ink, setInk] = useState({});
  const [formLimit, setFormLimit] = useState();
  const [canvasKey, setCanvasKey] = useState(Date.now());

  let nftyBalance = useContractReader(
    props.readContracts,
    'NFTINK',
    'balanceOf',
    [props.address],
    1777
  );
  let inksCreatedBy = useContractReader(
    props.readContracts,
    'NFTINK',
    'inksCreatedBy',
    [props.address],
    1777
  );
  let totalInks = useContractReader(
    props.readContracts,
    'NFTINK',
    'totalInks',
    1777
  );

  let displayBalance;
  if (nftyBalance) {
    displayBalance = nftyBalance.toString();
  }
  let displayInksCreated;
  if (inksCreatedBy) {
    displayInksCreated = inksCreatedBy.toString();
  }
  let displayTotalInks;
  if (totalInks) {
    displayTotalInks = totalInks.toString();
  }

  const showInk = (newIpfsHash) => {
    console.log(newIpfsHash);
    if (newIpfsHash === ipfsHash) {
      setTab('2');
    } else {
      window.history.pushState(
        { id: newIpfsHash },
        newIpfsHash,
        '/' + newIpfsHash
      );
      setDrawing();
      setInk({});
      setIpfsHash(newIpfsHash);
      setMode('mint');
      setTab('2');
      setCanvasKey(Date.now());
      return false;
    }
  };

  const newInk = () => {
    window.history.pushState({ id: 'draw' }, 'draw', '/');
    setMode('edit');
    setDrawing('');
    setIpfsHash();
    setFormLimit();
    setInk({});
    setTab('2');
    setCanvasKey(Date.now());
  };

  const badgeStyle = {
    backgroundColor: '#fff',
    color: '#999',
    boxShadow: '0 0 0 1px #d9d9d9 inset',
  };

  useEffect(() => {
    const loadPage = async () => {
      let ipfsHashRequest = window.location.pathname.replace('/', '');
      if (ipfsHashRequest && isIPFS.multihash(ipfsHashRequest)) {
        setMode('mint');
        setDrawing('');
        setTab('2');
        setIpfsHash(ipfsHashRequest);
      } else {
        if (ipfsHashRequest) {
          window.history.pushState({ id: 'edit' }, 'edit', '/');
        }
      }
    };
    loadPage();
  }, [setDrawing]);

  let newButton;
  if (true /*mode!=="edit" /*|| tab!=="1"*/) {
    newButton = (
      <div
        style={{
          position: 'fixed',
          textAlign: 'right',
          right: 0,
          bottom: 20,
          padding: 10,
        }}
      >
        <Button
          style={{ marginRight: 8 }}
          shape="round"
          size="large"
          type="primary"
          onClick={() => {
            newInk();
          }}
        >
          <PlusOutlined /> New Ink
        </Button>
      </div>
    );
  } else {
    newButton = <></>;
  }

  let inkInfo;

  if (mode === 'edit') {
    inkInfo = null;
  } else if (mode === 'mint') {
    inkInfo = (
      <InkInfo
        address={props.address}
        mainnetProvider={props.mainnetProvider}
        injectedProvider={props.injectedProvider}
        readContracts={props.readContracts}
        ink={ink}
        setInk={setInk}
        ipfsHash={ipfsHash}
        ipfsConfig={ipfsConfig}
        gasPrice={props.gasPrice}
      />
    );
  }

  return (
    <>
      <Account
        address={props.address}
        setAddress={props.setAddress}
        localProvider={props.localProvider}
        injectedProvider={props.injectedProvider}
        setInjectedProvider={props.setInjectedProvider}
        mainnetProvider={props.mainnetProvider}
        price={props.price}
        minimized={props.minimized}
        setMetaProvider={props.setMetaProvider}
        metaProvider={props.metaProvider}
        gsnConfig={props.gsnConfig}
      />

      <Tabs
        activeKey={tab}
        onChange={setTab}
        style={{ textAlign: 'center' }}
        defaultActiveKey="1"
      >
        <TabPane
          tab={
            <>
              <span style={{ fontSize: 24, padding: 8 }}>🧑‍🎨 Nifty Ink</span>
              <Badge style={badgeStyle} count={displayTotalInks} showZero />
            </>
          }
          key="1"
        >
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <AllNiftyInks
              mainnetProvider={props.mainnetProvider}
              injectedProvider={props.injectedProvider}
              localProvider={props.localProvider}
              readContracts={props.readContracts}
              tab={tab}
              showInk={showInk}
              ipfsConfig={ipfsConfig}
              totalInks={totalInks}
              thisTab={'1'}
            />
          </div>
        </TabPane>
        <TabPane
          tab={
            <>
              <span>
                <span style={{ padding: 8 }}>🖌️</span> Create Ink
              </span>
            </>
          }
          key="2"
        >
          <div>
            <InkCanvas
              canvasKey={canvasKey}
              address={props.address}
              mainnetProvider={props.mainnetProvider}
              injectedProvider={props.injectedProvider}
              readContracts={props.readContracts}
              mode={mode}
              ink={ink}
              ipfsHash={ipfsHash}
              setMode={setMode}
              setIpfsHash={setIpfsHash}
              setInk={setInk}
              drawing={drawing}
              setDrawing={setDrawing}
              formLimit={formLimit}
              setFormLimit={setFormLimit}
              ipfsConfig={ipfsConfig}
              metaProvider={props.metaProvider}
              gasPrice={props.gasPrice}
            />
            {inkInfo}
          </div>
        </TabPane>
        <TabPane
          tab={
            <>
              <span>
                <span style={{ padding: 8 }}>🖼</span> inks
              </span>{' '}
              <Badge style={badgeStyle} count={displayInksCreated} showZero />
            </>
          }
          key="3"
        >
          <div style={{ width: 300, margin: '0 auto' }}>
            <MyNiftyInks
              address={props.address}
              mainnetProvider={props.mainnetProvider}
              injectedProvider={props.injectedProvider}
              readContracts={props.readContracts}
              tab={tab}
              showInk={showInk}
              ipfsConfig={ipfsConfig}
              inksCreatedBy={inksCreatedBy}
              thisTab={'3'}
              newInk={newInk}
            />
          </div>
        </TabPane>
        <TabPane
          tab={
            <>
              <span>
                <span style={{ padding: 8 }}>👛</span> holdings
              </span>{' '}
              <Badge style={badgeStyle} count={displayBalance} showZero />
            </>
          }
          key="4"
        >
          <div style={{ maxWidth: 300, margin: '0 auto' }}>
            <MyNiftyHoldings
              address={props.address}
              mainnetProvider={props.mainnetProvider}
              injectedProvider={props.injectedProvider}
              readContracts={props.readContracts}
              tab={tab}
              showInk={showInk}
              ipfsConfig={ipfsConfig}
              nftyBalance={nftyBalance}
              thisTab={'4'}
            />
          </div>
        </TabPane>
      </Tabs>

      {newButton}
    </>
  );
}
