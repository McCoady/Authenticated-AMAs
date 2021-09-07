import React, { useState } from "react";
import Blockies from "react-blockies";

import { Comment, Form, Input, Button, Avatar, Spin } from "antd";

function CommentEditor({ onChange, onSubmit, submitting, text }) {
  const [content, setContent] = useState("");

  if (submitting) return <Spin />;

  return (
    <Comment
      avatar={
        <Blockies
          seed={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" alt="Han Solo" />}
          size={10}
        />
      }
      content={
        <>
          <Form.Item>
            <Input.TextArea
              rows={4}
              onChange={e => {
                setContent(e.target.value);
                if (onChange) onChange(e.target.value);
              }}
              value={content}
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              loading={submitting}
              onClick={() => {
                if (onSubmit) onSubmit(content);
              }}
              type="primary"
            >
              {text}
            </Button>
          </Form.Item>
        </>
      }
    />
  );
}

export default CommentEditor;
