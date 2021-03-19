# 🏗 scaffold-eth gets optimistic

> [optimism](https://optimism.io/) proof-of-concept

---

## quickstart

```bash
git clone -b oo-ee https://github.com/austintgriffith/scaffold-eth.git optimistic-scaffold

cd optimistic-scaffold
```

```bash

yarn install

```

```bash

yarn start

```

> in a second terminal window:

__This requires Docker__
Initiate the Optimism submodules...
```bash
cd scaffold-eth/docker/optimism-integration
git submodule init
git submodule update
```
Kick off the local chain, l2 & relay infrastructure (it kind of feels like a space-ship taking off)
```bash
cd scaffold-eth/docker/optimism-integration
make up
```

> in a third terminal window, generate a local account:

```bash
cd scaffold-eth
yarn generate
```
Send that account some ETH using the faucet from http://localhost:3000/ to fund the deployments

> when the local nodes are up and running, deploy local contracts & attempt to go from L1 -> L2 and back again!
```
yarn deploy-oe
```

This deploys an amended `YourContract.sol` and a suite of L1<->L2 erc20 contracts

__Kudos & thanks to the Optimistic Ethereum team whose [erc20 example](https://github.com/ethereum-optimism/optimism-tutorial/tree/deposit-withdrawal) this benefited from!__

### frontend
There are three tabs:
- ETH bridging to Optimistic Eth (send yourself some L1 ETH with the faucet!)
- YourContract on L2
- OldEnglish ERC20 & Bridge contracts (make sure you approve the Gateway to bridge!)

## Notes
- Is OE eompatible with hardhat config accounts? I had to instantiate in my deploy script
- Get a silent failure on L2 if I don't reset the nonces in Metamask
