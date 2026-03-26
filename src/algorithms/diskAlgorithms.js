const calculateSeek = (sequence) => {
  let seek = 0;

  for (let i = 0; i < sequence.length - 1; i++) {
    seek += Math.abs(sequence[i] - sequence[i + 1]);
  }

  return seek;
};

//FCFS (First Come First Serve)
//Processes requests in the exact order they arrive
export const FCFS = (head, requests) => {
  const sequence = [head, ...requests];
  const seek = calculateSeek(sequence);

  return { sequence, seek };
};

// SSTF (Shortest Seek Time First)
//Always selects the closest request to the current head position
export const SSTF = (head, requests) => {
  let remaining = [...requests];
  let current = head;
  let sequence = [head];

  while (remaining.length > 0) {
    let closestIndex = 0;
    let minDist = Math.abs(current - remaining[0]);

    for (let i = 1; i < remaining.length; i++) {
      let dist = Math.abs(current - remaining[i]);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    }

    current = remaining[closestIndex];
    sequence.push(current);
    remaining.splice(closestIndex, 1);
  }

  const seek = calculateSeek(sequence);
  return { sequence, seek };
};

// SCAN (Elevator)
// Disk head moves in one direction first
// Services all requests along the way
// When it reaches the end → reverses direction
export const SCAN = (head, requests, diskSize = 200, direction = "right") => {
  let left = requests.filter((r) => r < head).sort((a, b) => b - a);  //Order by decending order
  let right = requests.filter((r) => r >= head).sort((a, b) => a - b); //order by acending order

  let sequence = [head];

  if (direction === "right") {
    sequence.push(...right);
    sequence.push(diskSize - 1);
    sequence.push(...left);
  } else {
    sequence.push(...left);
    sequence.push(0);
    sequence.push(...right);
  }

  const seek = calculateSeek(sequence);
  return { sequence, seek };
};

// C-SCAN (Circular SCAN)
// Moves in only one direction
// After reaching the end → jumps back to the start
// Continues in same direction
export const CSCAN = (head, requests, diskSize = 200) => {
  let left = requests.filter((r) => r < head).sort((a, b) => a - b); //order by acending order
  let right = requests.filter((r) => r >= head).sort((a, b) => a - b); //order by acending order

  let sequence = [head];

  sequence.push(...right);
  sequence.push(diskSize - 1);
  sequence.push(0);
  sequence.push(...left);

  const seek = calculateSeek(sequence);
  return { sequence, seek };
};

// LOOK (Smart SCAN) - Same as scan
// Disk head moves in one direction first
// Services all requests along the way
// Stops at last request, then reverses
export const LOOK = (head, requests, direction = "right") => {
  let left = requests.filter((r) => r < head).sort((a, b) => b - a);
  let right = requests.filter((r) => r >= head).sort((a, b) => a - b);

  let sequence = [head];

  if (direction === "right") {
    sequence.push(...right);
    sequence.push(...left);
  } else {
    sequence.push(...left);
    sequence.push(...right);
  }

  const seek = calculateSeek(sequence);
  return { sequence, seek };
};

// C-LOOK (Smart circular/Smart Elevator) - Same as C-SCAN
// Moves in only one direction
// Jumps from highest request → lowest request
// Continues in same direction
export const CLOOK = (head, requests) => {
  let left = requests.filter((r) => r < head).sort((a, b) => a - b);
  let right = requests.filter((r) => r >= head).sort((a, b) => a - b);

  let sequence = [head];

  sequence.push(...right);
  sequence.push(...left);

  const seek = calculateSeek(sequence);
  return { sequence, seek };
};
