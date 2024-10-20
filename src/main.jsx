import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Buffer } from 'buffer';
import { ChakraProvider } from '@chakra-ui/react'; // Import ChakraProvider
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

// Make Buffer available globally (if required)
window.Buffer = Buffer;

// Show a welcome toast globally on app load (optional)
toast.info("Welcome to the Campaigns App!");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider> {/* Wrap App in ChakraProvider */}
      <App />
      {/* ToastContainer for global toast notifications */}
      <ToastContainer position="top-center" autoClose={5000} />
    </ChakraProvider>
  </StrictMode>
);
