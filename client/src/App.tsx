import './App.css'
import { WalletService } from './services/WalletService.ts'
import { useEffect, useState, useRef } from 'react'

function App() {

	const walletService = useRef(new WalletService('http://localhost:8545', "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80")).current

	const [userWallet, setUserWallet] = useState<any>(null)
	const [userBalance, setUserBalance] = useState<string>("")
	const [users, setUsers] = useState<Array<any>>([])

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			alert(text + ' copiado!');
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	};

	const createWallet = async () => {
		const w = await walletService.createWallet()
		setUserWallet(w)
		try {
			const balance = await walletService.getBalance(w.address)
			setUserBalance(balance)
		} catch (err) {
			console.error('getBalance error', err)
			setUserBalance('ERROR')
		}

		const userData = {
			publicKey: w.publicKey,
			privateKey: w.privateKey,
			address: w.address,
			mnemonic: w.mnemonic?.phrase
		}

		setUsers(prevUsers => [...prevUsers, userData])
	}

	const recoverWallet = () => {
		const mnemonic = prompt("Enter your mnemonic phrase:")
		if (mnemonic) {
			(async () => {
				const w = walletService.recoverWallet(mnemonic)
				setUserWallet(w)
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

	const sendCrypto = async () => {
		const toAddress = prompt("Enter recipient address:")
		const amount = prompt("Enter amount in ETH:")
		if (toAddress && amount) {
			try {
				const tx = await walletService.sendTransaction(toAddress, amount)
				alert(`Transaction successful! TX Hash: ${tx.hash}`)
			} catch (err) {
				console.error('sendTransaction error', err)
				alert('Transaction failed!')
			}
		}

		userBalance && setUserBalance("")
		try {
			const balance = await walletService.getBalance(userWallet.address)
			setUserBalance(balance)
		} catch (err) {
			console.error('getBalance error', err)
			setUserBalance('ERROR')
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

	const disconnect = (() => {
		walletService.disconnect()
		setUserWallet(null)
		setUserBalance("")
	})

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

			<div className="App flex flex-col gap-y-5 justify-center items-center">
				<h1>Crypto Wallet</h1>
				{!userWallet &&
					<div className='flex flex-col gap-4'>
						<button onClick={createWallet}>Create Wallet</button>
						<button onClick={recoverWallet}>Recover Wallet</button>
					</div>
				}

				{userWallet &&
					<div>
						<div className='flex gap-5'>
							<button onClick={sendCrypto}>Send Crypto</button>
							<button>Search TX</button>
							<button onClick={disconnect}>Log Out</button>
						</div>
					</div>
				}
			</div>

			{users && users.length > 0 &&
				<div className='users shadow-lg mt-15 rounded p-5 flex overflow-scroll gap-x-5 w-full'>
					{users.map((user, index) => (
						<div key={index} className='user-card border border-gray-200 rounded-xl p-3 mb-3 w-fit flex flex-col gap-y-2'>
							<p className='text-left bg-gray-50 p-3 text-orange-800 rounded cursor-pointer' onClick={() => copyToClipboard(users[index].address)}><strong>Address:</strong> {user.address.slice(0, 8)}...</p>
							<p className='text-left bg-gray-50 p-3 text-orange-800 rounded cursor-pointer' onClick={() => copyToClipboard(user.publicKey)}><strong>Public Key:</strong> {user.publicKey.slice(0, 8)}...</p>
							<p className='text-left bg-gray-50 p-3 text-orange-800 rounded cursor-pointer' onClick={() => copyToClipboard(user.privateKey)}><strong>Private Key:</strong> {user.privateKey.slice(0, 8)}...</p>
							<p className='text-left bg-gray-50 p-3 text-orange-800 rounded cursor-pointer' onClick={() => copyToClipboard(users[index].mnemonic)}><strong>Mnemonic:</strong> {user.mnemonic.slice(0, 8)}...</p>
						</div>
					))}
				</div>
			}
		</div>
	)
}

export default App
