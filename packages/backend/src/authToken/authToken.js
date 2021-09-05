const { generateSecret } = require("jose/util/generate_secret");
const { EncryptJWT } = require("jose/jwt/encrypt");
const { jwtDecrypt } = require("jose/jwt/decrypt");
const ethers = require("ethers");

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

const IERC721 = require("../../../hardhat/artifacts/contracts/IERC721.sol/IERC721.json");
const INFURA_ID = process.env.INFURA_ID;
const networkLink = "https://ropsten.infura.io/v3/";

async function verifyIfAddressHasTokens({ address }) {
  const tokenAddress = "0x2414F22e3a423DD63d085dD0d667334F060d733d";
  console.log("verifyIfAddressHasTokens");

  const infuraProvider = new ethers.providers.StaticJsonRpcProvider(
    networkLink + INFURA_ID
  );
  const tokenContract = new ethers.Contract(
    tokenAddress,
    IERC721.abi,
    infuraProvider
  );

  const tokenBalance = await tokenContract.balanceOf(address);

  console.log("tokenAddress", tokenAddress);
  console.log("user address", address);
  console.log("tokenBalance", tokenBalance.toString());

  const userHasTokens = tokenBalance && tokenBalance.gt(0);
  if (userHasTokens) {
    return true;
  } else {
    return false;
  }
}

module.exports = { createAuthToken, verifyAuthToken, verifyIfAddressHasTokens };
