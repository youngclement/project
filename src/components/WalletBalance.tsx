import { useState, useEffect } from 'react'
import { solSpinPurchaseService } from '../services/solSpinPurchaseService'

interface Props {
    walletAddress: string
}

export const WalletBalance: React.FC<Props> = ({ walletAddress }) => {
    const [balance, setBalance] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (walletAddress) {
            loadBalance()
        }
    }, [walletAddress])

    const loadBalance = async () => {
        try {
            setLoading(true)
            const data = await solSpinPurchaseService.getWalletBalance(walletAddress)
            setBalance(data.balance_sol)
        } catch (err) {
            console.error('Failed to load balance:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <span>Loading balance...</span>

    return (
        <div className='wallet-balance'>
            <span>Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : 'Unknown'}</span>
            <button onClick={loadBalance} className='refresh-btn'>
                ↻
            </button>
        </div>
    )
}
