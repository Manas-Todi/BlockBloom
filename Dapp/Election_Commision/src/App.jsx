import { useState } from "react";
import { Contract, BrowserProvider } from "ethers";
import { abi, contractAdress as contractAddress } from "./Election.json";

function App() {
  const [output, setOutput] = useState("");
  const [queryRollNumber, setQueryRollNumber] = useState(0);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    rollNumber: 0,
  });
  const [allCandidates, setAllCandidates] = useState([]);

  const provider = new BrowserProvider(window.ethereum);

  const connectMetamask = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected. Please install MetaMask.");
      return;
    }
    const signer = await provider.getSigner();
    alert(`Connected to MetaMask with address: ${await signer.getAddress()}`);
  };

  const addCandidate = async (event) => {
    event.preventDefault();
    const signer = await provider.getSigner();
    const instance = new Contract(contractAddress, abi, signer);

    await instance.Add_Candidate(newCandidate.name, newCandidate.rollNumber);
    alert("Candidate added successfully!");
  };

  const vote = async () => {
    const signer = await provider.getSigner();
    const instance = new Contract(contractAddress, abi, signer);

    await instance.vote(queryRollNumber);
    alert("Vote cast successfully!");
  };

  const getCandidateVotes = async () => {
    const signer = await provider.getSigner();
    const instance = new Contract(contractAddress, abi, signer);

    const votes = await instance.Votes_for_candidate(queryRollNumber);
    setOutput(`Roll Number ${queryRollNumber} has ${votes} votes.`);
  };

  const fetchAllCandidates = async () => {
    const signer = await provider.getSigner();
    const instance = new Contract(contractAddress, abi, signer);

    const candidates = await instance.Show_all_candidates();
    setAllCandidates(
      candidates.map((candidate) => ({
        id: candidate.id.toString(),
        name: candidate.name,
        rollNumber: candidate.rollNumber.toString(),
        voteCount: candidate.voteCount.toString(),
      }))
    );
  };

  return (
    <div className="container">
      <header className="heading">
        <h1>Election DApp</h1>
      </header>

      <button onClick={connectMetamask}>Connect to Metamask</button>

      <form onSubmit={addCandidate}>
        <label>Candidate Name: </label>
        <input
          type="text"
          value={newCandidate.name}
          onChange={(e) =>
            setNewCandidate({ ...newCandidate, name: e.target.value })
          }
        />
        <label> Roll Number: </label>
        <input
          type="number"
          value={newCandidate.rollNumber}
          onChange={(e) =>
            setNewCandidate({
              ...newCandidate,
              rollNumber: parseInt(e.target.value),
            })
          }
        />
        <button type="submit">Add Candidate </button>
      </form>

      <div>
        <label>Enter Roll Number to Vote: </label>
        <input
          type="number"
          value={queryRollNumber}
          onChange={(e) => setQueryRollNumber(parseInt(e.target.value))}
        />
        <button onClick={vote}>Vote</button>
      </div>

      <div>
        <label>Enter Roll Number to check votes: </label>
        <input
          type="number"
          value={queryRollNumber}
          onChange={(e) => setQueryRollNumber(parseInt(e.target.value))}
        />
        <button onClick={getCandidateVotes}>Get Votes</button>
      </div>
      <p>{output}</p>

      <div className="list-container">
        <h2>All Candidates</h2>
        <button onClick={fetchAllCandidates}>Fetch All Candidates</button>
        <ul>
          {allCandidates.map((candidate, index) => (
            <li key={index}>
              <strong> {candidate.name}</strong>
              <span> | Roll No: {candidate.rollNumber}</span>
              <span> | Votes: {candidate.voteCount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
