import { useState, useEffect } from 'react'
import { SpinPackage, solSpinPurchaseService } from '../services/solSpinPurchaseService'

interface Props {
    onSelectPackage: (pkg: SpinPackage) => void
}

export const SpinPackages: React.FC<Props> = ({ onSelectPackage }) => {
    const [packages, setPackages] = useState<SpinPackage[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadPackages()
    }, [])

    const loadPackages = async () => {
        try {
            setLoading(true)
            const data = await solSpinPurchaseService.getSpinPackages()
            setPackages(data.packages)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load packages')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div>Loading packages...</div>
    if (error) return <div className='error'>Error: {error}</div>

    return (
        <div className='spin-packages'>
            <h3>Choose Spin Package</h3>
            <div className='packages-grid'>
                {packages.map((pkg) => (
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
        </div>
    )
}
