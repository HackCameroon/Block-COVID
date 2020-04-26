const Token = artifacts.require("Token");
const CryptoSwap = artifacts.require("CryptoSwap");

module.exports = async function(deployer) {

  await deployer.deploy(Token);
  const token = await Token.deployed()

  await deployer.deploy(CryptoSwap, token.address);
  const crypto = await CryptoSwap.deployed()

  // Transfer all tokens to CryptoSwap (1 million wei)
  await token.transfer(crypto.address, '1000000000000000000000000')
};
