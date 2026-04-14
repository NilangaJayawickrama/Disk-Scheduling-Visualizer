import React, { useState, useEffect } from "react";

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
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);

  const [head, setHead] = useState(50);
  const [requests, setRequests] = useState("");
  const [algorithm, setAlgorithm] = useState("FCFS");

  const [path, setPath] = useState([]);
  const [seek, setSeek] = useState(0);
  const [comparison, setComparison] = useState({});

  useEffect(() => {
  const socket = new WebSocket("ws://localhost:8080");

  socket.onopen = () => {
    console.log("Connected to server");
    setConnected(true);
  };

  socket.onmessage = (event) => {
    console.log("From server:", event.data);

    const data = JSON.parse(event.data);
    setPath(data.sequence);
    setSeek(data.total);
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

  socket.onclose = () => {
    console.log("Disconnected");
    setConnected(false);
  };

  setWs(socket);

  return () => socket.close();
}, []);

  const parseRequests = () =>
    requests.split(",").map((x) => parseInt(x.trim()));

  // const runSimulation = () => {
  //   let req = parseRequests();
  //   let result;

  //   if (algorithm === "FCFS") result = FCFS(head, req);
  //   if (algorithm === "SSTF") result = SSTF(head, req);
  //   if (algorithm === "SCAN") result = SCAN(head, req);
  //   if (algorithm === "C-SCAN") result = CSCAN(head, req);
  //   if (algorithm === "LOOK") result = LOOK(head, req);
  //   if (algorithm === "C-LOOK") result = CLOOK(head, req);

  //   console.log(result);
  //   setPath(result.sequence);
  //   setSeek(result.seek);
  // };

  const runSimulation = () => {
      let req = parseRequests();

      if (!ws || ws.readyState !== 1) {
        alert("WebSocket not connected");
        return;
      }

      // 🔥 map algorithm name → number (important!)
      const algoMap = {
        FCFS: 0,
        SSTF: 1,
        SCAN: 2,
        "C-SCAN": 3,
        LOOK: 4,
        "C-LOOK": 5,
      };

      const data = {
        head: head,
        requests: req,
        algo: algoMap[algorithm],
      };

      console.log("📤 Sending to server:", data);

      ws.send(JSON.stringify(data));
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
        serverConnected={connected}
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
