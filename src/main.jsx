import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Buffer } from 'buffer';
import { ChakraProvider } from '@chakra-ui/react'; // Import ChakraProvider

// Make Buffer available globally (if required)
window.Buffer = Buffer;

// Render the application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider> {/* Wrap App in ChakraProvider */}
      <App />
    </ChakraProvider>
  </StrictMode>
);
