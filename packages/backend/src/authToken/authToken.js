const { generateSecret } = require("jose/util/generate_secret");
const { EncryptJWT } = require("jose/jwt/encrypt");
const { jwtDecrypt } = require("jose/jwt/decrypt");

//Private key just for testing
let secretKey = null;
generateSecret("HS256").then(
  (generatedSecret) => (secretKey = generatedSecret)
);
const issuer = "authenticated::AMA";

async function createAuthToken({ address }) {
  const jwt = await new EncryptJWT({ address })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setIssuer(issuer)
    .setExpirationTime("2h")
    .encrypt(secretKey);

  return jwt;
}

async function verifyAuthToken(jwt) {
  const { payload } = await jwtDecrypt(jwt, secretKey, {
    issuer,
  });

  return payload;
}

//import IERC721 from ".../hardhat/artifacts/contracts/IERC721.sol/IERC721.json";

// const INFURA_ID = env("INFURA_ID");
// const tokenAddress = "0x2414F22e3a423DD63d085dD0d667334F060d733d";

async function verifyWithAddressHasTokens() {
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
}

module.exports = { createAuthToken, verifyAuthToken };
