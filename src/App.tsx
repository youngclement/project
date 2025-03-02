import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Wallet as WalletIcon, Shield } from 'lucide-react';
import WalletButton from './components/WalletButton';
import UserProfile from './components/UserProfile';
import { useWallet } from './hooks/useWallet';

function App() {
  const { isAuthenticated, walletAddress, isConnected } = useWallet();
  const [showAuthSteps, setShowAuthSteps] = useState(false);
  const [phantomInstalled, setPhantomInstalled] = useState(false);

  useEffect(() => {
    // Check if Phantom wallet is installed
    const checkPhantomWallet = () => {
      const { solana } = window as any;
      if (solana?.isPhantom) {
        setPhantomInstalled(true);
      }
    };

    checkPhantomWallet();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setShowAuthSteps(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield size={28} className="text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">Solana Auth Demo</h1>
          </div>
          <WalletButton />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAuthenticated && walletAddress ? (
          <UserProfile />
        ) : (
          <div className="text-center max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <WalletIcon size={32} className="text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Solana Wallet Authentication</h2>
              <p className="text-gray-600 mb-8">
                Connect your Solana wallet to authenticate and access your profile.
              </p>
              
              {!phantomInstalled && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Phantom wallet not detected. Please{' '}
                        <a 
                          href="https://phantom.app/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium underline text-yellow-700 hover:text-yellow-600"
                        >
                          install Phantom
                        </a>{' '}
                        to continue.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center mb-6">
                <WalletButton />
              </div>
              
              <button 
                onClick={() => setShowAuthSteps(!showAuthSteps)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                {showAuthSteps ? 'Hide authentication steps' : 'How does it work?'}
              </button>
              
              {showAuthSteps && (
                <div className="mt-6 text-left bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">Authentication Flow:</h3>
                  <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                    <li>Connect your Solana wallet</li>
                    <li>Server generates a unique nonce (challenge)</li>
                    <li>Your wallet signs this nonce with your private key</li>
                    <li>Server verifies the signature using your public key</li>
                    <li>If verified, you receive access and refresh tokens</li>
                    <li>You're now authenticated without sharing your private key</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;