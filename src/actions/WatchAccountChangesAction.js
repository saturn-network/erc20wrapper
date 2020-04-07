import {
  SET_ACTIVE_ACCOUNT
} from "./SetActiveAccountAction"

import * as web3Util from '../utils/Web3Util'

export function watchAccountChanges() {
  return function(dispatch, getState) {
    let web3 = getState().network.web3
    let activeAccountAddress = getState().network.activeAccountAddress

    let interval = setInterval(async () => {
      if (!web3) return

      let candidate = await web3Util.getAccount(web3)

      if (activeAccountAddress !== candidate) {
        clearInterval(interval);
        dispatch({
          type: SET_ACTIVE_ACCOUNT,
          payload: candidate
        })
        dispatch(watchAccountChanges())
      }
    }, 2500)
  }
}
