/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Form, Input, Button, Spin, Collapse } from "antd";
import { gql, useMutation, useQuery } from "@apollo/client";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { POST_HEADER_FRAGMENT } from "../../fragments/PostFragments.graphql";

import { GET_USER_INFO } from "../User/UserAuthentication";

const { Panel } = Collapse;

const CREATE_NEW_POST_MUTATION = gql`
  ${POST_HEADER_FRAGMENT}
  mutation CreatePostMutation($createPostInput: PostInput!) {
    createPost(postInput: $createPostInput) {
      ...PostHeaderFragment
    }
  }
`;

function CreateNewPost() {
  const [createPost, { loading, error }] = useMutation(CREATE_NEW_POST_MUTATION, { refetchQueries: ["PostsQuery"] });
  const { data: authenticated } = useQuery(GET_USER_INFO);

  if (loading) return <Spin />;
  if (error) return <h1>Sorry something went wrong</h1>;

  const onFinish = values => {
    const requiredTokens = values.requiredTokens ? values.requiredTokens.map(address => ({ address })) : [];
    createPost({
      variables: {
        createPostInput: {
          title: values.title,
          requiredTokens,
        },
      },
    });
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Collapse collapsible={authenticated ? undefined : "disabled"} style={{ marginTop: "2.5em" }}>
      <Panel
        header={
          <Button disabled={!authenticated} type="dashed">
            Create new AMA
          </Button>
        }
        key="1"
        showArrow={false}
      >
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelAlign="left"
          layout="vertical"
        >
          <Form.Item label="AMA Title" name="title" rules={[{ required: true, message: "Your post need a title!" }]}>
            <Input placeholder="My awesome AMA" />
          </Form.Item>

          <Form.List name="requiredTokens">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item label={index === 0 ? "Required Tokens" : ""} required={false} key={field.key}>
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please input address or remove this field",
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder="Token address" />
                    </Form.Item>

                    <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(field.name)} />
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Required Token
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create AMA
            </Button>
          </Form.Item>
        </Form>
      </Panel>
    </Collapse>
  );
}

export default CreateNewPost;
