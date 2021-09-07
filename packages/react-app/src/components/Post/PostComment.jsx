import React, { useState } from "react";
import { Comment } from "antd";
import CommentEditor from "./CommentEditor";

function PostComment({ item, postId, replyCommentId }) {
  return (
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
                respondCommentInput: { content: value, postId },
                commentToRespond: replyCommentId,
              },
            }).then(() => setReplyCommentId(null));
          }}
          text="Reply"
          submitting={respondCommentLoading}
        />
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
  );
}

export default PostComment;
