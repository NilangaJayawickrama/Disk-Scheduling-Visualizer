import React, { useState, useEffect } from "react";

function DiskTrack({ path, setCurrentStep, diskSize }) {
  const [position, setPosition] = useState(0);
  const [visited, setVisited] = useState([]);

  const maxTrack = diskSize - 1;

  const clamp = (val) => Math.min(Math.max(val, 0), maxTrack);
  const safeVisited = visited.filter((v) => typeof v === "number");

  useEffect(() => {
    if (!path.length) return;

    let i = 0;
    setPosition(path[0] ?? 0);
    setVisited([path[0] ?? 0]);
    setCurrentStep(0);

    const interval = setInterval(() => {
      i++;

      if (i >= path.length) {
        clearInterval(interval);
        return;
      }

      setPosition(path[i]);
      setVisited((prev) => [...prev, path[i]]);
      setCurrentStep(i);
    }, 600);

    return () => clearInterval(interval);
  }, [path, setCurrentStep, diskSize]);

  return (
    <div style={{ marginTop: "30px", width: "100%" }}>
      <h3 style={{ textAlign: "center" }}>Disk Track</h3>

      <div style={{ position: "relative", width: "100%", height: "70px" }}>
        {/* BASE LINE */}
        <div
          style={{
            position: "absolute",
            top: "35px",
            left: 0,
            right: 0,
            height: "3px",
            background: "#64748b",
          }}
        />

        {/* 🔥 VISITED PATH (trail) */}
        {visited.length > 1 && (
          <div
            style={{
              position: "absolute",
              top: "35px",
              left: `${(Math.min(...safeVisited) / maxTrack) * 100}%`,
              width: `${((Math.max(...safeVisited) - Math.min(...safeVisited)) / maxTrack) * 100}%`,
              height: "3px",
              background: "#00bcd4",
              transition: "all 0.5s ease",
            }}
          />
        )}

        {/* 🔥 REQUEST POINTS */}
        {path.map((req, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(clamp(req) / maxTrack) * 100}%`,
              top: "30px",
              transform: "translateX(-50%)",
              width: "8px",
              height: "8px",
              background: "#22c55e",
              borderRadius: "50%",
            }}
          />
        ))}

        {/* 🔥 TICKS */}
        {[...Array(11)].map((_, i) => {
          const step = maxTrack / 10;
          const value = Math.round(i * step);

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${(value / maxTrack) * 100}%`,
                top: "35px",
                transform: "translateX(-50%)",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "12px",
              }}
            >
              <div
                style={{
                  height: "10px",
                  width: "2px",
                  background: "#94a3b8",
                  margin: "0 auto",
                }}
              />
              {value}
            </div>
          );
        })}

        {/* 🔥 DIRECTION ARROWS */}
        {visited.map((val, i) => {
          if (i === 0) return null;

          const prev = visited[i - 1];
          const isRight = val > prev;

          return (
            <div
              key={`arrow-${i}`}
              style={{
                position: "absolute",
                left: `${(clamp(prev) / maxTrack) * 100}%`,
                top: "10px",
                transform: "translateX(-50%)",
                color: "#facc15",
                fontSize: "12px",
              }}
            >
              {isRight ? "→" : "←"}
            </div>
          );
        })}

        {/* 🔥 HEAD */}
        <div
          style={{
            position: "absolute",
            left: `${(clamp(position) / maxTrack) * 100}%`,
            top: "28px",
            transform: "translateX(-50%)",
            width: "14px",
            height: "14px",
            background: "#ef4444",
            borderRadius: "50%",
            transition: "left 0.5s ease",
            boxShadow: "0 0 8px rgba(239,68,68,0.8)",
          }}
        />
      </div>

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Current Cylinder: {position}
      </p>
    </div>
  );
}

export default DiskTrack;
