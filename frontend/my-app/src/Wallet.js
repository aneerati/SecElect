import electionJson from "../../../ElectionABI.json";

export async function getWalletObjs() {

    try {
        let provider = new ethers.BrowserProvider(window.ethereum)
        let signer = await provider.getSigner()
        let contractFactory = new ethers.ContractFactory(electionJson.abi, electionJson.bytecode, provider);
        
        
        return {
            provider, signer, contractFactory, smartContract
        }

    } catch {
        let provider = ethers.getDefaultProvider()
        return {
            provider
        }
    }
}