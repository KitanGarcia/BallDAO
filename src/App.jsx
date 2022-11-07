import {
  useAddress,
  useNetwork,
  useContract,
  ConnectWallet,
  Web3Button,
  useNFTBalance,
} from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import { useState, useEffect, useMemo } from "react";
import { AddressZero } from "@ethersproject/constants";

const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  console.log("👋 Address:", address);

  // Initialize edition drop contract
  const editionDropAddress = "0x00C879218ad295CCfb8a8057547795bafCF4D621";
  const { contract: editionDrop } = useContract(
    editionDropAddress,
    "edition-drop"
  );

  // Check if user has our NFT (all with tokenId 0)
  const { data: nftBalance } = useNFTBalance(editionDrop, address, 0);

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0);
  }, [nftBalance]);

  // User hasn't connected their wallet
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to BallDAO</h1>
        <div className="btn-hero">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>DAO Member Page</h1>
        <p>Congratulations on being a member</p>
      </div>
    );
  }

  // We have the user's address and therefore know they connected wallet
  // Render mint NFT screen
  // Claim 1 nft with tokenId 0
  return (
    <div className="mint-nft">
      <h1>Mint your free DAO Membership NFT</h1>
      <div className="btn-hero">
        <Web3Button
          contractAddress={editionDropAddress}
          action={(contract) => {
            contract.erc1155.claim(0, 1);
          }}
          onSuccess={() => {
            console.log(
              `Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/mumbai/${editionDrop.getAddress()}/0`
            );
          }}
          onError={(error) => {
            console.error("Failed to mint NFT", error);
          }}
        >
          Mint your NFT (FREE)
        </Web3Button>
      </div>
    </div>
  );
};

export default App;
