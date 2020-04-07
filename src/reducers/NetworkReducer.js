import {
  CONNECT_NETWORK,
  UPDATE_NETWORK,
  SET_ACTIVE_ACCOUNT
} from '../actions'

const initialState = {
  activeAccountAddress: undefined,
  isConnected: false,
  web3: undefined,
};

export default function(state = initialState, action) {
  switch(action.type) {

  case CONNECT_NETWORK:
    return {
      ...state,
      web3: action.payload,
      isConnected: true
    }

  case UPDATE_NETWORK:
    const blockchain = action.payload
    return {
      ...state,
      ...blockchain
    }

  case SET_ACTIVE_ACCOUNT:
    if(!state.web3) return state

    return {
      ...state,
      activeAccountAddress: action.payload
    }

  default:
    return state
  }
}
