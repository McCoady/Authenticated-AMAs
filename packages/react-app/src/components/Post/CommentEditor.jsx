import React, { useState } from "react";
import Blockies from "react-blockies";
import { useQuery } from "@apollo/client";
import { Comment, Form, Input, Button, Avatar, Spin } from "antd";
import { GET_USER_INFO } from "../User/UserAuthentication";

function CommentEditor({ onChange, onSubmit, submitting, text }) {
  const [content, setContent] = useState("");
  const { data: authenticated } = useQuery(GET_USER_INFO);

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
              disabled={!authenticated}
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
              disabled={!authenticated}
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
