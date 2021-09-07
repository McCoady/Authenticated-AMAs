import { gql } from "@apollo/client";

export const POST_HEADER_FRAGMENT = gql`
  fragment PostHeaderFragment on Post {
    id
    createdAt
    title
    creator {
      address
      name
    }
    expiration
    creatorAddress
    requiredTokens {
      address
      name
    }
  }
`;

export const COMPLETE_POST_FRAGMENT = gql`
  ${POST_HEADER_FRAGMENT}
  fragment CompletePostFragment on Post {
    ...PostHeaderFragment
    comments {
      id
      content
      createdAt
      creator {
        address
        name
      }
      subcomments {
        id
        content
        createdAt
        creator {
          address
          name
        }
      }
    }
  }
`;
