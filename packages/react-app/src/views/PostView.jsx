import React, { useState } from "react";
import { Comment, Tooltip, List, Typography, Form, Input, Button, Avatar } from "antd";
import Blockies from "react-blockies";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import CommentEditor from "../components/Post/CommentEditor";

import Container from "../components/Layout/Container";
import { COMPLETE_POST_FRAGMENT } from "../fragments/PostFragments.graphql";

const { Paragraph } = Typography;

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
  const [replyCommentId, setReplyCommentId] = useState(null);

  const [createComment, { loading: createCommentLoading }] = useMutation(CREATE_NEW_COMMENT_MUTATION);
  const [respondComment, { loading: respondCommentLoading }] = useMutation(RESPOND_COMMENT_MUTATION, {
    refetchQueries: ["FindPost"],
  });

  console.log(data);
  if (loading) return <p>Loading ...</p>;

  if (error) {
    console.log(error);
    return <p>Ops, something went wrong</p>;
  }

  const post = data.post;
  //  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" alt="Han Solo" />
  console.log("post", post);

  const createCommentsObj = commentsArray => {
    return commentsArray.map(({ id: commentId, content, creator, createdAt, subcomments }) => {
      return {
        subcomments: createCommentsObj(subcomments ?? []),
        id: commentId,
        actions: [
          <span
            onClick={() => {
              setReplyCommentId(commentId);
            }}
            key="comment-basic-reply-to"
          >
            Reply
          </span>,
        ],
        author: <a>{`${creator.name} - ${creator.address}`}</a>,
        avatar: <Blockies seed={creator.address.toLowerCase()} size={10} />,
        content: <p>{content}</p>,
        datetime: (<p>{`${new Date(createdAt * 1)}`}</p>

        ),
      };
    });
  };

  const comments = createCommentsObj(post.comments);

  return (
    <Container mt="2em">
      <Paragraph secondary>{`${post.creator.name} - ${post.creator.address}`}</Paragraph>

      <List
        header={<Paragraph strong>Required Tokens</Paragraph>}
        itemLayout="horizontal"
        dataSource={post.requiredTokens}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={<a href="//change to link to etherscan">{item.name}</a>}
              description={item.address}
            />
          </List.Item>
        )}
      />
      <List
        className="comment-list"
        style={{ textAlign: "left" }}
        header={`${comments.length} Questions`}
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={item => (
          <li>
            <Comment
              actions={item.actions}
              author={item.author}
              avatar={item.avatar}
              content={item.content}
              datetime={item.datetime}
            >
              {item.id === replyCommentId && (
                <CommentEditor
                  onSubmit={value => {
                    respondComment({
                      variables: {
                        respondCommentInput: { content: value, postId: id },
                        commentToRespond: replyCommentId,
                      },
                    }).then(() => setReplyCommentId(null));
                  }}
                  text="Reply"
                  submitting={respondCommentLoading}
                ></CommentEditor>
              )}
              {item.subcomments.map(subComment => {
                return (
                  <Comment
                    author={subComment.author}
                    avatar={subComment.avatar}
                    content={subComment.content}
                    datetime={subComment.datetime}
                  />
                );
              })}
            </Comment>
          </li>
        )}
      />
      <CommentEditor
        submitting={createCommentLoading}
        text="Add Question"
        onSubmit={value => {
          createComment({ variables: { addCommentInput: { content: value, postId: id } } });
        }}
      ></CommentEditor>
    </Container>
  );
}

export default PostView;
