# Authenticated-AMAs

## About

Authenticated AMAs offer a simple way for builders/creators to host AMAs with members of their community. 🔊

AMA hosts can specify the token required to take part in the AMA so they can be sure the participants are shareholders in the project. 👨‍👩‍👧‍👦

Participation requires only that users sign a message confirming their ethereum address, this way nobody has to pay gas to host or participate in an Authenticated AMA. 💸

Users can set a username on the site and ENS domains are also fully supported. 🎫

Authenticated AMAs are a great way to give back to your community and ensure that you are interacting with real community members. 🔎

Check out the site @ https://authenticated-ama.netlify.app/


## How it Works

AMA hosts create an AMA and specify the token required to participate. 

Users log into their web3 wallet & sign a message containing their public address.📧



If a user wishes to ask a question in one of the AMAs an Infura API call will check that their address has the required token, if yes, ask away! 👌

## Using the demo

Set your metamask network to Ropsten Test Network. 🔬 

Sign in and set your username. ✏

The demo stack has some preset AMAs to test out functionality.

Head to the ‘Mint Test Tokens’ tab on the app to mint some dummy ERC721 tokens on the Ropsten testnet to gain access to the test AMAs. 


## Setup

### 1. Make a clone of this repository
```
git clone https://github.com/McCoady/Authenticated-AMAs.git
```

### 2. Install Dependencies
```
yarn install
```

### 3. create a .env file including `DATABASE_URL` and `INFURA_ID`

### 4. Sync your prisma database
```

cd/packages/backend
npx prisma generate
npx prisma migrate reset
```

### 5. Prepare the ERC721/IERC721 Contract ABIs
```
yarn compile
```

### 6. Open a new terminal in the root directory and start your backend
```
yarn backend
```

### 7. Open another terminal and start your react app
```
yarn start
```


### 8. You base site should be ready for action


## Future Ideas/Improvements

Add more options for creators when making an AMA (edit AMA expiry date, edit quantity of tokens required, moderation functions, etc)

Integrate an ability for users to set profile pictures in the app to the image data of the users relevant ERC721 token.🎨

Add self-policing rules where participants in an AMA can vote to have posts removed/hidden. 👮‍♀️


## Techstack
* GraphQL
* Apollo
* Frontend
  * React
  * antd
  * scaffold-eth/sign-in-with-web3 template
* Backend
  * Prisma
  * Sqlite
