import React from "react";

import { gql, useMutation } from "@apollo/client";

import { POST_HEADER_FRAGMENT } from "../../fragments/PostFragments.graphql";

const CREATE_NEW_POST_MUTATION = gql`
  ${POST_HEADER_FRAGMENT}
  mutation CreatePostMutation($createPostInput: PostInput!) {
    createPost(postInput: $createPostInput) {
      ...PostHeaderFragment
    }
  }
`;

function CreateNewPost() {
  const [createPost] = useMutation(CREATE_NEW_POST_MUTATION);

  return (
    <button
      type="button"
      onClick={() => {
        createPost({
          variables: {
            createPostInput: {
              title: "new postfront-end " + Date.now(),
              requiredTokens: [
                { address: "token addres1", name: "tokenName 1" },
                { address: "token addres2", name: "tokenName 2" },
              ],
            },
          },
        });
      }}
    >
      Create new comment
    </button>
  );
}

export default CreateNewPost;
