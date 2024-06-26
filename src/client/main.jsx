import React from 'react'
import ReactDOM from 'react-dom/client'

import Sustainable from './sustainable/Sustainable.jsx'
import 'vite/modulepreload-polyfill'
import { initFirebase } from './logic/init.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Sustainable/>
)


initFirebase();
