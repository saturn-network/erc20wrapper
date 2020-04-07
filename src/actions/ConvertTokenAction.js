import { ERC20WrapperAddress, ERC20WrapperABI,
  ERC223WrapperAddress, ERC223WrapperABI,
  ERC20TokenDecimals, ERC223TokenDecimals } from '../constants'

export function from223to20(tokenAmount) {
  return async function(dispatch, getState) {
    let web3 = getState().network.web3

    if (web3) {
      let activeAccountAddress = getState().network.activeAccountAddress

      let erc223contract = web3.eth.contract(ERC223WrapperABI).at(ERC223WrapperAddress)

      if (activeAccountAddress) {
        return new Promise(resolve => {
          erc223contract.transfer.sendTransaction(
            ERC20WrapperAddress, (tokenAmount * (10 ** ERC20TokenDecimals)), function(error, transaction) {
              if (transaction) {
                resolve(transaction)
              }
            }
          )
        })
      }
    }
  }
}

export function from20to223(tokenAmount) {
  return async function(dispatch, getState) {
    let web3 = getState().network.web3

    if (web3) {
      let activeAccountAddress = getState().network.activeAccountAddress

      let erc20contract = web3.eth.contract(ERC20WrapperABI).at(ERC20WrapperAddress)

      if (activeAccountAddress) {
        return new Promise(resolve => {
          erc20contract.burn.sendTransaction(
            (tokenAmount * (10 ** ERC223TokenDecimals)), function(error, transaction) {
              if (transaction) {
                resolve(transaction)
              }
            }
          )
        })
      }
    }
  }
}
