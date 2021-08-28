/*
  Uncomment this if you want to create a wallet to send ETH or something...
const INFURA = JSON.parse(fs.readFileSync("./infura.txt").toString().trim())
const PK = fs.readFileSync("./pk.txt").toString().trim()
let wallet = new ethers.Wallet(PK,new ethers.providers.InfuraProvider("goerli",INFURA))
console.log(wallet.address)
const checkWalletBalance = async ()=>{
  console.log("BALANCE:",ethers.utils.formatEther(await wallet.provider.getBalance(wallet.address)))
}
checkWalletBalance()ss
*/
var ethers = require("ethers");

import IERC721 from ".../hardhat/artifacts/contracts/IERC721.sol/IERC721.json";

const INFURA_ID = env("INFURA_ID");
const tokenAddress = "0x2414F22e3a423DD63d085dD0d667334F060d733d";

let currentMessage =
  "I am **ADDRESS** and I would like to sign in to YourDapp, plz! s";

function seedMessage() {
  return { message: currentMessage, date: String(Date.now()) };
}

function verifySignedMessage(parent, args, context, info) {
  console.log("mutation", args);
  //IP needed?


  /* 
  
     const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
     console.log("POST from ip address:", ip, request.body.message)
     if (request.body.message != currentMessage.replace("**ADDRESS**", request.body.address)) {
         response.send(" ⚠️ Secret message mismatch!?! Please reload and try again. Sorry! 😅");
     } else {
         let recovered = ethers.utils.verifyMessage(request.body.message, request.body.signature)
 
         const userAddress = request.body.address;
 
         if (recovered == request.body.address) {
 
             const ropstenInfura = new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);
 
             const tokenContract = new ethers.Contract(tokenAddress, IERC721.abi, ropstenInfura)
 
             const tokenBalance = await tokenContract.balanceOf(userAddress);
 
             const userHasTokens = tokenBalance && tokenBalance.gt(0);
 
             if (userHasTokens) {
                 response.send(" 👍 successfully signed in as [" + userAddress + "]! Ask away!");
                 //**Access hidden content**
             } else {
                 response.send(" 🤔 successfully signed in as [" + userAddress + "]... But you don't have the required token to participate.");
 
             }
 
 
         }
     }
 });*/
}

const AuthResolver = {
  Query: {
    seedMessage,
  },
  Mutation: {
    verifySignedMessage,
  },
};

module.exports = AuthResolver;
