const { gql } = require("apollo-server");

const PostsSchema = gql`
  type Token {
    address: String!
    name: String
  }

  type User {
    address: String!
    name: String!
  }

  type Comment {
    id: ID!
    content: String!
    createdAt: String!
    creator: User!

    subcomments: [Comment!]!
  }

  type Post {
    id: ID!
    createdAt: String!
    title: String!
    expiration: String!
    creator: User!
    creatorAddress: String!
    requiredTokens: [Token!]!
    comments: [Comment!]!
  }

  type Query {
    posts: [Post!]!
    post(id: ID!): Post
  }

  # type Mutation{
  #   addComment()
  #   respondeComment()
  # }
`;

module.exports = PostsSchema;
