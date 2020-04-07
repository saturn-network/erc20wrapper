import Web3 from 'web3'
import { setActiveAccount } from './SetActiveAccountAction'

import {
  watchAccountChanges,
  watchNetworkChanges
} from '.'

export const CONNECT_NETWORK = 'network/CONNECT_NETWORK'
let web3 = window.web3

export function connectNetwork () {
  return function (dispatch) {
    if (typeof web3 !== 'undefined') {
      window.web3 = new Web3(web3.currentProvider)
    }

    if (web3) {
      dispatch({
        type: CONNECT_NETWORK,
        payload: web3
      })

      dispatch(watchNetworkChanges())
      dispatch(setActiveAccount(0))
      dispatch(watchAccountChanges())
    }
  }
}
