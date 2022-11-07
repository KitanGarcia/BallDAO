import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // This is the address of our ERC-20 contract printed out in the step before.
    const token = await sdk.getContract(
      "0x36aE2b29340d7006Bf5F5509e7B46fbeFAec9535",
      "token"
    );
    // Set max supply to 1 million
    const amount = 1_000_000;
    // Interact with deployed ERC-20 contract and mint the tokens!
    await token.mint(amount);
    const totalSupply = await token.totalSupply();

    // Print out how many of our token are out there now!
    console.log(
      "There now are",
      totalSupply.displayValue,
      "$BALL in circulation"
    );
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();

