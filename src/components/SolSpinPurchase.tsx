import { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Transaction } from '@solana/web3.js'
import { SpinPackages } from './SpinPackages'
import { WalletBalance } from './WalletBalance'
import { solSpinPurchaseService, SpinPackage } from '../services/solSpinPurchaseService'

interface Props {
    accessToken: string // JWT token from your auth system
}

export const SolSpinPurchase: React.FC<Props> = ({ accessToken }) => {
    const { connected, publicKey, sendTransaction } = useWallet()
    const { connection } = useConnection()

    const [selectedPackage, setSelectedPackage] = useState<SpinPackage | null>(null)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    const handlePurchase = async (pkg: SpinPackage) => {
        if (!connected || !publicKey || !sendTransaction) {
            setError('Please connect your wallet first')
            return
        }

        try {
            setLoading(true)
            setError(null)
            setStatus('Creating transaction...')

            // 1. Tạo transaction từ backend
            const createResponse = await solSpinPurchaseService.createSpinPurchaseTransaction(
                accessToken,
                pkg.id,
                publicKey.toString()
            )

            setStatus('Please sign the transaction in your wallet...')


            // 2. Decode transaction từ base64 và log để kiểm tra
            console.log('Transaction base64 from backend:', createResponse.transaction);
            console.log('Connection endpoint:', connection.rpcEndpoint);
            const transactionBuffer = Buffer.from(createResponse.transaction, 'base64');
            console.log('Transaction buffer length:', transactionBuffer.length);
            const transaction = Transaction.from(transactionBuffer);
            console.log('Deserialized transaction:', transaction);
            console.log('Transaction instructions count:', transaction.instructions.length);
            console.log('Transaction fee payer:', transaction.feePayer?.toString());

            // Log chi tiết instruction đầu tiên (transfer instruction)
            if (transaction.instructions.length > 0) {
                const transferInstruction = transaction.instructions.find(ix =>
                    ix.programId.toString() === '11111111111111111111111111111111'
                );
                if (transferInstruction) {
                    console.log('Transfer instruction found:', transferInstruction);
                    console.log('Transfer data buffer:', transferInstruction.data);
                }
            }

            setStatus('Sending transaction...')

            // 3. Gửi transaction lên Solana network (wallet-adapter sẽ tự ký)
            const signature = await sendTransaction(transaction, connection)

            setStatus('Verifying transaction...')

            // 4. Đợi confirmation
            await connection.confirmTransaction(signature, 'confirmed')

            setStatus('Completing purchase...')

            // 5. Xác thực với backend
            const verifyResponse = await solSpinPurchaseService.verifyTransaction(
                accessToken,
                signature,
                pkg.id,
                publicKey.toString()
            )

            setStatus('✅ Purchase completed successfully!')
            setSelectedPackage(null)

            // Show success message
            alert(`Success! ${verifyResponse.message}`)
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
            </div>
        )
    }

    return (
        <div className='sol-spin-purchase'>
            <div className='wallet-info'>
                <h3>Wallet Connected</h3>
                <p>Address: {publicKey?.toString()}</p>
                <WalletBalance walletAddress={publicKey?.toString() || ''} />
            </div>

            {!selectedPackage ? (
                <SpinPackages onSelectPackage={setSelectedPackage} />
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
                            {loading ? 'Processing...' : `Purchase for ${selectedPackage.priceSOL} SOL`}
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
