/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Spin, Typography } from "antd";
import { HighlightOutlined } from "@ant-design/icons";

const { Title } = Typography;

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

function DisplayUser() {
  const typedString = useRef("");
  const { loading, data, error } = useQuery(GET_USER_INFO);
  const [changeName] = useMutation(CHANGE_ADDRESS_NAME, { refetchQueries: ["GetUserInfo"] });

  if (loading) return <Spin />;

  if (data) {
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
          {data.user.name}
        </Title>
      </section>
    );
  }

  return <Title level={3}>Not connected</Title>;
}

export default DisplayUser;
