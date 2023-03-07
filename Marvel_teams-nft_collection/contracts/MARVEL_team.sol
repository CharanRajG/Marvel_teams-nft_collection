// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// We need to import the helper functions from the contract that we copy/pasted.
import { Base64 } from "./libraries/Base64.sol";

contract MARVEL_team is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  uint public totalmints = 100;

  struct  idinfo{
    uint id;
    address minter;
    string uri;
  }

  mapping (uint => idinfo) public idtoinfo;
  // We split the SVG at the part where it asks for the background color.
  string svgPartOne = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 450 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
  string svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

  string[] firstWords = ["CAPTAINAMERICA ", "THOR ", "IRONMAN ", "HULK ", "BLACKPANTHER ", "THANOS ","STARLORD ","PUNISHER ","CAPTAINMARVEL "];
  string[] secondWords = ["WITCH ", "NATASHA ", "ANTMAN ", "SPIDERMAN ", "GOBLIN " , "LOKI ","Dr.STRANGE ","VISION "];
  string[] thirdWords = ["ULTRON ", "HAWKEYE ", "BUCKY ", "SHANGCHI ", "DEADPOOL ", "WOLVERINE ","GROOT ","DAREDEVIL "];

    // Get fancy with it! Declare a bunch of colors.
  string[] colors = ["red", "#08C2A8", "black", "yellow", "blue", "green"];
  
  event NewEpicNFTMinted(address sender, uint256 tokenId);
  constructor() ERC721 ("Marvel_teams", "MRVL") {
    console.log("This is my NFT contract!");
  }


  function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
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
  
  // Same old stuff, pick a random color.
  function pickRandomColor(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
    rand = rand % colors.length;
    return colors[rand];
  }

  function random(string memory input) internal pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(input)));
  }

  function makeAnEpicNFT() public {
    uint256 newItemId = _tokenIds.current();
    require(newItemId < totalmints,"total limit of mints surpassed");

    string memory first = pickRandomFirstWord(newItemId);
    string memory second = pickRandomSecondWord(newItemId);
    string memory third = pickRandomThirdWord(newItemId);
    string memory combinedWord = string(abi.encodePacked(first, second, third));

    // Add the random color in.
    string memory randomColor = pickRandomColor(newItemId);
    string memory finalSvg = string(abi.encodePacked(svgPartOne, randomColor, svgPartTwo, combinedWord, "</text></svg>"));

    // Get all the JSON metadata in place and base64 encode it.
    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    // We set the title of our NFT as the generated word.
                    combinedWord,
                    '", "description": "A marvel team to save you vs other teams. Best team will have high listing price.", "image": "data:image/svg+xml;base64,',
                    // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                    Base64.encode(bytes(finalSvg)),
                    '"}'
                )
            )
        )
    );
    
    // Just like before, we prepend data:application/json;base64, to our data.
    string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

    console.log("\n--------------------");
    console.log(finalTokenUri);
    console.log("--------------------\n");

    _safeMint(msg.sender, newItemId);
    
    // Update your URI!!!
    _setTokenURI(newItemId, finalTokenUri);
     
    idtoinfo[newItemId] = idinfo(newItemId,msg.sender,finalTokenUri) ;

    _tokenIds.increment();
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
    emit NewEpicNFTMinted(msg.sender, newItemId);
  }

  function nftsownedby() public view returns(idinfo[] memory) {
    uint currentmints = _tokenIds.current();
    idinfo[] memory arr_idinfo = new idinfo[](currentmints);

    for (uint i = 0; i < currentmints; i++) {
      if(idtoinfo[i].minter == msg.sender){
        arr_idinfo[i] = idtoinfo[i] ;
      }
      
      
    }
    return arr_idinfo ; 
  }

}

