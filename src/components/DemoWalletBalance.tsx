import { useState } from 'react'

interface Props {
    walletAddress: string
}

export const DemoWalletBalance: React.FC<Props> = ({ walletAddress }) => {
    const [balance] = useState<number>(1.2345) // Mock balance
    const [loading, setLoading] = useState(false)

    const loadBalance = async () => {
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }

    if (loading) return <span>Loading balance...</span>

    return (
        <div className='wallet-balance'>
            <span>Balance: {balance.toFixed(4)} SOL</span>
            <button onClick={loadBalance} className='refresh-btn'>
                ↻
            </button>
            <div className="text-xs text-gray-500 mt-1">
                (Demo balance - not real)
            </div>
        </div>
    )
}
