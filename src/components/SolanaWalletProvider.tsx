import { FC, ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css'

interface Props {
    children: ReactNode
}

export const SolanaWalletProvider: FC<Props> = ({ children }) => {
    // Network - sử dụng testnet cho development
    const network = WalletAdapterNetwork.Testnet
    const endpoint = useMemo(() => clusterApiUrl(network), [network])

    // Wallet adapters
    const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}
