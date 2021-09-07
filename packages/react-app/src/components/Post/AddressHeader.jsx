import React from "react";
import { useLookupAddress } from "eth-hooks";

function AddressHeader({ ensProvider, address, name }) {
  const ensAddres = useLookupAddress(ensProvider, address);
  const resolvedAddress = ensAddres || address;

  return `  ${name} - ${resolvedAddress}  `;
}

export default AddressHeader;
