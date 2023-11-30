import logo from './logo.svg';
import './App.css';
import { ContractFactory } from 'ethers';

function App() {

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [connected, setConnected] = useState(false)
  const [factory, setFactory] = useState(null);
  const [electionContract, setSmartContract] = useState(null);

  const setUpWallet = () => {
      getWalletObjs().then((result) => {
          
          setProvider(result.provider)
          setSigner(result.signer)
          setFactory(result.contractFactory)
          //setSmartContract(result.smartContract)

          if (result.signer == null || result.smartContract == null) {
              
              setConnected(false)
          } else {
              setConnected(true)
          }
          
          
      })
  }

  if (!connected) {
    setUpWallet();
  }

  const vote = () => {
      //electionContract.
  }

  const run = (candidate, ) => {
      electionContract[enterRace].populateTransaction(value).then((result) => {
        provider.sendTransaction(result);
      });
  }

  async function StartElection() {
    const factory = new ContractFactory(contractAbi, contractByteCode);
    const contract = await factory.deploy(address, endingTime, fee, candidatesNum);
    
    await contract.waitForDeployment()
    setSmartContract(contract);

    console.log(contract.address);
    console.log(contract.deployTransaction);
  }

    
  const deploy = () => {
    StartElection();
  }

  return (
    <div className="App">

    <header onclick="window.location.href='index.html'">
        <h1>SecElect</h1>
        <h2>A Blockchain Alternative To Hosting Secure Elections</h2>
    </header>

    <section>
        <h2>Create Your Election Entirely for Free</h2>
        <div class="user-input">
            <label for="inputDate">Enter Election End Date (Unix Timestamp):</label>
            <input type="text" id="inputDate" placeholder="Enter Unix Timestamp" required/>
            <button onclick="convertUnixTimestamp()">Convert to Date and Time</button>
        </div>
        <div class="user-input">
            <label for="input2">Enter the Entrance Fee for Candidates:</label>
            <input type="number" id="input2" required/>
        </div>
        <div class="user-input">
            <label for="input3">Enter the Max Number of Candidates:</label>
            <input type="number" id="input3" required/>
        </div>
        <div class="user-input">
            <label for="inputAddress">Enter Your Public Address:</label>
            <input type="text" id="inputAddress" placeholder="Your Public Address" required/>
        </div>
        <button onclick="updateHeading()">Create Election</button>
        <h3 id="resultHeading"></h3>
        <p id="errorMessages" class="error"></p>
    </section>

    <section>
        <h2>Run in an Election</h2>
        <h3>Some Elections May Have Entrance Fees</h3>
        <input type="text" placeholder="Confirm Your Address"/>
        <button>Run in Election</button>
    </section>

    <section>
        <h2>Vote in an Election</h2>
        <h3>You Have a Total of 10 Votes</h3>
        <input type="text" placeholder="Enter Address"/>
        <input type="text" placeholder="Enter Number of Votes"/>
        <button>Cast Your Vote</button>
    </section>
    </div>
  );
}

export default App;
