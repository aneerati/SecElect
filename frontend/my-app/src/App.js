import logo from './logo.svg';
import './App.css';
import {useState} from 'React';
import { getWalletObjs } from './Wallet';
import { ContractFactory } from 'ethers';


function App() {

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [connected, setConnected] = useState(false)
  const [factory, setFactory] = useState(null);
  const [electionContract, setSmartContract] = useState(null);

  const [entranceFee, setEntranceFee] = useState(10);

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

  const run = (candidate, value) => {
      electionContract.enterRace.populateTransaction({
        value: entranceFee
      }).then((result) => {
        provider.sendTransaction(result);
      });
  }

  async function StartElection() {
    var endDate = document.getElementById('endDate').value;
    var fee = document.getElementById('fee').value;
    var candidatesNum = document.getElementById('candidatesNum').value;
    var address = document.getElementById('address').value;
    
    const contract = await factory.deploy(address, endDate, fee, candidatesNum);
    
    await contract.waitForDeployment()
    setSmartContract(contract);

    console.log(contract.address);
    console.log(contract.deployTransaction);
  }

    
  const deploy = () => {
    StartElection();
  }

  const updateHeading = () => {
    var endDate = document.getElementById('endDate').value;
    var fee = document.getElementById('fee').value;
    var candidatesNum = document.getElementById('candidatesNum').value;
    var resultHeading = document.getElementById('resultHeading');
    var errorMessages = document.getElementById('errorMessages');
    var address = document.getElementById('address').value;

    // Clear previous error messages
    errorMessages.textContent = '';

    // Validate Unix timestamp input
    if (!/^\d+$/.test(inputDate)) {
        errorMessages.textContent = 'Please enter a valid Unix timestamp.';
        return;
    }

    // Convert Unix timestamp to human-readable date and time
    var date = new Date(inputDate * 1000);

    resultHeading.textContent = 'Converted Date and Time: ' + date.toLocaleString();
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
            <label for="endDate">Enter Election End Date (Unix Timestamp):</label>
            <input type="text" id="endDate" placeholder="Enter Unix Timestamp" required/>
            <button onclick="convertUnixTimestamp()">Convert to Date and Time</button>
        </div>
        <div class="user-input">
            <label for="fee">Enter the Entrance Fee for Candidates:</label>
            <input type="number" id="fee" required/>
        </div>
        <div class="user-input">
            <label for="candidatesNum">Enter the Max Number of Candidates:</label>
            <input type="number" id="candidatesNum" required/>
        </div>
        <div class="user-input">
            <label for="address">Enter Your Public Address:</label>
            <input type="text" id="address" placeholder="Your Public Address" required/>
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
