import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import App from './App';
import Loader from '../src/components/common/Loader/Loader';
import Error from '../src/components/common/Error/Error';
import { useUser } from "../src/hooks/useUser";
import { initializeAuth } from '../src/store/index';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '../src/lib/reownAppkit/reownAppkit';  
import "./styles/index.css";

const RootWrapper = () => {
  const { isLoading, error }  = useUser(); 
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
      <App />
    </WagmiProvider>
  );
};

export default RootWrapper;
