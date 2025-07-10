import { useState } from 'react'
import { SpinPackage } from '../services/solSpinPurchaseService'

interface Props {
    onSelectPackage: (pkg: SpinPackage) => void
}

// Mock data for demonstration
const mockPackages: SpinPackage[] = [
    {
        id: '1',
        name: 'Starter Pack',
        spins: 10,
        priceSOL: 0.1,
        bonusSpins: 2,
        description: 'Perfect for beginners!'
    },
    {
        id: '2',
        name: 'Value Pack',
        spins: 25,
        priceSOL: 0.2,
        bonusSpins: 5,
        description: 'Best value for money'
    },
    {
        id: '3',
        name: 'Premium Pack',
        spins: 50,
        priceSOL: 0.35,
        bonusSpins: 15,
        description: 'Maximum spins!'
    },
    {
        id: '4',
        name: 'Mega Pack',
        spins: 100,
        priceSOL: 0.6,
        bonusSpins: 35,
        description: 'For the ultimate gamers'
    }
]

export const DemoSpinPackages: React.FC<Props> = ({ onSelectPackage }) => {
    const [loading] = useState(false)
    const [error] = useState<string | null>(null)

    if (loading) return <div>Loading packages...</div>
    if (error) return <div className='error'>Error: {error}</div>

    return (
        <div className='spin-packages'>
            <h3>Choose Spin Package (Demo)</h3>
            <div className='packages-grid'>
                {mockPackages.map((pkg) => (
                    <div key={pkg.id} className='package-card'>
                        <h4>{pkg.name}</h4>
                        <div className='package-details'>
                            <p>Spins: {pkg.spins}</p>
                            {pkg.bonusSpins && <p>Bonus: +{pkg.bonusSpins}</p>}
                            <p className='price'>{pkg.priceSOL} SOL</p>
                            <p className='description'>{pkg.description}</p>
                        </div>
                        <button onClick={() => onSelectPackage(pkg)} className='select-package-btn'>
                            Select Package
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                    💡 <strong>Demo Mode:</strong> These are sample packages. In production, data will be loaded from your backend API.
                </p>
            </div>
        </div>
    )
}
