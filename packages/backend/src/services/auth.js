var ethers = require("ethers");
const Prisma = require("../prisma");

const { createAuthToken, verifyAuthToken } = require("../authToken/authToken");

const messagesSent = {};

function seedMessage(parent, args, context, info) {
  const { address } = args;
  const currentDate = String(Date.now());
  const message = `I am ${address} and I would like to sign in to YourDapp, plz! This message was sent on ${currentDate}`;

  messagesSent[address] = message;
  return { message, date: currentDate };
}

async function verifySignedMessage(parent, args, context, info) {
  console.log("mutatiosn", args);
  const { message, signature, address } = args.signedMessage;
  let recovered = null;

  const messageSent = messagesSent[address];
  delete messagesSent[address];

  try {
    recovered = ethers.utils.verifyMessage(message, signature);
  } catch {
    return {
      status: false,
      details: "Sorry, You're not good boy :(",
    };
  }

  if (recovered === address && messageSent == message) {
    const jwt = await createAuthToken({ address: address });

    return {
      status: true,
      details: "You're a good boy :D",
      authToken: jwt,
    };
  } else {
    return {
      status: false,
      details: "Sorry, You're not good boy :(",
    };
  }
}

async function changeAddressName(parent, { name }, { authToken }, info) {
  const { address } = await verifyAuthToken(authToken);

  const user = await Prisma.user.update({
    where: { address },
    data: {
      name,
    },
  });

  return user;
}

async function user(parent, args, { authToken }, info) {
  const { address } = await verifyAuthToken(authToken);

  const user = await Prisma.user.findUnique({
    where: { address },
  });

  return user;
}

const AuthResolver = {
  Query: {
    seedMessage,
    user,
  },
  Mutation: {
    verifySignedMessage,
    changeAddressName,
  },
};

module.exports = AuthResolver;
