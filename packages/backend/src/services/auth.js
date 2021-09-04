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

const { generateSecret } = require("jose/util/generate_secret");
const { EncryptJWT } = require("jose/jwt/encrypt");

//import IERC721 from ".../hardhat/artifacts/contracts/IERC721.sol/IERC721.json";

// const INFURA_ID = env("INFURA_ID");
// const tokenAddress = "0x2414F22e3a423DD63d085dD0d667334F060d733d";

//Private key just for testing
let secretKey = null;
generateSecret("HS256").then(
  (generatedSecret) => (secretKey = generatedSecret)
);

function seedMessage() {
  const currentDate = String(Date.now());
  let currentMessage = `I am **ADDRESS** and I would like to sign in to YourDapp, plz! This message was sent on ${currentDate}`;

  return { message: currentMessage, date: currentDate };
}

async function verifySignedMessage(parent, args, context, info) {
  console.log("mutatiosn", args);
  const { message, signature, address } = args;
  //Placeholder for testing

  const jwt = await new EncryptJWT({ address: address })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setIssuer("authenticated::AMA")
    .setExpirationTime("2h")
    .encrypt(secretKey);

  return {
    status: true,
    details: "You're a good boy :D",
    authToken: jwt,
  };

  //IP needed?
  //const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  //console.log("POST from ip address:", ip, message);

  // if (message !== currentMessage.replace("**ADDRESS**", address)) {
  //   return { status: false, details: " ⚠️ Secret message mismatch!?! Please reload and try again. Sorry! 😅" };
  // } else {
  //     let recovered = ethers.utils.verifyMessage(message, signature)

  //     const userAddress = address;

  //     if (recovered == address) {

  //         const ropstenInfura = new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);

  //         const tokenContract = new ethers.Contract(tokenAddress, IERC721.abi, ropstenInfura)

  //         const tokenBalance = await tokenContract.balanceOf(userAddress);

  //         const userHasTokens = tokenBalance && tokenBalance.gt(0);

  //         if (userHasTokens) {
  //             response.send(" 👍 successfully signed in as [" + userAddress + "]! Ask away!");
  //             //**Access hidden content**
  //         } else {
  //             response.send(" 🤔 successfully signed in as [" + userAddress + "]... But you don't have the required token to participate.");

  //         }

  //     }

  //}
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
