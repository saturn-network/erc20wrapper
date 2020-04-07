import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'

import NetworkReducer from './reducers/NetworkReducer'

const reducers = combineReducers({
  network: NetworkReducer
})

const store = createStore(
  reducers,
  applyMiddleware(thunk)
)

export default store
