import { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { DemoSpinPackages } from './DemoSpinPackages'
import { DemoWalletBalance } from './DemoWalletBalance'
import { SpinPackage } from '../services/solSpinPurchaseService'

interface Props {
    accessToken: string
}

export const DemoSolSpinPurchase: React.FC<Props> = ({ accessToken }) => {
    const { connected, publicKey } = useWallet()

    const [selectedPackage, setSelectedPackage] = useState<SpinPackage | null>(null)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    const handlePurchase = async (pkg: SpinPackage) => {
        if (!connected || !publicKey) {
            setError('Please connect your wallet first')
            return
        }

        try {
            setLoading(true)
            setError(null)
            setStatus('Creating transaction...')

            // Simulate API calls with delays
            await new Promise(resolve => setTimeout(resolve, 1000))
            setStatus('Please sign the transaction in your wallet...')

            await new Promise(resolve => setTimeout(resolve, 2000))
            setStatus('Sending transaction...')

            await new Promise(resolve => setTimeout(resolve, 1500))
            setStatus('Verifying transaction...')

            await new Promise(resolve => setTimeout(resolve, 1000))
            setStatus('Completing purchase...')

            await new Promise(resolve => setTimeout(resolve, 1000))
            setStatus('✅ Purchase completed successfully!')
            setSelectedPackage(null)

            // Show success message
            setTimeout(() => {
                alert(`Demo Success! You would have purchased ${pkg.name} for ${pkg.priceSOL} SOL`)
                setStatus('')
            }, 1000)
        } catch (err) {
            console.error('Purchase failed:', err)
            setError(err instanceof Error ? err.message : 'Purchase failed')
            setStatus('')
        } finally {
            setLoading(false)
        }
    }

    if (!connected) {
        return (
            <div className='wallet-connection'>
                <h3>Connect Wallet to Purchase Spins</h3>
                <WalletMultiButton />
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-700">
                        🔧 <strong>Demo Mode:</strong> This will connect to Solana testnet. No real SOL will be spent.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className='sol-spin-purchase'>
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">
                    🚀 <strong>Demo Mode Active:</strong> All transactions are simulated. No real SOL will be spent.
                </p>
            </div>

            <div className='wallet-info'>
                <h3>Wallet Connected</h3>
                <p>Address: {publicKey?.toString()}</p>
                <DemoWalletBalance walletAddress={publicKey?.toString() || ''} />
            </div>

            {!selectedPackage ? (
                <DemoSpinPackages onSelectPackage={setSelectedPackage} />
            ) : (
                <div className='purchase-confirmation'>
                    <h3>Confirm Purchase</h3>
                    <div className='selected-package'>
                        <h4>{selectedPackage.name}</h4>
                        <p>Spins: {selectedPackage.spins}</p>
                        {selectedPackage.bonusSpins && <p>Bonus: +{selectedPackage.bonusSpins}</p>}
                        <p className='price'>Price: {selectedPackage.priceSOL} SOL</p>
                    </div>

                    {status && <p className='status'>{status}</p>}
                    {error && <p className='error'>Error: {error}</p>}

                    <div className='purchase-actions'>
                        <button onClick={() => handlePurchase(selectedPackage)} disabled={loading} className='purchase-btn'>
                            {loading ? 'Processing...' : `Demo Purchase for ${selectedPackage.priceSOL} SOL`}
                        </button>
                        <button onClick={() => setSelectedPackage(null)} disabled={loading} className='cancel-btn'>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
