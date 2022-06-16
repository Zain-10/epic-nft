// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 totalNFTs; 

    string svgPartOne = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    string svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
  
    string[] firstWords = ["Amazing", "Epic", "Crazy", "Terrible", "Bad", "Fantastic"];
    string[] secondWords = ["Pizza", "Biriyani", "Porotta", "Burger", "Chcken", "Shawarma"];
    string[] thirdWords = ["Messi", "Rohit", "Kohli", "Ronaldo", "Modi", "Pinarayi"];

    string[] colors = ["red", "#08C2A8", "black", "yellow", "blue", "green"];

    event NewEpicNFTMinted(address sender, uint256 tokenId);

    constructor() ERC721 ("SquareNFT", "SQUARE") {
        console.log("This is my NFT contract. Whoa!");
    }

    function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
        // I seed the random generator. More on this in the lesson. 
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        // Squash the # between 0 and the length of the array to avoid going out of bounds.
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
      uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
      rand = rand % secondWords.length;
      return secondWords[rand];
    }

    function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
      uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
      rand = rand % thirdWords.length;
      return thirdWords[rand];
    }

    function pickRandomColor(uint256 tokenId) public view returns (string memory) {
      uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
      rand = rand % colors.length;
      return colors[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(input)));
    }

    function makeAnEpicNFT() public {
     // Get the current tokenId, this starts at 0.
        require(totalNFTs <= 50, "Limit reached");
        uint256 newItemId = _tokenIds.current();

        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);
        string memory combinedWord = string(abi.encodePacked(first, second, third));
    
        string memory randomColor = pickRandomColor(newItemId);
        string memory finalSvg = string(abi.encodePacked(svgPartOne, randomColor, svgPartTwo, combinedWord, "</text></svg>"));

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        // We set the title of our NFT as the generated word.
                        combinedWord,
                        '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
                        // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n--------------------");
        console.log(finalTokenUri);
        console.log("--------------------\n");

     // Actually mint the NFT to the sender using msg.sender.
        _safeMint(msg.sender, newItemId);

    // Set the NFTs data.
        _setTokenURI(newItemId, finalTokenUri);
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

    // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();
        totalNFTs += 1;
        emit NewEpicNFTMinted(msg.sender, newItemId);
    }

    function getTotalNFTsMintedSoFar() public view returns (uint256) {
        return totalNFTs;
    }
}
