import { WalletService } from "../services/WalletService.js";
import { DeployService } from "../services/DeployService.js";
import { ethers, Wallet } from "ethers";

const DEPLOYER_PK = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // #0 Account of hardhat node
const PROVIDER_URL = "http://localhost:8545"; // Hardhat local node URL

export async function runSimulation(): Promise<string> {
    console.log("Starting simulation...");

    // Initialize deployer signer
    const walletService = new WalletService(PROVIDER_URL, DEPLOYER_PK);
    const deployerSigner = walletService.deployerSigner as Wallet;

    // Deploy Lunaris contract
    const deployService = new DeployService(deployerSigner);
    const lunarisAddress = await deployService.deployLunarisContract();

    console.log("Simulation completed.");
    return lunarisAddress.toString();
}

runSimulation().catch(console.error)

