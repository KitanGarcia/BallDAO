import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenAddress = await sdk.deployer.deployToken({
      name: "BallDAO Governance Token",
      symbol: "BALL",
      // This will be in case we want to sell our token,
      // because we don't, we set it to AddressZero again.
      primary_sale_recipient: AddressZero,
    });
    console.log("Successfully deployed token contract, address:", tokenAddress);
  } catch (error) {
    console.error("failed to deploy token contract", error);
  }
})();
