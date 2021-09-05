/* eslint-disable jsx-a11y/control-has-associated-label */
import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

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
  const { loading, error, data } = useQuery(GET_USER_INFO);

  const [changeName] = useMutation(CHANGE_ADDRESS_NAME, { refetchQueries: ["GetUserInfo"] });

  if (data) {
    console.log("userData", data);
    return (
      <section>
        <h1>{data.user.name}</h1>
        <button
          type="button"
          onClick={() => {
            changeName({
              variables: {
                newName: "NEwUsername22",
              },
            });
          }}
        >
          Change name
        </button>
      </section>
    );
  }

  return <h1>Not connected</h1>;
}

export default DisplayUser;
