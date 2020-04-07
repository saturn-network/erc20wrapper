export const SET_ACTIVE_ACCOUNT = 'network/SET_ACTIVE_ACCOUNT'

export function setActiveAccount(index) {
  return function(dispatch, getState) {
    dispatch({
      type: SET_ACTIVE_ACCOUNT,
      payload: index
    })
  }
}
