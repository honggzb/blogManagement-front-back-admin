import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store';
import './index.css'
import ThemeProvider from './components/ThemeProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </PersistGate>
    </Provider>
  </React.StrictMode>,
)
