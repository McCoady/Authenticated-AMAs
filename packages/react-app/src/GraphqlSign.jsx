import React from "react";
import { message as UiMessagePopUp, Button } from "antd";
import { gql, useLazyQuery, useMutation } from "@apollo/client";

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

function GraphqlSign({ injectedProvider, userProvider, address }) {
  const [verifySignedMessage, { data: result, loading: verifySignatureLoading }] = useMutation(VERIFY_SIGNED_MESSAGE, {
    onCompleted: data => {
      const authToken = data.verifySignedMessage.authToken;

      console.log("authToken", authToken);

      sessionStorage.setItem("authToken", authToken);
    },
  });

  const [getMessage, { loading: getMesageloading, refetch }] = useLazyQuery(GET_MESSAGE_QUERY, {
    onCompleted: async data => {
      // const message = msgToSign.data.replace("**ADDRESS**", address);
      const message = data.seedMessage.message;
      console.log("Message from graphql", message);

      // length 1 for testing
      if (message.length > 1) {
        const sig = await userProvider.send("personal_sign", [message, address]);
        verifySignedMessage({ variables: { verifySignedMessageSignedMessage: { address, message, signature: sig } } });
        console.log("signature graphql", sig);
      } else {
        UiMessagePopUp.error(" Sorry, the server is overloaded. 🧯🚒🔥");
      }
    },
    onError: () => {
      UiMessagePopUp.error(" Sorry, the server is overloaded. 🧯🚒🔥");
    },
  });

  if (result && result.verifySignedMessage.status) {
    return <div style={{ marginTop: 32 }}>{result.verifySignedMessage.details}</div>;
  }
  const isSigner = injectedProvider && injectedProvider.getSigner && injectedProvider.getSigner()._isSigner;

  if (isSigner) {
    return (
      <Button
        loading={getMesageloading || verifySignatureLoading}
        style={{ marginTop: 32 }}
        type="primary"
        onClick={() => {
          getMessage({ variables: { seedMessageAddress: address } });
        }}
      >
        <span style={{ marginRight: 8 }}>🔏</span> sign a message with your ethereum wallet graphql
      </Button>
    );
  }
  return null;
}

export default GraphqlSign;
