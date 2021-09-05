import React from "react";

import { gql, useQuery } from "@apollo/client";
import { POST_HEADER_FRAGMENT } from "../fragments/PostFragments.graphql";
import CreateNewPost from "../components/Post/CreateNewPost";

const GET_POSTS_QUERY = gql`
  ${POST_HEADER_FRAGMENT}
  query PostsQuery {
    posts {
      ...PostHeaderFragment
    }
  }
`;

function PostsView() {
  const { loading, error, data } = useQuery(GET_POSTS_QUERY);

  console.log(data);
  if (loading) return <p>Loading ...</p>;

  if (error) return <p>Ops, something went wrong</p>;

  return (
    <section>
      <CreateNewPost />
      {data.posts.map(ama => {
        return <p>{JSON.stringify(ama, null, 4)}</p>;
      })}
    </section>
  );
}

export default PostsView;
