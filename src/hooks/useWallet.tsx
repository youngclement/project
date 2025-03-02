import { useState, useEffect, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

export function useWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Check if Phantom is installed and user is already connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Check if user is already authenticated via localStorage
        const savedWalletAddress = localStorage.getItem('wallet_address');
        const savedToken = localStorage.getItem('access_token');
        
        if (savedWalletAddress && savedToken) {
          setWalletAddress(savedWalletAddress);
          setIsAuthenticated(true);
          setIsConnected(true);
          return;
        }

        // Check if Phantom is installed
        const { solana } = window as Window;
        
        if (!solana?.isPhantom) {
          console.log('Phantom wallet not installed');
          return;
        }

        // Check if already connected to Phantom
        try {
          const response = await solana.connect({ onlyIfTrusted: true });
          const address = response.publicKey.toString();
          console.log('Already connected to wallet:', address);
          setWalletAddress(address);
          setIsConnected(true);
        } catch (err) {
          // User has not authorized the app or is not connected
          console.log('Not connected to Phantom wallet');
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkWalletConnection();
  }, []);

  // Connect to Phantom wallet
  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      
      const { solana } = window as Window;
      
      if (!solana) {
        toast.error('Phantom wallet not found! Please install it from https://phantom.app/');
        return null;
      }
      
      if (!solana.isPhantom) {
        toast.error('Please install Phantom wallet from https://phantom.app/');
        return null;
      }
      
      const response = await solana.connect();
      const address = response.publicKey.toString();
      console.log('Connected with Public Key:', address);
      
      setWalletAddress(address);
      setIsConnected(true);
      
      toast.success('Wallet connected!');
      return address;
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Authenticate with backend
  const authenticate = useCallback(async () => {
    if (!walletAddress) {
      toast.error('Wallet not connected');
      return false;
    }

    try {
      setIsAuthenticating(true);
      
      // Get nonce from server
      const nonce = await authService.getNonce(walletAddress);
      console.log('Received nonce:', nonce);
      
      // Sign the nonce with Phantom wallet
      const { solana } = window as Window;
      
      if (!solana) {
        toast.error('Phantom wallet not found');
        return false;
      }
      
      // Create the message to sign
      const message = new TextEncoder().encode(nonce);
      
      // Request signature from Phantom
      const { signature } = await solana.signMessage(message, 'utf8');
      console.log('Generated signature:', signature);
      
      // Verify signature with server
      try {
        const authResponse = await authService.verifySignature(walletAddress, signature);
        console.log('Auth response:', authResponse);
        
        if (!authResponse || !authResponse.access_token || !authResponse.refresh_token) {
          throw new Error('Invalid authentication response');
        }
        
        // Save tokens
        localStorage.setItem('access_token', authResponse.access_token);
        localStorage.setItem('refresh_token', authResponse.refresh_token);
        localStorage.setItem('wallet_address', walletAddress);
        
        setIsAuthenticated(true);
        toast.success('Authentication successful!');
        return true;
      } catch (verifyError) {
        console.error('Verification error:', verifyError);
        toast.error('Signature verification failed');
        return false;
      }
    } catch (error: any) {
      console.error('Authentication failed:', error);
      toast.error(error.message || 'Authentication failed');
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [walletAddress]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      const { solana } = window as Window;
      
      if (solana) {
        await solana.disconnect();
      }
      
      setWalletAddress(null);
      setIsAuthenticated(false);
      setIsConnected(false);
      
      // Clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('wallet_address');
      
      toast.success('Disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  }, []);

  return {
    walletAddress,
    isConnecting,
    isAuthenticating,
    isAuthenticated,
    isConnected,
    connect,
    authenticate,
    disconnect
  };
}