const { gql } = require("apollo-server");

const AuthSchema = gql`
  type SeedMessage {
    message: String!
    date: String!
  }

  type Query {
    seedMessage(address: String!): SeedMessage
    user: User
  }

  type SignedMessageStatus {
    status: Boolean!
    details: String
    authToken: String
  }

  input SignedMessage {
    message: String!
    signature: String!
    address: String!
  }

  type Mutation {
    verifySignedMessage(signedMessage: SignedMessage!): SignedMessageStatus
    changeAddressName(name: String!): User
  }
`;

module.exports = AuthSchema;
