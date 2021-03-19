import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { Address, AddressInput, Balance, EtherInput, Blockie } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { useContractReader, useEventListener } from "../hooks";
const axios = require('axios');

export default function CreateTransaction({poolServerUrl, contractName, address, setRoute, userProvider, mainnetProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {

  const history = useHistory();

  // keep track of a variable from the contract in the local React state:
  const nonce = useContractReader(readContracts,contractName, "nonce")
  console.log("🤗 nonce:",nonce)

  console.log("price",price)

  const [customNonce, setCustomNonce] = useState();
  const [to, setTo] = useLocalStorage("to");
  const [amount, setAmount] = useLocalStorage("amount","0");
  const [data, setData] = useLocalStorage("data","0x");

  const [result, setResult] = useState();

  const inputStyle = {
    padding: 10,
  };

  let resultDisplay
  if(result){
    if(result.indexOf("ERROR")>=0){
      resultDisplay = (
        <div style={{margin:16,padding:8, color:"red"}}>
          {result}
        </div>
      )
    }else{
      resultDisplay = (
        <div style={{margin:16,padding:8}}>
          <Blockie size={4} scale={8} address={result} /> Tx {result.substr(0,6)} Created!

          <div style={{margin:8,padding:4}}>
            <Spin />
          </div>
        </div>
      )
    }
  }

  let decodedData = ""
  if(data&&data!="0x"){
    let decodedDataObject = readContracts?readContracts[contractName].interface.parseTransaction({data:data}):""
    console.log("decodedDataObject",decodedDataObject)
    let argDisplay = []
    for(let a=0;decodedDataObject && a<decodedDataObject.args.length;a++){
      let thisValue = decodedDataObject.args[a]
      if(thisValue){
        if(thisValue._isBigNumber){
          try{
            thisValue = thisValue.toNumber()
          }catch(e){
            thisValue = formatEther(thisValue)
          }
        }
        argDisplay.push(
          <div key={"args_"+a}>
            {thisValue}
          </div>
        )
      }
    }
    decodedData = (
      <div>
        <div style={{marginTop:16,marginBottom:16}}>
          {decodedDataObject.signature}
        </div>
        {argDisplay}
      </div>
    )
  }


  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto",marginTop:64}}>

        <div style={{margin:8}}>
          <div style={inputStyle}>
            <Input prefix={"#"} disabled={true} value={customNonce} placeholder={""+(nonce?nonce.toNumber():"loading...")} onChange={setCustomNonce} />
          </div>

          <div style={inputStyle}>
            <AddressInput
              autoFocus
              ensProvider={mainnetProvider}
              placeholder="to address"
              value={to}
              onChange={setTo}
            />
          </div>

          <div style={inputStyle}>
            <EtherInput
              price={price}
              mode={"USD"}
              value={amount}
              onChange={setAmount}
            />
          </div>

          <div style={inputStyle}>
            <Input placeholder={"calldata"} value={data} onChange={(e)=>{setData(e.target.value)}} />
            {decodedData}
          </div>

          <Button style={{marginTop:32}} onClick={async ()=>{

            console.log("customNonce",customNonce)
            let nonce = customNonce?customNonce:await readContracts[contractName].nonce()
            console.log("nonce",nonce)

            let newHash = await readContracts[contractName].getTransactionHash(nonce,to,parseEther(""+parseFloat(amount).toFixed(12)),data)
            console.log("newHash",newHash)

            let signature = await userProvider.send("personal_sign", [newHash, address]);
            console.log("signature",signature)

            let recover = await readContracts[contractName].recover(newHash,signature)
            console.log("recover",recover)

            let isOwner = await readContracts[contractName].isOwner(recover)
            console.log("isOwner",isOwner)

            if(isOwner){
              const res = await axios.post(poolServerUrl, { address: readContracts[contractName].address, nonce: nonce.toNumber(), to, amount, data, hash: newHash, signatures:[ signature ], signers: [ recover ] });
              // IF SIG IS VALUE ETC END TO SERVER AND SERVER VERIFIES SIG IS RIGHT AND IS SIGNER BEFORE ADDING TY

              console.log("RESULT",res.data)

              setTimeout(()=>{
                history.push('/pool')
              },2777)

              setResult(res.data.hash)
              setTo()
              setAmount("0")
              setData("0x")

            }else{
              console.log("ERROR, NOT OWNER.")
              setResult("ERROR, NOT OWNER.")
            }

          }}>Create</Button>

        </div>

        {resultDisplay}

      </div>

    </div>
  );
}

function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
