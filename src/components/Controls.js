function Controls({
  head,
  setHead,
  requests,
  setRequests,
  diskSize,
  setDiskSize,
}) {
  return (
    <div className="controls">
      <div className="field">
        <label>Head Position</label>
        <input
          type="number"
          value={head}
          onChange={(e) => setHead(Number(e.target.value))}
        />
      </div>

      <div className="field">
        <label>Disk Size</label>
        <select
          value={diskSize}
          onChange={(e) => setDiskSize(Number(e.target.value))}
        >
          <option value={200}>0 – 199</option>
          <option value={500}>0 – 499</option>
          <option value={1000}>0 – 999</option>
        </select>
      </div>

      <div className="field">
        <label>Disk Requests</label>
        <input
          className="padding: 5px"
          value={requests}
          onChange={(e) => setRequests(e.target.value)}
          placeholder="98,183,37,122"
        />
      </div>
    </div>
  );
}

export default Controls;
