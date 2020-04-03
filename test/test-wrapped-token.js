var Saturn = artifacts.require("./SATURN223.sol")
var Other223 = artifacts.require("./ERC223Token.sol")
var Saturn20 = artifacts.require("./ERC20Wrapper.sol")

function assertJump(error) {
  let revertOrInvalid = error.message.search('invalid opcode|revert')
  assert.isAbove(revertOrInvalid, -1, 'Invalid opcode error must be returned')
}

contract('Wrapped ERC223 -> ERC20 Token', function(accounts) {
  it("Is initialized with 0 balance", async () => {
    const saturn20 = await Saturn20.deployed()
    const saturn = await Saturn.deployed()

    let balance = await saturn20.totalSupply()
    let name = await saturn20.name()
    let symbol = await saturn20.symbol()

    let decimals20 = await saturn20.decimals()
    let decimals223 = await saturn20.decimals()

    // these come from constructor
    assert.equal(name, "Wrapped Saturn")
    assert.equal(symbol, "SATURN20")

    assert(decimals20.eq(decimals223))
    assert.equal(balance.toString(), '0')
  })

  it("Rejects unwanted erc223 and eth", async () => {
    const saturn20 = await Saturn20.deployed()
    const token = await Other223.deployed()

    try {
      await token.transfer(saturn20.address, 1000)
      assert.fail('Could not reject unwanted erc223')
    } catch(error) {
      assertJump(error)
    }

    try {
      await web3.eth.sendTransaction({
        from: accounts[0],
        to: saturn20.address,
        value: web3.utils.toWei('1', 'ether')
      })
      assert.fail('Could not reject unwanted eth')
    } catch(error) {
      assertJump(error)
    }
  })

  it("Can mint new saturn20 tokens", async () => {
    const saturn20 = await Saturn20.deployed()
    const saturn = await Saturn.deployed()

    const account = accounts[0]
    let amount = 100

    let supplybefore = await saturn20.totalSupply()
    let erc20balancebefore = await saturn20.balanceOf(account)
    let erc223balancebefore = await saturn.balanceOf(account)

    await saturn.transfer(saturn20.address, amount)

    let supplyafter = await saturn20.totalSupply()
    let erc20balanceafter = await saturn20.balanceOf(account)
    let erc223balanceafter = await saturn.balanceOf(account)

    assert.equal(supplyafter.sub(supplybefore).toString(), amount.toString())
    assert.equal(erc20balanceafter.sub(erc20balancebefore).toString(), amount.toString())
    assert.equal(erc223balancebefore.sub(erc223balanceafter).toString(), amount.toString())
  })

  it("Can burn saturn20 tokens", async () => {
    const saturn20 = await Saturn20.deployed()
    const saturn = await Saturn.deployed()

    const account = accounts[0]
    let amount = 100

    let supplybefore = await saturn20.totalSupply()
    let erc20balancebefore = await saturn20.balanceOf(account)
    let erc223balancebefore = await saturn.balanceOf(account)

    try {
      await saturn20.burn(amount + 1)
      assert.fail('Could not prevent burning more than you have')
    } catch(error) {
      assertJump(error)
    }
    await saturn20.burn(amount)

    let supplyafter = await saturn20.totalSupply()
    let erc20balanceafter = await saturn20.balanceOf(account)
    let erc223balanceafter = await saturn.balanceOf(account)

    assert.equal(supplybefore.sub(supplyafter).toString(), amount.toString())
    assert.equal(erc20balancebefore.sub(erc20balanceafter).toString(), amount.toString())
    assert.equal(erc223balanceafter.sub(erc223balancebefore).toString(), amount.toString())
  })

  it("Does all ERC20 allow approve stuff", async () => {
    const saturn20 = await Saturn20.deployed()
    const saturn = await Saturn.deployed()

    const account = accounts[0]
    const manager = accounts[1]
    const store = accounts[2]
    let amount = 100

    await saturn.transfer(saturn20.address, amount, {from: account})

    let managerallowancebefore = await saturn20.allowance(account, manager)
    assert.equal(managerallowancebefore.toString(), '0')

    await saturn20.approve(manager, amount, {from: account})

    let managerallowanceduring1 = await saturn20.allowance(account, manager)
    assert.equal(managerallowanceduring1.toString(), amount.toString())

    try {
      await saturn20.burnFrom(account, amount + 1, {from: manager})
      assert.fail('Could not prevent burning more than you have')
    } catch(error) {
      assertJump(error)
    }

    try {
      await saturn20.transferFrom(account, store, amount + 1, {from: manager})
      assert.fail('Could not prevent burning more than you have')
    } catch(error) {
      assertJump(error)
    }

    await saturn20.transferFrom(account, store, amount/2, {from: manager})
    let managerallowanceduring2 = await saturn20.allowance(account, manager)
    assert.equal(managerallowanceduring2.toString(), (amount/2).toString())
    await saturn20.burnFrom(account, amount/2, {from: manager})

    let managerallowanceafter = await saturn20.allowance(account, manager)
    assert.equal(managerallowancebefore.toString(), '0')

    let erc20accountafter = await saturn20.balanceOf(account)
    let erc20storeafter = await saturn20.balanceOf(store)

    assert.equal(erc20accountafter.toString(), '0')
    assert.equal(erc20storeafter.toString(), (amount/2).toString())

    try {
      await saturn20.transfer(account, amount, {from: store})
      assert.fail('Could not prevent transfering more than you have')
    } catch(error) {
      assertJump(error)
    }
    await saturn20.transfer(account, amount/2, {from: store})
    await saturn20.burn(amount/2, {from: account})
  })

})
