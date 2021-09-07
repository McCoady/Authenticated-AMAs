import React from "react";
import { Divider, Skeleton } from "antd";
import { gql, useQuery } from "@apollo/client";
import Container from "../components/Layout/Container";

import { POST_HEADER_FRAGMENT } from "../fragments/PostFragments.graphql";
import CreateNewPost from "../components/Post/CreateNewPost";
import PostHeaderCard from "../components/Post/PostHeaderCard";

const GET_POSTS_QUERY = gql`
  ${POST_HEADER_FRAGMENT}
  query PostsQuery {
    posts {
      ...PostHeaderFragment
    }
  }
`;

function PostsView({ ensProvider }) {
  const { loading, error, data } = useQuery(GET_POSTS_QUERY);

  console.log(data);
  if (loading)
    return (
      <Container>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Container>
    );

  if (error) return <p>Ops, something went wrong</p>;

  return (
    <section style={{ width: "100%" }}>
      <Container>
        <CreateNewPost />
      </Container>

      {data.posts.map(ama => {
        return (
          <Container>
            <Divider />
            <PostHeaderCard ensProvider={ensProvider} post={ama} key={"POST#" + ama.id} />
          </Container>
        );
      })}
    </section>
  );
}

export default PostsView;
