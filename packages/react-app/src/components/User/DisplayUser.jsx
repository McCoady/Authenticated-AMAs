/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef } from "react";
import { gql, useMutation } from "@apollo/client";
import { Typography, Spin } from "antd";
import { HighlightOutlined } from "@ant-design/icons";
import Address from "../Address";

const { Title, Text } = Typography;

const GET_USER_INFO = gql`
  query GetUserInfo {
    user {
      address
      name
    }
  }
`;

const CHANGE_ADDRESS_NAME = gql`
  mutation ChangeAddressNameMutation($newName: String!) {
    changeAddressName(name: $newName) {
      address
      name
    }
  }
`;

function DisplayUser({ mainnetProvider, blockExplorer, user }) {
  const typedString = useRef("");

  const [changeName, { loading }] = useMutation(CHANGE_ADDRESS_NAME, { refetchQueries: ["GetUserInfo"] });

  if (loading) return <Spin />;

  if (user) {
    return (
      <section>
        <Title
          editable={{
            icon: <HighlightOutlined />,
            tooltip: "Edit your displayed name",
            onChange: value => {
              typedString.current = value;
            },
            onEnd: () => {
              if (typedString.current)
                changeName({
                  variables: {
                    newName: typedString.current,
                  },
                });
            },
          }}
        >
          {user.name}
        </Title>
        <Address
          address={user.address}
          ensProvider={mainnetProvider}
          blockExplorer={blockExplorer}
          size="long"
          fontSize={16}
        />
      </section>
    );
  }

  return null;
}

export default DisplayUser;
