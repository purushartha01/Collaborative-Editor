import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster richColors={true} position='bottom-right' offset={{ bottom: '2rem', right: '3rem' }} theme='light' closeButton toastOptions={{ duration: 5000 }} gap={10} />
  </React.StrictMode>,
)
