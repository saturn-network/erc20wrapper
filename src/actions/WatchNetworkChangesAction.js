import * as web3Util from '../utils/Web3Util'
import _ from 'lodash'
export const UPDATE_NETWORK = 'network/UPDATE_NETWORK'

export function watchNetworkChanges () {
  return function (dispatch, getState) {
    const web3 = getState().network.web3

    if (web3) {
      setInterval(async () => {
        let blockchain = {}
        blockchain.blockNumber = await web3Util.getBlockNumber(web3)
        blockchain.networkId = await web3Util.getNetworkId(web3)

        if (blockchain.networkId) {
          if (blockchain.networkId === '1') blockchain.networkName = 'mainnet'
          else if (blockchain.networkId === '61') blockchain.networkName = 'classic'
          else blockchain.networkName = 'testrpc'
        }

        let relevantKeys = ['blockNumber', 'networkId']

        let oldData = _.pick(getState().network, relevantKeys)
        let changed = _.isEmpty(oldData) || !_.isMatch(blockchain, oldData)
        if (!changed) return

        blockchain.currentTime = await web3Util.getTimestamp(web3)

        dispatch({
          type: UPDATE_NETWORK,
          payload: blockchain
        })
      }, 2500)
    }
  }
}
