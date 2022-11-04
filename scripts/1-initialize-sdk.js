import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from "ethers";

// Importing and configuring our .env file
import dotenv from "dotenv";
dotenv.config();

// Checks to make sure .env is working
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
  console.log("Private key not found");
}

if (!process.env.QUICKNODE_API_URL || process.env.QUICKNODE_API_URL === "") {
  console.log("Quicknode API not found");
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
  console.log("Wallet address not found");
}

// Get RPC URL using Quicknode
const provider = new ethers.providers.JsonRpcProvider(
  process.env.QUICKNODE_API_URL
);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const sdk = new ThirdwebSDK(wallet);

// Make sure SDK initialized correctly
(async () => {
  try {
    const address = await sdk.getSigner().getAddress();
    console.log("SDK initialized by address: ", address);
  } catch (error) {
    console.error("Failed to get apps from the sdk", error);
    process.exit(1);
  }
})();

// Exporting the initialized thirdweb SDK to use in other scripts
export default sdk;
