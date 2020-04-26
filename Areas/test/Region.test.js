const Hotspots = artifacts.require('./Hotspots.sol')

contract('Hotspots', (accounts) => {
  before(async () => {
    this.Hotspots = await Hotspots.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.Hotspots.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('Regions', async () => {
    const regionCount = await this.Hotspots.regionCount()
    const region = await this.Hotspots.regions(regionCount)
    assert.equal(region.id.toNumber(), regionCount.toNumber())
    assert.equal(region.content, 'BLOCK COVID')
    assert.equal(region.completed, false)
    assert.equal(regionCount.toNumber(), 1)
  })

  it('creates regions', async () => {
    const result = await this.Hotspots.createregion('A new region')
    const regionCount = await this.Hotspots.regionCount()
    assert.equal(regionCount, 2)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 2)
    assert.equal(event.content, 'A new region')
    assert.equal(event.completed, false)
  })

  it('toggles region completion', async () => {
    const result = await this.Hotspots.toggleCompleted(1)
    const region = await this.Hotspots.regions(1)
    assert.equal(region.completed, true)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 1)
    assert.equal(event.completed, true)
  })

})
