import React from "react";
import { Card, Typography, List, Divider, Space } from "antd";
import { useHistory } from "react-router-dom";
import moment from "moment";
import Blockies from "react-blockies";
import { useLookupAddress } from "eth-hooks";
import AddressHeader from "./AddressHeader";

const { Paragraph, Text } = Typography;

export default function PostHeaderCard({ post, ensProvider }) {
  const history = useHistory();

  const {
    id,
    title,
    createdAt,
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
      <Paragraph strong>Created by:</Paragraph>
      <Paragraph>
        <Space>
          <Blockies seed={address.toLowerCase()} size={10} />
          <Divider type="vertical" />
          <AddressHeader name={name} address={address} ensProvider={ensProvider} />
          <Text disabled>{moment(Number(createdAt)).fromNow()}</Text>
        </Space>
      </Paragraph>

      {post.requiredTokens.length > 0 ? (
        <List
          header={<Text strong>Required Tokens</Text>}
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
      ) : (
        "No required tokens specified"
      )}
    </Card>
  );
}
