import './App.css'
import { WalletService } from './services/WalletService.ts'
import { useEffect, useState, useRef } from 'react'

function App() {
	const symbol = import.meta.env.VITE_SYMBOL
	const providerUrl = import.meta.env.VITE_PROVIDER
	const walletServiceRef = useRef<WalletService | null>(null)
	if (!walletServiceRef.current) walletServiceRef.current = new WalletService(providerUrl)
	const walletService = walletServiceRef.current

	const [userWallet, setuserWallet] = useState<any>(null)
	const [userBalance, setUserBalance] = useState<string>("")

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			alert('Conteúdo copiado!');
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	};

	const createWallet = async () => {
		const w = walletService.createWallet()
		setuserWallet(w)

		try {
			const balance = await walletService.getBalance(w.address)
			setUserBalance(balance)
		} catch (err) {
			console.error('getBalance error', err)
			setUserBalance('ERROR')
		}
	}

	const recoverWallet = () => {
		const mnemonic = prompt("Enter your mnemonic phrase:")
		if (mnemonic) {
			(async () => {
				const w = walletService.recoverWallet(mnemonic)
				setuserWallet(w)
				try {
					const balance = await walletService.getBalance(w.address)
					setUserBalance(balance)
				} catch (err) {
					console.error('getBalance error', err)
					setUserBalance('ERROR')
				}
			})()
		}
	}

	useEffect(() => {
		if (userWallet) {
			(async () => {
				try {
					const balance = await walletService.getBalance(userWallet.address)
					setUserBalance(balance)
				} catch (err) {
					console.error('getBalance error', err)
					setUserBalance('ERROR')
				}
			})()
		}
	}, [userWallet])

	return (
		<div>
			<div className='mb-5 absolute top-5 left-[40%] right-5 w-fit'>
				{userWallet &&
					<div className='flex flex-col gap-y-2'>

						<h3>Wallet Balance: {userBalance}</h3>
							<p onClick={() => copyToClipboard(userWallet.publicKey)} className='bg-green-50 p-3 text-green-400 font-semibold rounded cursor-pointer'>{userWallet.publicKey.slice(0, 10)}...</p>

						<div className='flex gap-3 w-full justify-between'>
							<p onClick={() => copyToClipboard(userWallet.privateKey)} className='bg-green-50 p-3 text-green-400 font-semibold rounded cursor-pointer'>private</p>
							<p onClick={() => copyToClipboard(userWallet.address)} className='bg-green-50 p-3 text-green-400 font-semibold rounded cursor-pointer'>Wallet Address</p>
							<p onClick={() => copyToClipboard(userWallet.mnemonic.phrase)} className='bg-green-50 p-3 text-green-400 font-semibold rounded cursor-pointer'>Phrase</p>
						</div>
					</div>
				}

			</div>

			<div className="App flex flex-col gap-y-5">
				<h1>Crypto Wallet</h1>

				<p>Choose Operation <small className='text-gray-400'>({symbol})</small></p>
				{!userWallet &&
					<div className='flex flex-col gap-4'>
						<button onClick={createWallet}>Create Wallet</button>
						<button onClick={recoverWallet}>Recover Wallet</button>
					</div>
				}

				{userWallet &&
					<div>
						<div className='flex gap-5'>
							<button>Send Crypto</button>
							<button>Search TX</button>
						</div>
					</div>
				}
			</div>

		</div>
	)
}

export default App
