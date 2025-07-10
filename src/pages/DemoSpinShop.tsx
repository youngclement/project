import { DemoSolSpinPurchase } from '../components/DemoSolSpinPurchase'
import { useWallet } from '../hooks/useWallet'

export const DemoSpinShop: React.FC = () => {
    const { accessToken, isAuthenticated } = useWallet()

    if (!isAuthenticated) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Please login to purchase spins</h2>
                <p className="text-gray-600">You need to authenticate first to access the spin shop.</p>
            </div>
        )
    }

    return (
        <div className='spin-shop'>
            <h1 className="text-3xl font-bold text-center mb-8">Spin Shop (Demo)</h1>
            <DemoSolSpinPurchase accessToken={accessToken || 'demo-token'} />

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-blue-800">Demo Features Implemented:</h3>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                    <li>✅ Solana Wallet Connection (Testnet)</li>
                    <li>✅ Spin Package Selection</li>
                    <li>✅ Purchase Flow Simulation</li>
                    <li>✅ Wallet Balance Display (Mock)</li>
                    <li>✅ Transaction Status Updates</li>
                    <li>⚠️ Real API Integration (Pending Backend)</li>
                </ul>
                <p className="mt-3 text-sm text-blue-600">
                    <strong>Next Steps:</strong> Connect to your backend API endpoints to replace demo data with real functionality.
                </p>
            </div>
        </div>
    )
}
