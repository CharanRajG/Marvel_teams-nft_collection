/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import  Marvel_teams  from "./utils/Marvel_teams.json";
import { ethers } from "ethers";
import { hexToNumber } from "web3-utils";
 

const TWITTER_HANDLE = 'nuthan_2x';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const CONTRACT_ADDRESS = "0x3cBdAAA342e935cE8d1f2Fb3de9F7E747d9B3172";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [hash, sethash] = useState([]);
  const [txdata, settxdata] = useState(undefined);
  const [minting, setminting] = useState('Mint NFT');
  const [hasnfts, sethasnfts] = useState(undefined);
  const [chainnetwork, setchainnetwork] = useState(undefined);
  const [tokensowned, settokensowned] = useState([]);
  const [metadata, setmetadata] = useState([]);
  const [shwmints, setshwmints] = useState(false);

useEffect(() => {
  checkIfWalletIsConnected()
  mynfts()
}, []);

useEffect(() => {
  
  mynfts();
  
}, []);

useEffect(() => {
  mynfts()
  getnftdataofaccount()
}, [currentAccount]);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = ethers.utils.getAddress(accounts[0]);
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      console.log(currentAccount,"current address");
      setupEventListener()
     

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
    
      const goerliChainId = "0x5"; 
      if (chainId !== goerliChainId) {
       alert("You are not connected to the Goerli Test Network!");
      }else{
        setchainnetwork("Goerli")
      }
    } else {
      console.log("No authorized account found");
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

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
    
      const goerliChainId = "0x5"; 
      if (chainId !== goerliChainId) {
       alert("You are not connected to the Goerli Test Network!");
      }

      
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      setupEventListener()
    } catch (error) {
      console.log(error);
    }
    
  }

   // Setup our listener.
   const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, Marvel_teams.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          settxdata(`https://testnets.opensea.io/assets/0x3cBdAAA342e935cE8d1f2Fb3de9F7E747d9B3172/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
  
  
    try {
      const { ethereum } = window;
      
      if (ethereum) {
        setminting('Minting...')
        settxdata(undefined)
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, Marvel_teams.abi, signer);
        
        try {
          let ownerof100 = await connectedContract.ownerOf(100)
          console.log(ownerof100,"all minted");
          ownerof100 && alert("all tokens  minted");
        } catch(error) {
          console.log(error)
          
        }
        
        
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();
  
        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
        sethash(`https://goerli.etherscan.io/tx/${nftTxn.hash}`)
        setminting('Mint NFT')
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
      setminting('Mint NFT')
    }
  }
  //  console.log(bigNumber(5).number[0]);

  const mynfts = async() => {
    
    
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, Marvel_teams.abi, signer);
        
        let nftTxn = await connectedContract.balanceOf(currentAccount);
        console.log(nftTxn);

        nftTxn._hex !== '0x00' ? sethasnfts(true) : sethasnfts(false)
         //0xe98842c1B0065F5f4130dD1466E0a1155D1cE621
        console.log(currentAccount,"currentaccout at mynftsfn");
        console.log(hasnfts,"mynftsfn");
  
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

 
  
  const getnftdataofaccount = async () => {
  
    
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, Marvel_teams.abi, signer);

        let getmymints = await connectedContract.nftsownedby()
        console.log(getmymints,"local");

        // eslint-disable-next-line eqeqeq
        let filter = getmymints.filter(each => each[1] == currentAccount)
        // console.log(filter,"filtered");
        console.log(filter,"getmynftsfn");
        // settokensowned(filter)
        // console.log(tokensowned,"state");
        // console.log(metadata);

        let x = filter[0]
        let y = x[0]._hex
        console.log(hexToNumber(y),"hexx");
        settokensowned(filter);
       console.log(tokensowned,"updatefilter");
       displaymymints()
       console.log(metadata,"metadata");
        return filter;
        

      }else{
        console.log("Ethereum object doesn't exist!");
      }


    } catch(error) {
      console.log(error);
    }

    
  }

  const updatefilter = () => {
    let x = getnftdataofaccount()
    getnftdataofaccount()
    try {
       
       settokensowned(x)
       setshwmints(true)
       console.log(tokensowned,"updatefilter");
       console.log(metadata,"metadata");
    } catch(error) {
      console.log(error);
    }
  }

  const displaymymints = async () => {
    
      try {
        

       let arr = tokensowned.map((eachtoken,i ) => {
            let Uri = (eachtoken)
            let uri = Uri.uri
            let s = uri.slice(29)
            let b = Buffer.from(s, 'base64')
            // let metaobject = b.toString();
            let metaobject = JSON.parse(b);
            let kb = metaobject.image; 
            let kbbb = metaobject.image.slice(26);
            let img1 = Buffer.from(kbbb, 'base64')
            let img = img1.toString()

            console.log(eachtoken,"each");
            let y = eachtoken[0]._hex
            let idd = hexToNumber(y)

            
            console.log(img,"displaymynftsfn");
// 
            return {id : idd , name : metaobject.name , image : img, base64 : kb}
            

        })
        console.log(arr,"arrdisplaymynftsfn");
        setmetadata(arr);


        

    } catch(error) {
      console.log(error);
    }
    
    
  }
   
  // function decode_base64(r){var o,f={},e=[],n="",t=String.fromCharCode,$=[[65,91],[97,123],[48,58],[43,44],[47,48]];for(z in $)for(o=$[z][0];o<$[z][1];o++)e.push(t(o));for(o=0;o<64;o++)f[e[o]]=o;for(o=0;o<r.length;o+=72){var a,h,s=0,u=0,c=r.substring(o,o+72);for(h=0;h<c.length;h++)for(s=(s<<6)+(a=f[c.charAt(h)]),u+=6;u>=8;)n+=t((s>>>(u-=8))%256)}return n}

//  https://dashboard.tenderly.co/contract/goerli/0x3cBdAAA342e935cE8d1f2Fb3de9F7E747d9B3172/source

  // Render Methods
  const renderNotConnectedContainer = () => (
    <>
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect to Wallet
      </button>
      
        <a id="contract" href="https://goerli.etherscan.deth.net/address/0x3cBdAAA342e935cE8d1f2Fb3de9F7E747d9B3172#code" target="_blank" rel="noreferrer"><button className="cta-button connect-wallet-button" id="mynfts">View Contract</button></a>
    </>
  );

  const renderMintUI = () => (
    <>
      <button onClick={askContractToMintNft} className="cta-button connect-wallet-button" id="mintbutton">
       {minting}
      </button>
      <button onClick={updatefilter} className="cta-button connect-wallet-button" id="mynfts">
        My mints
      </button>
      
        <a href="https://goerli.etherscan.deth.net/address/0x3cBdAAA342e935cE8d1f2Fb3de9F7E747d9B3172#code" target="_blank" rel="noreferrer"><button className="cta-button connect-wallet-button" id="mynfts">View Contract</button></a> 
    
    
    </>
  )




  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <div>
          <p className="header gradient-text"><span className="marvel">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/128px-Marvel_Logo.svg.png" alt="marvellogo" /></span> teams NFT Collection <span className="testnet">(only on <span className="account">Goerli</span>  testnet)</span>
          </p>
          <span className="accountaddress">account: <span className="account">{`${currentAccount.slice(0,5)}...${currentAccount.slice(-4)}`}  </span> {chainnetwork && ` on ${chainnetwork}`}</span>
          </div>
          <p className="sub-text">
             Unique team. Each combo. Discover your NFT today.
          </p>
          <p className="hash">buy collections : (click) ={">"} <a href="https://testnets.opensea.io/collection/marvel-teams-v4-1" className="opensealink" id="opensealink" target="_blank" rel="noopener noreferrer"> @OPENSEA </a></p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <>
              {renderMintUI()}
               {( txdata ) && <>
               <h3 className="hash" >view tx :<a href={hash} className='opensealink' target="_blank" rel="noopener noreferrer"> {hash}</a></h3>
               
                 <h3 className="openseaa">new mint's OpenSea link: <a href={txdata} className="txdata"  target="_blank" rel="noreferrer">{txdata}</a> 
                 </h3></>
               }
            </>
            //minting !== 'Minting...' &&
          )}
        </div>
        {(hasnfts && shwmints) && (
          
          <div className="viewmynfts">
             <h5>Your Mints : {metadata?.length}</h5>
            <div className="collectioncontainer">
              
                {metadata?.map((metaa,i) => {

                  return(
                    <div className="card" key={i}>
                        {/* {imagee} */}
                        <div id="main" key={i}></div>
                        <h3><a target="_blank" rel="noreferrer" href={`https://testnets.opensea.io/assets/goerli/0x3cBdAAA342e935cE8d1f2Fb3de9F7E747d9B3172/${metaa.id}`}><button id="sell" className="cta-button connect-wallet-button" formulation={`https://testnets.opensea.io/assets/goerli/0x3cBdAAA342e935cE8d1f2Fb3de9F7E747d9B3172/${metaa.id}`}>Sell</button></a>  &nbsp; {i + 1}. {metaa.name}</h3>
                    </div>
                  )
                })}
            </div>
          </div>
          )}
   
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <h4
            className="footer-text"  target="_blank" rel="noreferrer">built by @<span> <a href={TWITTER_LINK} className='twitter' target="_blank" rel="noopener noreferrer">{TWITTER_HANDLE} </a></span></h4>
        </div>
      </div>
    </div>
  );
};

export default App;






// let imagee = (metaa.image)
                  
                  // let nmints = metadata?.length
                  // var base64img = metaa.base64;
                  //   function Base64ToImage(base64img, callback) {
                  //       var img = new Image();
                  //       img.onload = function() {
                  //           callback(img);
                  //       };
                  //       img.src = base64img;
                  //   }
                    // Base64ToImage(base64img, function(img) {
                    //     setappend(true)
                      
                    //     !append && ( i === 2 && document.getElementById('main').appendChild(img))
                    
                    //     console.log(i);
                       
                    // });