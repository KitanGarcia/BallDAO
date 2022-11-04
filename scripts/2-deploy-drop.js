import { AddressZero } from "@ethersproject/constants";
import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      // Name of NFT collection
      name: "BallDAO Membership",
      description:
        "A DAO for those infatuated with the art of megging and freestyle",
      image: readFileSync("scripts/assets/ball.png"),
      // The address of the person who will be receiving proceeds from sales in the contract
      // We use 0x0 here since we're not charging people for the drop
      primary_sale_recipient: AddressZero,
    });

    // Returns the address of our contract
    // Used to initialize the contract on thirdweb sdk
    const editionDrop = await sdk.getContract(editionDropAddress);
    const metadata = await editionDrop.metadata.get();

    console.log(
      "Successfully deployed edition contract, address: ",
      editionDropAddress
    );
    console.log("editionDrop metadata: ", metadata);
  } catch (error) {
    console.log("Failed to deploy editionDrop contract: ", error);
  }
})();
