import { HDNodeWallet, parseEther, ethers, Wallet } from 'ethers';
// Import to fund account
// import { setBalance } from "@nomicfoundation/hardhat-network-helpers"

export class WalletService {
    wallet: HDNodeWallet | null = null;
    deployerSigner: Wallet | null = null;
    private provider: ethers.Provider;

    constructor(providerUrl: string, deployerPrivateKey: string) {
        this.provider = new ethers.JsonRpcProvider(providerUrl); // Example for local Hardhat
        this.deployerSigner = new Wallet(deployerPrivateKey, this.provider) || null;
    }

    async createWallet() {
        const w = HDNodeWallet.createRandom();
        this.wallet = w 
        // Generating random value to fund the wallet
        const value = Math.floor((Math.random() * 10)).toString();
        console.log(value)
        const ethAmout = ethers.parseEther(value);
        console.log(`Funding new wallet ${this.wallet.address} with ${ethers.formatEther(ethAmout)} ETH`);

        if (!this.wallet) throw new Error("Wallet not initialized");
        // Deployer signs and sends 1 ETH to the new wallet
        const tx = await this.deployerSigner?.sendTransaction({
            to: this.wallet.address,
            value: ethAmout
        });
        
        await tx?.wait();
        return this.wallet;
    }

    recoverWallet(mnemonicString: string) {
        const w = HDNodeWallet.fromPhrase(mnemonicString);
        this.wallet = w.connect(this.provider);
        return this.wallet;
    }

    // // agora aceita um address opcional — mais confiável para uso no cliente
    async getBalance(address?: string) {
        const balance = await this.provider.getBalance(address || this.wallet?.address || '');
        return ethers.formatEther(balance).toString();
    }

    async sendTransaction(to: string, amountInEther: string) {
        if (!this.wallet) throw new Error("Wallet not initialized");
        const tx = await this.wallet.sendTransaction({
            to,
            value: parseEther(amountInEther)
        });
        await tx.wait();
        return tx;
    }

    disconnect() {
        this.wallet = null;
        return;
    }
}
