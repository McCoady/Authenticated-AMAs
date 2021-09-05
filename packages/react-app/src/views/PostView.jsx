import React from "react";

import { gql, useQuery, useMutation } from "@apollo/client";
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

// Use fragments to reuse query
const CREATE_NEW_COMMENT_MUTATION = gql`
  mutation AddCommentMutation($addCommentInput: CommentInput!) {
    addComment(commentInput: $addCommentInput) {
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

  const [createComment, { data: postData }] = useMutation(CREATE_NEW_COMMENT_MUTATION);

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
    </div>
  );
}

export default PostView;
