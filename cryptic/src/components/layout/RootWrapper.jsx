import React, { useEffect, useRef } from 'react';
import { useUser } from "../../hooks/useUser";
import { initializeAuth } from '../../store/index';
import App from '../../App';
import Loader from '../common/Loader/Loader';
import Error from '../common/Error/Error';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '../../lib/reownAppkit/reownAppkit';  
import "../../styles/index.css";
import CookieConsent from '../common/CookieConsent/CookieConsent';

const RootWrapper = () => {
  const { isLoading, error } = useUser();
  const queryClient = new QueryClient();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      console.log("Ініціалізація вже була виконана, пропускаємо");
      return;
    }

    const init = async () => {
      console.log("initializeAuth починається");
      initialized.current = true;
      await initializeAuth();
      console.log("initializeAuth завершився");
    };
    
    init();
  }, []);

  if (error) {
    return (
      <div className='loaderMain'>
        <Error />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='loaderMain'>
        <Loader /> 
      </div>
    );
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
        <CookieConsent />
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RootWrapper;
