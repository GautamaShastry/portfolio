import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import './i18n'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { store } from './store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <ToastContainer
            position='top-center'
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            theme='colored'
          />
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  </StrictMode>,
)
