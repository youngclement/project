import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

const UserProfile: React.FC = () => {
  const { walletAddress, isAuthenticated, disconnect } = useWallet();

  if (!isAuthenticated || !walletAddress) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
        <button
          onClick={disconnect}
          className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-3">
          <User size={32} className="text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Wallet Address</p>
          <p className="font-mono text-gray-800">
            {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-6)}`}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Username</p>
          <p className="font-medium text-gray-800">{`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Referral Code</p>
          <p className="font-medium text-gray-800">{walletAddress.slice(-6)}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;