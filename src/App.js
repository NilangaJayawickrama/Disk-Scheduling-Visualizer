import React, { useState } from "react";

import Controls from "./components/Controls";
import Visualizer from "./components/Visualizer";
import DiskTrack from "./components/DiskTrack";

import {
  FCFS,
  SSTF,
  SCAN,
  CSCAN,
  LOOK,
  CLOOK,
} from "./algorithms/diskAlgorithms";

import "./App.css";

function App() {
  const [head, setHead] = useState(50);
  const [requests, setRequests] = useState("");
  const [algorithm, setAlgorithm] = useState("FCFS");

  const [path, setPath] = useState([]);
  const [seek, setSeek] = useState(0);
  const [comparison, setComparison] = useState({});

  const parseRequests = () =>
    requests.split(",").map((x) => parseInt(x.trim()));

  const runSimulation = () => {
    let req = parseRequests();
    let result;

    if (algorithm === "FCFS") result = FCFS(head, req);
    if (algorithm === "SSTF") result = SSTF(head, req);
    if (algorithm === "SCAN") result = SCAN(head, req);
    if (algorithm === "C-SCAN") result = CSCAN(head, req);
    if (algorithm === "LOOK") result = LOOK(head, req);
    if (algorithm === "C-LOOK") result = CLOOK(head, req);

    console.log(result);
    setPath(result.sequence);
    setSeek(result.seek);
  };

  const runComparison = () => {
    let req = parseRequests();

    let results = {
      FCFS: FCFS(head, req).seek,
      SSTF: SSTF(head, req).seek,
      SCAN: SCAN(head, req).seek,
      "C-SCAN": CSCAN(head, req).seek,
      LOOK: LOOK(head, req).seek,
      "C-LOOK": CLOOK(head, req).seek,
    };

    setComparison(results);
  };

  return (
    <div className="app">
      <h1>💽 Disk Scheduling Visualizer</h1>

      <Controls
        head={head}
        setHead={setHead}
        requests={requests}
        setRequests={setRequests}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        run={runSimulation}
        compare={runComparison}
      />

      <h2>Total Seek Time: {seek}</h2>

      <Visualizer path={path} />

      <DiskTrack path={path} />

      <h2>Algorithm Comparison</h2>

      <table className="compare">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Seek Time</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(comparison).map(([algo, value]) => (
            <tr key={algo}>
              <td>{algo}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
