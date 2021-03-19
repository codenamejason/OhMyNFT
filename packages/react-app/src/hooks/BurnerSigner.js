import { useState, useEffect } from 'react';
const { ethers } = require("ethers");

export default function useBurnerSigner(provider) {

  let key = 'metaPrivateKey'

  useEffect(() => {
    const storedKey = window.localStorage.getItem(key);
    if(!storedKey) {
      console.log('generating a new key')
      let _newWallet = ethers.Wallet.createRandom()
      let _newKey = _newWallet.privateKey
      setValue(_newKey)
      return _newKey
    }
  },[])

  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      return window.localStorage.getItem(key);
    } catch (error) {
      console.log(error);
    }
  });

  const setValue = value => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  };

  let wallet
  let signer

  if(storedValue) {
    wallet = new ethers.Wallet(storedValue)
    signer = wallet.connect(provider)
  }

  return signer;
}
