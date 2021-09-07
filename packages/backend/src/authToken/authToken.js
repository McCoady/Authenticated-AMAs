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
const ERC721 = require("../../../hardhat/artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json");
const INFURA_ID = process.env.INFURA_ID;
const networkLink = "https://ropsten.infura.io/v3/";

function getProvider() {
  return new ethers.providers.StaticJsonRpcProvider(networkLink + INFURA_ID);
}

async function verifyIfAddressHasTokens({ address, tokensAddress }) {
  console.log("verifyIfAddressHasTokens");
  console.log(tokensAddress);

  const infuraProvider = getProvider();

  const tokensBalancePromises = tokensAddress.map(async (tokenAddress) => {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      IERC721.abi,
      infuraProvider
    );
    const tokenBalance = await tokenContract.balanceOf(address);

    console.log("tokenAddress", tokenAddress);
    console.log("user address", address);
    console.log("tokenBalance", tokenBalance.toString());

    return tokenBalance;
  });

  const tokensBalance = await Promise.all(tokensBalancePromises);

  console.log("tokensBalance", tokensBalance);

  const userHasTokens = tokensBalance.reduce((hasAllTokens, tokenBalance) => {
    const userHasToken = tokenBalance && tokenBalance.gt(0);
    return hasAllTokens && userHasToken;
  }, true);

  console.log("userHasToken", userHasTokens);

  return userHasTokens;
}

async function getTokenName(address) {
  const infuraProvider = getProvider();

  const tokenContract = new ethers.Contract(
    address,
    ERC721.abi,
    infuraProvider
  );
  try {
    const name = await tokenContract.name();
    return name;
  } catch {
    return "Unknown Name";
  }
}

module.exports = {
  createAuthToken,
  verifyAuthToken,
  verifyIfAddressHasTokens,
  getTokenName,
};
