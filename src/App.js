import React, { useState, useEffect } from "react";

import Controls from "./components/Controls";
import Visualizer from "./components/Visualizer";
import DiskTrack from "./components/DiskTrack";
import BarChart from "./components/BarChart";

import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("simulation");

  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);

  const [head, setHead] = useState(50);
  const [requests, setRequests] = useState("");
  const [algorithm, setAlgorithm] = useState("FCFS");

  const [path, setPath] = useState([]);
  const [seek, setSeek] = useState(0);
  const [comparison, setComparison] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);

  const [diskSize, setDiskSize] = useState(200);

  const [hoverAlgo, setHoverAlgo] = useState(null);
  const [loadingCompare, setLoadingCompare] = useState(false);

  const getPerformanceMetrics = (comparison) => {
    if (!comparison) {
      return {
        metrics: {},
        bestAlgo: null,
        worstAlgo: null,
        bestValue: null,
      };
    }

    const entries = Object.entries(comparison);

    if (entries.length === 0) {
      return {
        metrics: {},
        bestAlgo: null,
        worstAlgo: null,
        bestValue: null,
      };
    }

    const sorted = [...entries].sort((a, b) => a[1] - b[1]);

    const bestAlgo = sorted[0]?.[0];
    const bestValue = sorted[0]?.[1];
    const worstAlgo = sorted[sorted.length - 1]?.[0];

    const metrics = Object.fromEntries(
      entries.map(([algo, value]) => {
        const ratio = bestValue ? value / bestValue : 0;

        return [
          algo,
          {
            value,
            ratio,
            isBest: algo === bestAlgo,
            isWorst: algo === worstAlgo,
          },
        ];
      }),
    );

    return { metrics, bestAlgo, worstAlgo, bestValue };
  };

  const safeComparison = comparison || {};
  const { metrics, bestAlgo } = getPerformanceMetrics(safeComparison);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("Connected to server");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("From server:", data);

      if (data.type === "single") {
        setPath(data.sequence);
        setSeek(data.total);
      }

      if (data.type === "compare") {
        setComparison(data.results || {});
        setLoadingCompare(false);
      }
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

  const runSimulation = () => {
    let req = parseRequests();

    if (!ws || ws.readyState !== 1) {
      alert("WebSocket not connected");
      return;
    }

    // map algorithm name → number
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
      diskSize: diskSize,
    };

    console.log("📤 Sending to server:", data);

    ws.send(JSON.stringify(data));
  };

  const runComparison = () => {
    let req = parseRequests();

    if (!ws || ws.readyState !== 1) {
      alert("WebSocket not connected");
      return;
    }

    setLoadingCompare(true);
    setComparison(null);

    const data = {
      head: head,
      requests: req,
      algo: 99,
      diskSize: diskSize,
    };

    console.log("📤 Sending to server:", data);

    ws.send(JSON.stringify(data));
  };

  const getValidationError = () => {
    const req = parseRequests();

    if (head < 0 || head >= diskSize) {
      return "Head position is out of disk range";
    }

    const invalidReq = req.find((r) => r < 0 || r >= diskSize);
    if (invalidReq !== undefined) {
      return `Request ${invalidReq} is out of disk range`;
    }

    return null;
  };

  const validationError = getValidationError();
  const isValidInput = !validationError && requests !== "";

  const hasComparisonData =
    comparison && Object.keys(comparison).length > 0;

  return (
    <div className="app">
      <h1 style={{ textAlign: "center" }}>Disk Scheduling Visualizer</h1>

      {/* INPUT SECTION */}
      <div className="top-controls">
        <Controls
          head={head}
          setHead={setHead}
          requests={requests}
          setRequests={setRequests}
          diskSize={diskSize}
          setDiskSize={setDiskSize}
        />
      </div>

      {/* TABS */}
      <div className="tabs">
        <button
          className={activeTab === "simulation" ? "active" : ""}
          onClick={() => setActiveTab("simulation")}
        >
          Simulation
        </button>

        <button
          className={activeTab === "compare" ? "active" : ""}
          onClick={() => {
            setActiveTab("compare");
            setLoadingCompare(true);
            setComparison(null);
            runComparison();
          }}
          disabled={!connected || !isValidInput}
          title={validationError || ""}
        >
          Compare Algorithms
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "simulation" && (
        <>
          <div className="simulation-panel">
            {/* LEFT SIDE */}
            <div className="left-panel">
              <div className="algo-controls">
                <label>Algorithm</label>

                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                >
                  <option>FCFS</option>
                  <option>SSTF</option>
                  <option>SCAN</option>
                  <option>C-SCAN</option>
                  <option>LOOK</option>
                  <option>C-LOOK</option>
                </select>

                <button
                  onClick={runSimulation}
                  disabled={!connected || !isValidInput || requests === ""}
                  title={validationError || ""}
                >
                  Run Simulation
                </button>

                {validationError && (
                  <div style={{ color: "#ef4444", marginTop: "10px" }}>
                    ⚠️ {validationError}
                  </div>
                )}
              </div>

              {/* 🔥 Disk Track moved here */}
              <DiskTrack
                path={path}
                setCurrentStep={setCurrentStep}
                diskSize={diskSize}
              />

              <div className="logs">
                <h3>Movement Logs</h3>

                {path.map((p, i) => {
                  if (i === 0) return null;

                  const dist = Math.abs(path[i] - path[i - 1]);

                  return (
                    <div
                      key={i}
                      style={{
                        color: i === currentStep ? "#00bcd4" : "white",
                        fontWeight: i === currentStep ? "bold" : "normal",
                      }}
                    >
                      {path[i - 1]} → {p} (Seek: {dist})
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="right-panel">
              <h2>Total Seek Time: {seek}</h2>
              <h3>Average Seek Time: {(seek / path.length).toFixed(2)}</h3>
              <Visualizer path={path} currentStep={currentStep} />
            </div>
          </div>
        </>
      )}

      {activeTab === "compare" && (
        <div className="compare-panel">
          <h2>Algorithm Comparison</h2>

          {/* 🔥 LOADER STATE */}
          {loadingCompare ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "250px",
                width: "100%",
              }}
            >
              <h3>⏳ Running comparison on xv6...</h3>
              <p>Please wait while kernel computes results</p>
            </div>
          ) : hasComparisonData ? (
            <div className="compare-layout">
              {/* LEFT: TABLE */}
              <div className="compare-table-wrapper">
                <table className="compare">
                  <thead>
                    <tr>
                      <th>Algorithm</th>
                      <th>Seek Time</th>
                      <th>Performance vs Best</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.entries(comparison).map(([algo, value]) => {
                      const data = metrics[algo];

                      return (
                        <tr
                          key={algo}
                          onMouseEnter={() => setHoverAlgo(algo)}
                          onMouseLeave={() => setHoverAlgo(null)}
                          style={{
                            backgroundColor: data.isBest
                              ? "rgba(34, 197, 94, 0.15)"
                              : data.isWorst
                                ? "rgba(239, 68, 68, 0.15)"
                                : hoverAlgo === algo
                                  ? "#1e293b"
                                  : "transparent",

                            borderLeft: data.isBest
                              ? "4px solid #22c55e"
                              : data.isWorst
                                ? "4px solid #ef4444"
                                : "4px solid transparent",

                            cursor: "pointer",
                          }}
                        >
                          <td>
                            {algo}
                            {data.isBest && " 🟢 Best"}
                            {data.isWorst && " 🔴 Worst"}
                          </td>

                          <td>{data.value}</td>

                          <td>
                            {data.isBest ? (
                              <span style={{ color: "#22c55e" }}>Baseline</span>
                            ) : (
                              <span
                                style={{ color: "#facc15", fontWeight: "bold" }}
                              >
                                {data.ratio.toFixed(2)}× slower
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* RIGHT: GRAPH */}
              <div className="compare-chart-wrapper">
                <BarChart
                  comparison={comparison}
                  hoverAlgo={hoverAlgo}
                  setHoverAlgo={setHoverAlgo}
                  bestAlgo={bestAlgo}
                  worstAlgo={
                    Object.keys(metrics).length > 0
                      ? Object.keys(metrics).reduce((a, b) =>
                        metrics[a]?.value > metrics[b]?.value ? a : b
                      )
                      : null
                  }
                />
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <p>No data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
