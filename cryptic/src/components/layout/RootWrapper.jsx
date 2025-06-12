import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import App from '../../App';
import Loader from '../common/Loader/Loader';
import Error from '../common/Error/Error';
import { useUser } from "../../hooks/useUser";
import { initializeAuth } from '../../store/index';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '../../lib/reownAppkit/reownAppkit';  
import "../../styles/index.css";

const RootWrapper = () => {
  const { isLoading, error }  = useUser(); 
  const queryClient = new QueryClient();
  const dispatch = useDispatch();

  useEffect(() => {
     initializeAuth();
  }, [dispatch]);

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
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RootWrapper;
