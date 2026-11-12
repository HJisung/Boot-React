import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { RecoilRoot } from 'recoil'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot><App /></RecoilRoot>
  </React.StrictMode>,
)
