const Token = artifacts.require('Token')
const CryptoSwap= artifacts.require('CryptoSwap')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('CryptoSwap', ([deployer, investor]) => {
  let token, cryptoSwap

  before(async () => {
    token = await Token.new()
    cryptoSwap = await CryptoSwap.new(token.address)
    // Transfer all tokens to CryptoSwap (1 million)
    await token.transfer(cryptoSwap.address, tokens('1000000'))
  })

  describe('Token deployment', async () => {
    it('contract has a name', async () => {
      const name = await token.name()
      assert.equal(name, 'DApp Token')
    })
  })

  describe('CryptoSwap deployment', async () => {
    it('contract has a name', async () => {
      const name = await cryptoSwap.name()
      assert.equal(name, 'CryptoSwap Instant Exchange')
    })

    it('contract has tokens', async () => {
      let balance = await token.balanceOf(cryptoSwap.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  describe('buyTokens()', async () => {
    let result

    before(async () => {
      // Purchase tokens before each example
      result = await cryptoSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether')})
    })

    it('Allows user to instantly purchase tokens from CryptoSwap for a fixed price', async () => {
      // Check investor token balance after purchase
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokens('100'))

      // Check CryptoSwap balance after purchase
      let CryptoSwapBalance
      CryptoSwapBalance = await token.balanceOf(cryptoSwap.address)
      assert.equal(CryptoSwapBalance.toString(), tokens('999900'))
      CryptoSwapBalance = await web3.eth.getBalance(cryptoSwap.address)
      assert.equal(CryptoSwapBalance.toString(), web3.utils.toWei('1', 'Ether'))

      // Check logs to ensure event was emitted with correct data
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')
    })
  })

  describe('sellTokens()', async () => {
    let result

    before(async () => {
      // Investor must approve tokens before the purchase
      await token.approve(cryptoSwap.address, tokens('100'), { from: investor })
      // Investor sells tokens
      result = await cryptoSwap.sellTokens(tokens('100'), { from: investor })
    })

    it('Allows user to instantly sell tokens to CryptoSwap for a fixed price', async () => {
      // Check investor token balance after purchase
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokens('0'))

      // Check CryptoSwap balance after purchase
      let CryptoSwapBalance
      CryptoSwapBalance = await token.balanceOf(cryptoSwap.address)
      assert.equal(CryptoSwapBalance.toString(), tokens('1000000'))
      CryptoSwapBalance = await web3.eth.getBalance(cryptoSwap.address)
      assert.equal(CryptoSwapBalance.toString(), web3.utils.toWei('0', 'Ether'))

      // Check logs to ensure event was emitted with correct data
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')

      // FAILURE: investor can't sell more tokens than they have
      await cryptoSwap.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
    })
  })

})
