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
import { Alchemy, Network } from "alchemy-sdk";
import { constants } from "ethers";

const alchemySettings = {
  apiKey: process.env.REACT_APP_ALCHEMY_KEY,
  network: Network.MATIC_MUMBAI,
};

const alchemy = new Alchemy(alchemySettings);

const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  console.log("👋 Address:", address);
  const network = useNetwork();
  console.log("👋 Network:", network);

  // Initialize our Edition Drop contract
  const editionDropAddress = "0xbD58bF8af420cD838E088189BC75a90b6311DaAE";
  const { contract: editionDrop } = useContract(
    editionDropAddress,
    "edition-drop"
  );
  const { contract: token } = useContract(
    "0x660893BFE642eE6C429EBe44873e2680c7AE2489",
    "token"
  );
  console.log("EDITION DROP", editionDrop);

  console.log("TOKEN", token);

  // Hook to check if the user has our NFT
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0");
  console.log("nftBalance", nftBalance);

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0);
  }, [nftBalance]);

  // Holds the amount of token each member has
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Get users who hold our NFT with tokenId 0
    const getAllAddresses = async () => {
      console.log("GET ALL ADDRESSES");
      console.log("GET ALL ADDRESSES");
      let addresses = [];
      try {
        const tokenId = "0";
        addresses = await editionDrop?.history.getAllClaimerAddresses(0);
        /*
        addresses = (
          await alchemy.nft.getOwnersForNft(editionDrop, tokenId)
        ).owners.filter((addr) => addr !== constants.AddressZero);
        */
        setMemberAddresses(addresses);
        console.log("Member addresses", addresses);
      } catch (error) {
        console.error("Failed to get member list", error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop?.history, editionDrop]);

  // Gets the number of tokens each member holds
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token?.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("Amounts", amounts);
      } catch (error) {
        console.error("Failed to get member balances", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token?.history]);

  // Combine memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // Check if we find the address in the memberTokenAmounts array
      // If so, return the amount of token the user has.
      // Else, return 0
      const member = memberTokenAmounts?.find(
        ({ holder }) => holder === address
      );
      return { address, tokenAmount: member?.balance.displayValue || "0" };
    });
  }, [memberAddresses, memberTokenAmounts]);

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
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

  // Add this little piece!
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🍪DAO Member Page</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint your free 🍪DAO Membership NFT</h1>
      <div className="btn-hero">
        <Web3Button
          contractAddress={editionDropAddress}
          action={(contract) => {
            contract.erc1155.claim(0, 1);
          }}
          onSuccess={() => {
            console.log(
              `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`
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
