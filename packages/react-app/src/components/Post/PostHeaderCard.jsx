import React from "react";
import { Card, Typography, List, Divider } from "antd";
import { useHistory } from "react-router-dom";

const { Paragraph } = Typography;

export default function PostHeaderCard({ post }) {
  const history = useHistory();

  const {
    id,
    title,
    creator: { name, address },
  } = post;

  return (
    <Card
      hoverable
      title={title}
      onClick={() => {
        history.push(`/post/${id}`);
      }}
      style={{ width: "100%" }}
    >
      <Paragraph secondary>{`${name} - ${address}`}</Paragraph>

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
    </Card>
  );
}
