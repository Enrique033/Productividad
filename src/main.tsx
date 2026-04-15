import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // <--- ¿ESTA LÍNEA ESTÁ AHÍ? Es la que activa todo.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)