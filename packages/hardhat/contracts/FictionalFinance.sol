// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FictionalFinance is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("FictionalFinance", "FFIN") {}

    function mintToken() public returns (uint256) {
        require(balanceOf(msg.sender) == 0);

        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _mint(msg.sender, id);

        return id;
    }
}
