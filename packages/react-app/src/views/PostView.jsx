import React from "react";

import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

const GET_POST_QUERY = gql`
  query FindPost($postId: ID!) {
    post(id: $postId) {
      id
      createdAt
      title
      expiration
      creator {
        address
        name
      }
      creatorAddress
      requiredTokens {
        address
        name
      }
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
  }
`;

function PostView() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_POST_QUERY, { variables: { postId: id } });

  console.log(data);
  if (loading) return <p>Loading ...</p>;

  if (error) {
    console.log(error);
    return <p>Ops, something went wrong</p>;
  }

  return <p>{JSON.stringify(data.post, null, 4)}</p>;
}

export default PostView;
