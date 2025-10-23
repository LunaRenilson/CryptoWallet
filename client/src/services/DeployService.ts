import { ethers, Wallet } from 'ethers';
import LunarisArtifact from '../../../backend/artifacts/contracts/Lunaris.sol/Lunaris.json';

export class DeployService {
    private deployerSigner: Wallet;

    constructor(deployerSigner: Wallet){
        this.deployerSigner = deployerSigner;
    }

    async deployLunarisContract(): Promise<ethers.BaseContract> {
        const LunarisFactory = new ethers.ContractFactory(
            LunarisArtifact.abi,
            LunarisArtifact.bytecode,
            this.deployerSigner // #0 Account of hardhat node
        )
        
        console.log('Deploying Lunaris contract...');
        const lunarisInstance = await LunarisFactory.deploy();

        // Waits for the contract to be mined
        await lunarisInstance.waitForDeployment();

        // Gets the contract address
        const address = await lunarisInstance.getAddress();
        console.log(`Lunaris contract deployed at address: ${address}`);

        return lunarisInstance;
    };

}