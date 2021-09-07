import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { Button, Menu, Alert, Layout } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";

import { formatEther } from "@ethersproject/units";

import { ethers } from "ethers";
import { useExchangePrice, useGasPrice, useUserProvider, useBalance } from "./hooks";
import { Header as AppHeader } from "./components";
import { Transactor } from "./helpers";

import { INFURA_ID, NETWORK, NETWORKS } from "./constants";
import PostsView from "./views/PostsView";
import PostView from "./views/PostView";

import UserAuthentication from "./components/User/UserAuthentication";

import DecentralisedDonuts from "./contracts/DecentralisedDonuts.abi.js";
import FictionalFinance from "./contracts/FictionalFinance.abi.js";
import InterestingIguanas from "./contracts/InterestingIguanas.abi.js";

const { Content } = Layout;

const donutAddress = "0x6e6598Bd833c3ABf05dBb64c0FDfEd11e6881E26";
const fictionalAddress = "0xD5BF303973Fef7B7821378E8aFE890BEd8b102f3";
const iguanaAddress = "0x6845556EAbdB4a535B98746CB4A2ee4BF79C508e";

/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.ropsten; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = new StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544");
const mainnetInfura = new StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

function App(props) {
  const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId = userProvider && userProvider._network && userProvider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  // const yourMainnetBalance = useBalance(mainnetProvider, address);

  // Load in your local 📝 contract and read a value from it:
  // const readContracts = useContractLoader(localProvider)

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  // const writeContracts = useContractLoader(userProvider)

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  //  const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI)

  // If you want to call a function on a new block
  // useOnBlock(mainnetProvider, () => {
  //   console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  // });

  // Then read your DAI balance like:
  //  const myMainnetDAIBalance = useContractReader({DAI: mainnetDAIContract},"DAI", "balanceOf",["0x34aA3F359A9D614239015126635CE7732c18fDF3"])

  // keep track of a variable from the contract in the local React state:
  // const purpose = useContractReader(readContracts,"YourContract", "purpose")

  // 📟 Listen for broadcast events
  // const setPurposeEvents = useEventListener(readContracts, "YourContract", "SetPurpose", localProvider, 1);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance /* &&  yourMainnetBalance &&readContracts && writeContracts && mainnetDAIContract */
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? formatEther(yourLocalBalance) : "...");
      /* console.log("💵 yourMainnetBalance",yourMainnetBalance?formatEther(yourMainnetBalance):"...") */
      /*  console.log("📝 readContracts",readContracts) */
      /* console.log("🌍 DAI contract on mainnet:",mainnetDAIContract) */
      /*  console.log("🔐 writeContracts",writeContracts) */
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance /* yourMainnetBalance, readContracts, writeContracts, mainnetDAIContract */,
  ]);

  let networkDisplay = "";
  if (localChainId && selectedChainId && localChainId != selectedChainId) {
    networkDisplay = (
      <div style={{ zIndex: 2, position: "absolute", right: 0, top: 0, padding: 16 }}>
        <Alert
          message="⚠️ Wrong Network"
          description={
            <div>
              You have <b>{NETWORK(selectedChainId).name}</b> selected and you need to be on{" "}
              <b>{NETWORK(localChainId).name}</b>.
            </div>
          }
          type="error"
          closable={false}
        />
      </div>
    );
  } else {
    networkDisplay = <div style={{ color: targetNetwork.color }}>{targetNetwork.name}</div>;
  }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  async function mintDonut() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(donutAddress, DecentralisedDonuts, signer);
    try {
      const mint = await contract.mintToken();
      await mint.wait();
      console.log("1 Decentralised Donut minted");
    } catch (error) {
      console.error("Transaction Failed. Address already opted in?");
    }
  }

  async function mintFictional() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(fictionalAddress, FictionalFinance, signer);
    try {
      const mint = await contract.mintToken();
      await mint.wait();
      console.log("1 Fictional Finance Token minted");
    } catch (error) {
      console.error("Transaction Failed. Address already opted in?");
    }
  }

  async function mintIguana() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(iguanaAddress, InterestingIguanas, signer);
    try {
      const mint = await contract.mintToken();
      await mint.wait();
      console.log("1 Interesting Iguana minted");
    } catch (error) {
      console.error("Transaction Failed. Address already opted in?");
    }
  }
  const isSigner = injectedProvider && injectedProvider.getSigner && injectedProvider.getSigner()._isSigner;

  return (
    <div className="App">
      <Layout>
        <AppHeader networkDisplay={networkDisplay} />

        <Content>
          {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
          {/* <div style={{ textAlign: "center", padding: 10 }}>
            <Account
              connectText="Connect Ethereum Wallet"
              onlyShowButton={!isSigner}
              address={address}
              localProvider={localProvider}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              price={price}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
            />
          </div> */}

          <UserAuthentication
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            injectedProvider={injectedProvider}
            userProvider={userProvider}
            address={address}
            mainnetProvider={mainnetProvider}
            blockExplorer={blockExplorer}
          />

          <BrowserRouter>
            <Menu
              style={{ textAlign: "center", display: "flex", justifyContent: "center" }}
              selectedKeys={[route]}
              mode="horizontal"
            >
              <Menu.Item key="/">
                <Link
                  onClick={() => {
                    setRoute("/");
                  }}
                  to="/"
                >
                  AMA
                </Link>
              </Menu.Item>
              <Menu.Item key="/about">
                <Link
                  onClick={() => {
                    setRoute("/about");
                  }}
                  to="/about"
                >
                  About
                </Link>
              </Menu.Item>

              <Menu.Item key="/faucet">
                <Link
                  onClick={() => {
                    setRoute("/faucet");
                  }}
                  to="/faucet"
                />
                Mint Test Tokens
              </Menu.Item>
            </Menu>

            <Switch>
              <Route exact path="/about">
                <p style={{ marginTop: 24, fontSize: 16 }}>
                  Authenticated AMAs offer a simple way for builders/creators to host AMAs with members of their
                  community. 🔊
                </p>

                <p style={{ marginTop: 12, fontSize: 16 }}>
                  {" "}
                  AMA hosts can specify the token required to take part in the AMA so they can be sure the participants
                  are shareholders in the project. 👨‍👩‍👧‍👦
                </p>

                <p style={{ marginTop: 12, fontSize: 16 }}>
                  {" "}
                  Participation requires only that users sign a message confirming their ethereum address, this way
                  nobody has to pay gas to host or participate in an Authenticated AMA. 💸
                </p>

                <p style={{ marginTop: 12, fontSize: 16 }}>
                  {" "}
                  Authenticated AMAs are a great way to give back to your community and ensure that you are interacting
                  with real community members. 🔎
                </p>
              </Route>

              <Route exact path="/post/:id">
                <PostView />
              </Route>

              <Route exact path="/faucet">
                <p style={{ marginTop: 24, fontSize: 20 }}>Mint some dummy ERC721 tokens to test out the site. 🔨</p>
                <p>
                  <Button style={{ marginTop: 32 }} type="primary" onClick={mintDonut}>
                    Mint A Decentralised Donut 🍩
                  </Button>
                </p>
                <p>
                  <Button style={{ marginTop: 32 }} type="primary" onClick={mintFictional}>
                    Mint A Fictional Finance Token 💰
                  </Button>
                </p>
                <p>
                  <Button style={{ marginTop: 32 }} type="primary" onClick={mintIguana}>
                    Mint An Interesting Iguana 🦎
                  </Button>
                </p>
              </Route>

              <Route path="/">
                <PostsView />
              </Route>
            </Switch>
          </BrowserRouter>
        </Content>
      </Layout>
    </div>
  );
}

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

window.ethereum &&
  window.ethereum.on("chainChanged", chainId => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });

window.ethereum &&
  window.ethereum.on("accountsChanged", accounts => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });

export default App;
