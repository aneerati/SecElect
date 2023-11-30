import logo from './logo.svg';
import './App.css';

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
          setSmartContract(result.smartContract)

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

  }

  const run = () => {

  }

  const deploy = () => {

  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;