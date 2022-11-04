import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

(async () => {
  try {
    const editionDrop = await sdk.getContract(
      "0x00C879218ad295CCfb8a8057547795bafCF4D621",
      "edition-drop"
    );
    // We define our claim conditions, this is an array of objects because
    // we can have multiple phases starting at different times if we want to
    const claimConditions = [
      {
        // When people are gonna be able to start claiming the NFTs (now)
        startTime: new Date(),
        // The maximum number of NFTs that can be claimed.
        maxClaimable: 50_000,
        // The price of our NFT (free)
        price: 0,
        // The amount of NFTs people can claim in one transaction.
        maxClaimablePerWallet: 1,
        // We set the wait between transactions to unlimited, which means
        // people are only allowed to claim once.
        waitInSeconds: MaxUint256,
      },
    ];

    // Interacts with our deployed contract on-chain
    // 0 is the tokenId. Here all the NFTs are the same, so will have the same tokenId
    await editionDrop.claimConditions.set("0", claimConditions);
    console.log("Sucessfully set claim condition!");
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})();

