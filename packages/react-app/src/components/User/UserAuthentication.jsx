import React from "react";
import { Space, Spin } from "antd";
import { gql, useQuery } from "@apollo/client";
import GraphqlSign from "../../GraphqlSign";
import DisplayUser from "./DisplayUser";

const GET_USER_INFO = gql`
  query GetUserInfo {
    user {
      address
      name
    }
  }
`;

function UserAuthentication({
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  injectedProvider,
  userProvider,
  address,
  mainnetProvider,
  blockExplorer,
}) {
  const { loading, data, error } = useQuery(GET_USER_INFO);

  if (loading) return <Spin />;

  return (
    <Space style={{ marginBottom: "2em" }}>
      {data ? (
        <DisplayUser mainnetProvider={mainnetProvider} blockExplorer={blockExplorer} user={data.user} />
      ) : (
        <GraphqlSign
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          injectedProvider={injectedProvider}
          userProvider={userProvider}
          address={address}
        />
      )}
    </Space>
  );
}

export default UserAuthentication;
