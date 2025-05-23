import { useConnect } from 'wagmi';

export function useWalletConnect() {
  const { connect, connectors, isLoading, pendingConnector } = useConnect({
    onSuccess(data) {
      console.log('➡️ Connected with:', data.connector.name);
    },
    onError(error) {
      console.error('❌ Connection failed:', error);
    }
  });

  return { connect, connectors, isLoading, pendingConnector };
}
