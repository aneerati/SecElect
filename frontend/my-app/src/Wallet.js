import electionJson from "./ElectionABI.json";
import { ethers } from "ethers";

export async function getWalletObjs() {

    try {
        let provider = new ethers.BrowserProvider(window.ethereum)
        let signer = await provider.getSigner()
        let contractFactory = new ethers.ContractFactory(electionJson.abi, electionJson.bytecode, signer);
        
        
        return {
            provider, signer, contractFactory
        }

    } catch {
        let provider = ethers.getDefaultProvider()
        return {
            provider
        }
    }
}