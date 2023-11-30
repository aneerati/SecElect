import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import { getWalletObjs } from './Wallet';
import { ContractFactory } from 'ethers';
import tokenJson from "./ElecToken.json";
import { Contract } from 'hardhat/internal/hardhat-network/stack-traces/model';

function App() {

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [connected, setConnected] = useState(false)
  const [factory, setFactory] = useState(null);
  const [electionContract, setSmartContract] = useState(null);

  const [tokenContract, setTokenContract] = useState(null);

  const [entranceFee, setEntranceFee] = useState(10);

  const setUpWallet = () => {
      getWalletObjs().then((result) => {
          
          setProvider(result.provider)
          setSigner(result.signer)
          setFactory(result.contractFactory)
          //setSmartContract(result.smartContract)

          

          if (result.signer == null) {
              
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
      var candidate = document.getElementById('candidate').value;
      var amount = document.getElementById('amount').value;

      electionContract.vote.populateTransaction(candidate, amount).then((result) => {
        try {
          signer.sendTransaction(result);
        } catch {

        }
      });
  }

  const run = (candidate, value) => {
      electionContract.enterRace.populateTransaction({
        value: entranceFee
      }).then((result) => {
        try {
          signer.sendTransaction(result);
        } catch {

        }
      });
  }

  function allowance() {

    var amount = document.getElementById('allowance_amount').value;

    tokenContract.approve(electionContract.address, amount).then((result) => {
      signer.sendTransaction(result)
    });
  }

  function distributeToken() {
    var address = document.getElementById('distribute_address').value;
    var amount = document.getElementById('distribute_amount').value;

    electionContract.distributeToken(address, candidate).then((result) => {
      signer.sendTransaction(result)
    });
  }

  async function StartElection() {
    var endDate = document.getElementById('endDate').value;
    var fee = document.getElementById('fee').value;
    var candidatesNum = document.getElementById('candidatesNum').value;
    var address = document.getElementById('address').value;

    console.log(endDate, fee, candidatesNum, address);
   //try {
      const contract = await factory.deploy(address, endDate, fee, candidatesNum);
      
      await contract.waitForDeployment()
      setSmartContract(contract);

      let tokenAddress = await electionContract.getTokenAddress();

      let tokenContractFactory = new ContractFactory(tokenJson.abi, tokenJson.bytecode);

      let tokenContract = tokenContractFactory.attach(tokenAddress);

      setTokenContract(tokenContract)

      setEntranceFee(fee);

      console.log(contract.target);
      console.log(contract.deployTransaction);
    //} catch {

    //}
    
  }

  const deploy = () => {
    StartElection();
  }

  const winner = async () => {
    try {
      var button = document.getElementById("winner-label");
      var section = button.parentElement;
      
      var winnerText = document.createElement("p");
      winnerText.innerHTML = await electionContract.winner();
      
      section.replaceChild(winnerText, button);
    } catch {
    }
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
    if (!/^\d+$/.test(endDate)) {
        errorMessages.textContent = 'Please enter a valid Unix timestamp.';
        return;
    }

    // Convert Unix timestamp to human-readable date and time
    var date = new Date(endDate * 1000);

    resultHeading.textContent = 'Converted Date and Time: ' + date.toLocaleString();

    StartElection()
  }

  return (
    <div className="App">

    <header onclick="">
        <h1>SecElect</h1>
        <h2>A Blockchain Alternative To Hosting Secure Elections</h2>
    </header>

    <section>
        <h2>Create Your Election Entirely for Free</h2>
        <div class="user-input">
            <label for="endDate">Enter Election End Date (Unix Timestamp):</label>
            <input type="text" id="endDate" placeholder="Enter Unix Timestamp" required/>
            <button onClick="">Convert to Date and Time</button>
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
        <button onClick={() => updateHeading()}>Create Election</button>
        <h3 id="resultHeading"></h3>
        <p id="errorMessages" class="error"></p>
    </section>

    <section>
        <h2>Run in an Election</h2>
        <h3>Some Elections May Have Entrance Fees</h3>
        
        <button onClick={() => run()}>Run in Election</button>
    </section>

    <section>
        <h2>Allowance</h2>
        <input type="text" id="allowance_amount" placeholder="Enter Amount"/>
        <button onClick={() => allowance()}>Allowance</button>
    </section>

    <section>
        <h2>Distribute Token</h2>
        <input type="text" id="distribute_address" placeholder = "Enter Address to Distribute"/>
        <input type="text" id="distribute_amount" placeholder = "Enter Amount to Distribute"/>
        <button onClick={() => distributeToken()}>Distribute</button>
    </section>

    <section>
        <h2>Vote in an Election</h2>
        <h3>You Have a Total of 10 Votes</h3>
        <input type="text" id="candidate" placeholder="Enter Address"/>
        <input type="text" id ="amount" placeholder="Enter Number of Votes"/>
        <button onClick={() => vote()}>Cast Your Vote</button>
    </section>

    <section>
        <h2>Reveal Winner</h2>
        <button id="winner-label" onClick={() => winner()}>Reveal Election Winner</button>
    </section>
    </div>
  );
}

export default App;
