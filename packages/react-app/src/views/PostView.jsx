import React from "react";
import { Comment, Tooltip, List, Typography } from "antd";
import Blockies from "react-blockies";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";

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

  const [createComment] = useMutation(CREATE_NEW_COMMENT_MUTATION);
  const [respondComment] = useMutation(RESPOND_COMMENT_MUTATION);

  console.log(data);
  if (loading) return <p>Loading ...</p>;

  if (error) {
    console.log(error);
    return <p>Ops, something went wrong</p>;
  }

  const post = data.post;
  //  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" alt="Han Solo" />
  console.log("post", post);
  // const comments = post.comments.map(({ id: commentId, content, creator }) => {
  //   return (
  //     <Container key={"#Comment" + commentId}>
  //       <Comment
  //         actions={[<span key="comment-basic-reply-to">Reply to</span>]}
  //         author={<a>{`${creator.name} - ${creator.address}`}</a>}
  //         avatar={<Blockies seed={creator.address.toLowerCase()} size={10} />}
  //         content={<p>{content}</p>}
  //         datetime={
  //           <Tooltip title="date/102/21">
  //             <span>date/102/21</span>
  //           </Tooltip>
  //         }
  //       />
  //     </Container>
  //   );
  // });
  const comments = post.comments.map(({ content, creator }) => {
    return {
      actions: [<span key="comment-basic-reply-to">Reply to</span>],
      author: <a>{`${creator.name} - ${creator.address}`}</a>,
      avatar: <Blockies seed={creator.address.toLowerCase()} size={10} />,
      content: <p>{content}</p>,
      datetime: (
        <Tooltip title="date/102/21">
          <span>date/102/21</span>
        </Tooltip>
      ),
    };
  });

  return (
    <Container mt="2em">
      <Paragraph secondary>{`${post.creator.name} - ${post.creator.name}`}</Paragraph>

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
        header={`${comments.length} replies`}
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
            />
          </li>
        )}
      />

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
    </Container>
  );
}

export default PostView;
