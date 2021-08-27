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

let currentMessage =
  "I am **ADDRESS** and I would like to sign in to YourDapp, plz! s";

function seedMessage() {
  return { message: currentMessage, date: String(Date.now()) };
}

function verifySignedMessage(parent, args, context, info) {
  console.log("mutation", args);

  //Migrate this code to graphQL

  //   const ip =
  //     request.headers["x-forwarded-for"] || request.connection.remoteAddress;
  //   console.log("POST from ip address:", ip, request.body.message);
  //   if (
  //     request.body.message !=
  //     currentMessage.replace("**ADDRESS**", request.body.address)
  //   ) {
  //     response.send(
  //       " ⚠️ Secret message mismatch!?! Please reload and try again. Sorry! 😅"
  //     );
  //   } else {
  //     let recovered = ethers.utils.verifyMessage(
  //       request.body.message,
  //       request.body.signature
  //     );
  //     if (recovered == request.body.address) {
  //       /*
  //             maybe you want to send them some tokens or ETH?
  //           let sendResult = await wallet.sendTransaction({
  //             to: request.body.address,
  //             value: ethers.utils.parseEther("0.01")
  //           })
  //           */
  //       response.send(
  //         " 👍 successfully signed in as " + request.body.address + "!"
  //       );
  //     }
  //   }
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
