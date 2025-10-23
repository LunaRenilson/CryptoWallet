import { HDNodeWallet, JsonRpcProvider } from 'ethers';

export class WalletService {
    provider: JsonRpcProvider;
    wallet: HDNodeWallet | null = null;

    constructor(provider: string) {
        this.provider = new JsonRpcProvider(provider);
    }

    createWallet() {
        const w = HDNodeWallet.createRandom();
        this.wallet = w.connect(this.provider);
        return this.wallet;
    }

    recoverWallet(mnemonicString: string) {
        const w = HDNodeWallet.fromPhrase(mnemonicString);
        this.wallet = w.connect(this.provider);
        return this.wallet;
    }

    // agora aceita um address opcional — mais confiável para uso no cliente
    async getBalance(address?: string) {
        const balance = await this.provider.getBalance(address!);
        return balance.toString();
    }
}