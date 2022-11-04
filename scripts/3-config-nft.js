import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = await sdk.getEditionDrop(
  "0x00C879218ad295CCfb8a8057547795bafCF4D621"
);

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "OG Streetball",
        description: "This NFT will give you access to BallDAO!",
        image: readFileSync("scripts/assets/streetball.png"),
      },
    ]);
    console.log("Successfully created a new NFT in the drop.");
  } catch (error) {
    console.log("Failed to create the new NFT ", error);
  }
})();
