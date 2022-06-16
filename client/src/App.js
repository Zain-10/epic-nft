import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, {useEffect , useState} from "react";
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNFT.json';
import Loader from "./Loader/Loader";

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/squarenft-31ovj64utw';
const TOTAL_MINT_COUNT = 50;

const contractAddress = "0x29e0BC3262fD18f8A54C35CcAD91eDc8De21F7fc";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const checkIfWalletIsConnected = async () => {
    try{
     const { ethereum } = window;
 
     if (!ethereum) {
       console.log("Make sure you have metamask!");
     } else {
       console.log("We have the ethereum object");
     }
 
     const accounts = await ethereum.request({ method: "eth_accounts" });
 
     if (accounts.length !== 0){
       const account=accounts[0];
       console.log("Found an authorized account:");
       setCurrentAccount(account);
       setupEventListener()
     }else{
       console.log("No authorized account found");
     }
    }catch(error){
       console.log(error);
    }
   }
 
  const connectWallet = async () => {
     try {
       const { ethereum } = window;
 
       if (!ethereum) {
         alert("Get MetaMask!");
         return;
       }
 
       const accounts = await ethereum.request({ method: "eth_requestAccounts" });
 
       console.log("Connected", accounts[0]);
       setCurrentAccount(accounts[0]);
       setupEventListener()
     } catch (error) {
       console.log(error)
     }
  }

  const testNetwork = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
	      alert("You are not connected to the Rinkeby Test Network!");
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(contractAddress, myEpicNft.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${contractAddress}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () =>{
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(contractAddress, myEpicNft.abi, signer);

        let totalNfts = await connectedContract.getTotalNFTsMintedSoFar();
        if (totalNfts <= TOTAL_MINT_COUNT){
          let nftTxn = await connectedContract.makeAnEpicNFT();
          setIsLoading(true);
          console.log("mining...", nftTxn.hash)
          await nftTxn.wait();
          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
          setIsLoading(false);
        }else{
          alert("Limit Reached");
        }
      }else{
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
        console.log(error);
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
    testNetwork();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
          { isLoading? (<Loader/>) : (<div></div>)}
        </div>
          <a className='openSea' href={OPENSEA_LINK}>🌊 View Collection on OpenSea</a>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
