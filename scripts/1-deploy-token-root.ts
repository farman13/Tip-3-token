import { Address, getRandomNonce, toNano, zeroAddress } from "locklift"
import BigNumber from "bignumber.js"

async function main() {

  const signer = (await locklift.keystore.getSigner("0"))!

  const initialSupplyTo = new Address("0:7c4db728ec21c6719b83997a6c84c889780d6e7fdfb57bdbcda42fc2186a1ea0")

  const rootOwner = new Address("0:7c4db728ec21c6719b83997a6c84c889780d6e7fdfb57bdbcda42fc2186a1ea0")

  const name = "Goku Token"

  const symbol = "GT"

  const initialSupply = 0

  const decimals = 18

  const disableMint = false

  const disableBurnByRoot = false

  const pauseBurn = false

  const TokenWallet = locklift.factory.getContractArtifacts("TokenWallet")


  const { contract: tokenRoot } = await locklift.factory.deployContract({
    contract: "TokenRoot",
    publicKey: signer.publicKey,
    initParams: {
      deployer_: zeroAddress, // this field should be zero address if deploying with public key (see source code)
      randomNonce_: getRandomNonce(),
      rootOwner_: rootOwner,
      name_: name,
      symbol_: symbol,
      decimals_: decimals,
      walletCode_: TokenWallet.code,
    },
    constructorParams: {
      initialSupplyTo: initialSupplyTo,
      initialSupply: new BigNumber(initialSupply).shiftedBy(decimals).toFixed(),
      deployWalletValue: toNano(0.5),
      mintDisabled: disableMint,
      burnByRootDisabled: disableBurnByRoot,
      burnPaused: pauseBurn,
      remainingGasTo: zeroAddress,
    },
    value: toNano(2.8),
  });

  console.log(`${name}: ${tokenRoot.address}`)
  console.log(`Token deployed at: ${tokenRoot.address.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
