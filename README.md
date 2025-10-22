# CryptoWallet

A simple React-based cryptocurrency wallet application built with Vite, TypeScript, and ethers.js. This app allows users to create new wallets, recover existing wallets using mnemonic phrases, and check balances on the Ethereum network.

## Project Structure

The project is organized as follows:

- `src/App.tsx`: The main React component that handles the UI and user interactions.
- `src/services/WalletService.ts`: A service class that manages wallet creation, recovery, and balance retrieval using ethers.js.
- `src/main.tsx`: The entry point for the React application.
- `src/App.css`: Styles specific to the App component.
- `src/index.css`: Global styles, including Tailwind CSS imports.

## Dependencies

- React: For building the user interface.
- ethers.js: For interacting with the Ethereum blockchain.
- Vite: For development and build tooling.
- Tailwind CSS: For styling.

## Environment Variables

The application uses the following environment variables (defined in `.env` or similar):

- `VITE_PROVIDER`: The URL of the Ethereum JSON-RPC provider (e.g., Infura or Alchemy endpoint).
- `VITE_SYMBOL`: The symbol of the cryptocurrency (e.g., "ETH").

## WalletService.ts

The `WalletService` class encapsulates wallet-related operations using ethers.js. It provides methods for creating, recovering, and querying wallet information.

### Constructor

```typescript
constructor(provider: string)
```

- **Description**: Initializes the service with a JSON-RPC provider.
- **Parameters**:
  - `provider`: A string URL for the Ethereum provider (e.g., "https://mainnet.infura.io/v3/YOUR_PROJECT_ID").
- **ethers.js Usage**: Creates a `JsonRpcProvider` instance from ethers.js to connect to the blockchain.

### createWallet()

```typescript
createWallet(): HDNodeWallet
```

- **Description**: Generates a new random HD wallet.
- **Returns**: An `HDNodeWallet` instance connected to the provider.
- **ethers.js Usage**:
  - `HDNodeWallet.createRandom()`: Generates a new random hierarchical deterministic wallet.
  - `wallet.connect(provider)`: Connects the wallet to the provider for blockchain interactions.
- **How to Use**: Call this method to create a new wallet. The returned wallet object includes properties like `address`, `publicKey`, `privateKey`, and `mnemonic`.

### recoverWallet(mnemonicString: string)

```typescript
recoverWallet(mnemonicString: string): HDNodeWallet
```

- **Description**: Recovers a wallet from a given mnemonic phrase.
- **Parameters**:
  - `mnemonicString`: The 12- or 24-word mnemonic phrase.
- **Returns**: An `HDNodeWallet` instance connected to the provider.
- **ethers.js Usage**:
  - `HDNodeWallet.fromPhrase(mnemonicString)`: Derives the wallet from the provided mnemonic phrase.
  - `wallet.connect(provider)`: Connects the wallet to the provider.
- **How to Use**: Pass a valid mnemonic phrase to recover an existing wallet. Ensure the phrase is correct to avoid errors.

### getBalance(address?: string)

```typescript
async getBalance(address?: string): Promise<string>
```

- **Description**: Retrieves the balance of a given address. If no address is provided, it uses the current wallet's address.
- **Parameters**:
  - `address` (optional): The Ethereum address to query. If omitted, uses `this.wallet.address`.
- **Returns**: A promise that resolves to the balance as a string (in wei).
- **ethers.js Usage**:
  - `provider.getBalance(address)`: Queries the balance from the blockchain provider.
- **How to Use**: Await this method to get the balance. Convert the string to a readable format if needed (e.g., using ethers.js utilities for ETH conversion).

## App.tsx

The `App` component is the root of the React application. It manages the wallet state and provides a UI for wallet operations.

### State and Hooks

- `userWallet`: Holds the current wallet object (null if no wallet is loaded).
- `userBalance`: Stores the balance as a string.
- `walletServiceRef`: A ref to ensure a single instance of `WalletService` is created.

### Functions

#### createWallet()

- **Description**: Creates a new wallet and fetches its balance.
- **Behavior**: Calls `walletService.createWallet()`, sets the wallet state, and retrieves the balance.

#### recoverWallet()

- **Description**: Prompts the user for a mnemonic phrase and recovers the wallet.
- **Behavior**: Uses `prompt()` for input, calls `walletService.recoverWallet()`, sets the wallet state, and fetches the balance.

#### useEffect

- **Description**: Updates the balance whenever the wallet changes.
- **Behavior**: Calls `walletService.getBalance()` with the wallet's address.

### UI Elements

- Displays wallet details (public key, private key, address, mnemonic, balance) when a wallet is loaded.
- Buttons for "Create Wallet" and "Recover Wallet" when no wallet is present.
- Placeholder buttons for "Send Crypto" and "Search TX" (not implemented).

## Usage

1. Set up environment variables (`VITE_PROVIDER` and `VITE_SYMBOL`).
2. Run the development server: `npm run dev`.
3. Open the app in a browser.
4. Create a new wallet or recover an existing one using the mnemonic phrase.
5. View wallet details and balance.

## Security Notes

- Private keys and mnemonics are displayed in the UI for demonstration purposes. In a production app, handle sensitive information securely (e.g., encrypt or avoid displaying).
- Always use secure providers and keep mnemonics safe.

## Future Enhancements

- Implement sending transactions.
- Add transaction history search.
- Improve error handling and user feedback.
