import { Big } from 'big.js'

Number.prototype.noExponents = function () {
  var data = String(this).split(/[eE]/)
  if (data.length === 1) return data[0]

  var z = "", sign = this < 0 ? "-" : "",
    str = data[0].replace(".", ""),
    mag = Number(data[1]) + 1

  if (mag < 0) {
    z = sign + "0."
    while (mag++) z += "0"
    return z + str.replace(/^\-/, "")
  }

  mag -= str.length
  while (mag--) z += "0"
  return str + z
}

export function getBlockNumber(web3) {
  return new Promise(resolve => {
    web3.eth.getBlockNumber((error, blockNumber) => {
      resolve(blockNumber)
    })
  })
}

export function getNetworkId(web3) {
  return new Promise((resolve, reject) => {
    resolve(web3.version.network.toString())
  })
}

export function getTimestamp(web3) {
  return new Promise(async resolve => {
    let blockNumber = await getBlockNumber(web3)
    web3.eth.getBlock(blockNumber, function(error, result) {
      resolve(result.timestamp)
    })
  })
}

export function getAccount(web3) {
  return new Promise(async resolve => {
    web3.eth.getAccounts(function (error, accounts) {
      resolve(accounts[0])
    })
  })
}

export function convertEthereumBalance(web3, ethereumBalance, activeAccountAddress) {
  return web3.fromWei(Number(ethereumBalance[activeAccountAddress]), "ether")
}

export function convertTokenBalance(web3, tokenBalance, activeAccountAddress, tokenAddress, tokenDecimals) {
  let tokenWalletBalance = new Big(Number(tokenBalance[activeAccountAddress]))

  return tokenWalletBalance.div(10 ** tokenDecimals)
}
