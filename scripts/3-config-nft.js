import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDrop = await sdk.getContract(
      "0xbD58bF8af420cD838E088189BC75a90b6311DaAE",
      "edition-drop"
    );
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
