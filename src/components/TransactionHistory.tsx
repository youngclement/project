import { useState, useEffect } from 'react'
import { solSpinPurchaseService } from '../services/solSpinPurchaseService'

interface Props {
    accessToken: string
}

interface Transaction {
    _id: string
    transaction_signature: string
    package_name: string
    sol_amount: number
    total_spins_received: number
    status: string
    created_at: string
}

export const TransactionHistory: React.FC<Props> = ({ accessToken }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadTransactions()
    }, [])

    const loadTransactions = async () => {
        try {
            setLoading(true)
            const data = await solSpinPurchaseService.getUserTransactions(accessToken)
            setTransactions(data.transactions)
        } catch (err) {
            console.error('Failed to load transactions:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div>Loading transactions...</div>

    return (
        <div className='transaction-history'>
            <h3>SOL Purchase History</h3>
            {transactions.length === 0 ? (
                <p>No transactions found</p>
            ) : (
                <div className='transactions-list'>
                    {transactions.map((tx) => (
                        <div key={tx._id} className='transaction-item'>
                            <div className='tx-info'>
                                <h4>{tx.package_name}</h4>
                                <p>Spins: {tx.total_spins_received}</p>
                                <p>Amount: {tx.sol_amount} SOL</p>
                                <p>
                                    Status: <span className={`status-${tx.status}`}>{tx.status}</span>
                                </p>
                                <p>Date: {new Date(tx.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className='tx-signature'>
                                <small>Signature: {tx.transaction_signature.slice(0, 20)}...</small>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
