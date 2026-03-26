import React from "react";

function Controls({
  head,
  setHead,
  requests,
  setRequests,
  algorithm,
  setAlgorithm,
  run,
  compare,
}) {
  return (
    <div>
      <label>Head Position</label>
      <br />

      <input
        type="number"
        value={head}
        onChange={(e) => setHead(Number(e.target.value))}
      />

      <br />

      <label>Disk Requests</label>
      <br />

      <input
        value={requests}
        onChange={(e) => setRequests(e.target.value)}
        placeholder="98,183,37,122"
      />

      <br />

      <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
        <option>FCFS</option>
        <option>SSTF</option>
        <option>SCAN</option>
        <option>C-SCAN</option>
        <option>LOOK</option>
        <option>C-LOOK</option>
      </select>

      <br />

      <button onClick={run}>Run Simulation</button>

      <button onClick={compare}>Compare Algorithms</button>
    </div>
  );
}

export default Controls;
