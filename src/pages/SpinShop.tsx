import { SolSpinPurchase } from '../components/SolSpinPurchase'
import { TransactionHistory } from '../components/TransactionHistory'
import { useWallet } from '../hooks/useWallet'

export const SpinShop: React.FC = () => {
    const { accessToken, isAuthenticated } = useWallet()

    if (!isAuthenticated || !accessToken) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Please login to purchase spins</h2>
                <p className="text-gray-600">You need to authenticate first to access the spin shop.</p>
            </div>
        )
    }

    return (
        <div className='spin-shop'>
            <h1 className="text-3xl font-bold text-center mb-8">Spin Shop</h1>
            <SolSpinPurchase accessToken={accessToken} />
            <TransactionHistory accessToken={accessToken} />
        </div>
    )
}
