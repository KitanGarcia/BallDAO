import sdk from "./1-initialize-sdk.js";
import { Alchemy, Network } from "alchemy-sdk";
import { constants } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const alchemySettings = {
  apiKey: process.env.ALCHEMY_KEY,
  network: Network.MATIC_MUMBAI,
};

const alchemy = new Alchemy(alchemySettings);
const erc = "erc1155";
const contractAddress = "0xbD58bF8af420cD838E088189BC75a90b6311DaAE"; // ERC1155 membership NFT contract
const tokenId = "0";

const getAddresses = async (erc) => {
  let addresses = [];
  if (erc === "erc1155") {
    addresses = (
      await alchemy.nft.getOwnersForNft(contractAddress, tokenId)
    ).owners.filter((addr) => addr !== constants.AddressZero);
  } else if (erc === "erc721") {
    addresses = (
      await alchemy.nft.getOwnersForContract(contractAddress)
    ).owners.filter((addr) => addr !== constants.AddressZero);
  }
  return addresses;
};

(async () => {
  try {
    // This is the address to our ERC-1155 membership NFT contract.
    const editionDrop = await sdk.getContract(
      "0xbD58bF8af420cD838E088189BC75a90b6311DaAE",
      "edition-drop"
    );

    // This is the address to our ERC-20 token contract.
    const token = await sdk.getContract(
      "0x660893BFE642eE6C429EBe44873e2680c7AE2489",
      "token"
    );

    // Grab all the addresses of people who own our membership NFT, which has
    // a tokenId of 0.
    const walletAddresses = await getAddresses(erc);
    console.log("Addresses", walletAddresses);
    /*
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);
    console.log("ADDRESSES", walletAddresses);
    */

    if (walletAddresses.length === 0) {
      console.log(
        "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!"
      );
      process.exit(0);
    }

    // Loop through the array of addresses.
    const airdropTargets = walletAddresses.map((address) => {
      console.log("ADDRESS", address);
      // Pick a random # between 1000 and 10000.
      const randomAmount = Math.floor(
        Math.random() * (10000 - 1000 + 1) + 1000
      );
      console.log("✅ Going to airdrop", randomAmount, "tokens to", address);

      // Set up the target.
      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };

      return airdropTarget;
    });

    console.log("TARGET", airdropTargets);

    // Call transferBatch on all our airdrop targets.
    console.log("🌈 Starting airdrop...");
    await token.transferBatch(airdropTargets);
    console.log(
      "✅ Successfully airdropped tokens to all the holders of the NFT!"
    );
  } catch (err) {
    console.error("Failed to airdrop tokens", err);
  }
})();
