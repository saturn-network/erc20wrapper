import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'

import 'bootstrap/dist/js/bootstrap.bundle.min'
import 'bootstrap/dist/css/bootstrap.min.css'

import ConverterDapp from './ConverterDapp'

import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <Provider store={store}>
    <ConverterDapp/>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()
