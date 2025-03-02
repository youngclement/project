import React from 'react';
import { Wallet } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

const WalletButton: React.FC = () => {
  const { 
    walletAddress, 
    isConnecting, 
    isAuthenticating,
    isAuthenticated, 
    isConnected, 
    connect, 
    authenticate, 
    disconnect 
  } = useWallet();

  const handleClick = async () => {
    if (!isConnected) {
      // If not connected, connect wallet first
      await connect();
    } else if (!isAuthenticated) {
      // If connected but not authenticated, authenticate
      await authenticate();
    } else {
      // If already authenticated, disconnect
      disconnect();
    }
  };

  // Determine button text based on connection and authentication state
  const getButtonText = () => {
    if (isConnecting) return 'Connecting...';
    if (isAuthenticating) return 'Authenticating...';
    
    if (!isConnected) return 'Connect Wallet';
    
    if (!isAuthenticated) return 'Authenticate';
    
    return (
      <span className="flex flex-col items-start">
        <span className="text-xs opacity-80">Connected</span>
        <span>{`${walletAddress!.slice(0, 4)}...${walletAddress!.slice(-4)}`}</span>
      </span>
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting || isAuthenticating}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-70"
    >
      <Wallet size={20} />
      {getButtonText()}
    </button>
  );
};

export default WalletButton;