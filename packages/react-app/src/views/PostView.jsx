import React from "react";

import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { COMPLETE_POST_FRAGMENT } from "../fragments/PostFragments.graphql";

const GET_POST_QUERY = gql`
  ${COMPLETE_POST_FRAGMENT}
  query FindPost($postId: ID!) {
    post(id: $postId) {
      ...CompletePostFragment
    }
  }
`;

const CREATE_NEW_COMMENT_MUTATION = gql`
  ${COMPLETE_POST_FRAGMENT}
  mutation AddCommentMutation($addCommentInput: CommentInput!) {
    addComment(commentInput: $addCommentInput) {
      ...CompletePostFragment
    }
  }
`;

const RESPOND_COMMENT_MUTATION = gql`
  ${COMPLETE_POST_FRAGMENT}
  mutation RespondCommentMutation($respondCommentInput: CommentInput!, $commentToRespond: ID!) {
    respondComment(commentInput: $respondCommentInput, respondingTo: $commentToRespond) {
      ...CompletePostFragment
    }
  }
`;

function PostView() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_POST_QUERY, { variables: { postId: id } });

  const [createComment] = useMutation(CREATE_NEW_COMMENT_MUTATION);
  const [respondComment] = useMutation(RESPOND_COMMENT_MUTATION);

  console.log(data);
  if (loading) return <p>Loading ...</p>;

  if (error) {
    console.log(error);
    return <p>Ops, something went wrong</p>;
  }

  return (
    <div>
      <p>{JSON.stringify(data.post, null, 4)}</p>
      <button
        type="button"
        onClick={() => {
          createComment({ variables: { addCommentInput: { content: "new comment from front-end", postId: id } } });
        }}
      >
        Create new comment
      </button>

      <button
        type="button"
        onClick={() => {
          respondComment({
            variables: {
              respondCommentInput: { content: "new response from front-end", postId: id },
              commentToRespond: "5",
            },
          });
        }}
      >
        Respond comment
      </button>
    </div>
  );
}

export default PostView;
