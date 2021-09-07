import React from "react";
import { message as UiMessagePopUp, Button } from "antd";
import { gql, useLazyQuery, useMutation, useApolloClient } from "@apollo/client";

const GET_MESSAGE_QUERY = gql`
  query getSeedMessage($seedMessageAddress: String!) {
    seedMessage(address: $seedMessageAddress) {
      message
      date
    }
  }
`;

const VERIFY_SIGNED_MESSAGE = gql`
  mutation Mutation($verifySignedMessageSignedMessage: SignedMessage!) {
    verifySignedMessage(signedMessage: $verifySignedMessageSignedMessage) {
      status
      details
      authToken
    }
  }
`;

function GraphqlSign({ injectedProvider, userProvider, address, web3Modal, loadWeb3Modal, logoutOfWeb3Modal }) {
  const client = useApolloClient();
  const [verifySignedMessage, { data: result, loading: verifySignatureLoading }] = useMutation(VERIFY_SIGNED_MESSAGE, {
    onCompleted: data => {
      const authToken = data.verifySignedMessage.authToken;
      sessionStorage.setItem("authToken", authToken);

      client.refetchQueries({
        include: ["GetUserInfo"],
      });
    },
  });

  const [getMessage, { loading: getMesageloading, refetch }] = useLazyQuery(GET_MESSAGE_QUERY, {
    onCompleted: async data => {
      const message = data.seedMessage.message;

      const sig = await userProvider.send("personal_sign", [message, address]);
      verifySignedMessage({ variables: { verifySignedMessageSignedMessage: { address, message, signature: sig } } });
    },
    onError: () => {
      UiMessagePopUp.error(" Sorry, the server is overloaded. 🧯🚒🔥");
    },
  });

  if (result && result.verifySignedMessage.status) {
    return null;
  }

  if (web3Modal && !web3Modal.cachedProvider) {
    return (
      <Button
        style={{ marginTop: 32 }}
        type="primary"
        onClick={() => {
          loadWeb3Modal();
        }}
      >
        <span style={{ marginRight: 8 }}>🔏</span>Connect your wallet please
      </Button>
    );
  }

  const isSigner = injectedProvider && injectedProvider.getSigner && injectedProvider.getSigner()._isSigner;

  if (isSigner)
    return (
      <Button
        loading={getMesageloading || verifySignatureLoading}
        style={{ marginTop: 32 }}
        type="primary"
        onClick={() => {
          getMessage({ variables: { seedMessageAddress: address } });
        }}
      >
        <span style={{ marginRight: 8 }}>🔏</span>Sign a message with your ethereum wallet
      </Button>
    );

  return null;
}

export default GraphqlSign;
