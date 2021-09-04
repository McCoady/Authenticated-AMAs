import React from "react";

import { gql, useQuery } from "@apollo/client";

const GET_POSTS_QUERY = gql`
  query PostsQuery {
    posts {
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
  }
`;

function PostsView() {
  const { loading, error, data } = useQuery(GET_POSTS_QUERY);

  console.log(data);
  if (loading) return <p>Loading ...</p>;

  if (error) return <p>Ops, something went wrong</p>;

  return data.posts.map(ama => {
    return <p>{JSON.stringify(ama, null, 4)}</p>;
  });
}

export default PostsView;
