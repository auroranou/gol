/**
 * Rules
 * 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
 * 2. Any live cell with two or three live neighbours lives on to the next generation.
 * 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
 * 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 */

const dimension = 20;
let state;

function makeData() {
  const rows = [...Array(dimension)].map((_, i) => i);
  return rows.map(() => {
    const cols = [...Array(dimension)].map((_, j) => j);
    return cols.map(() => {
      const isLive = Math.random() < 0.33;
      return {
        generation: isLive ? 1 : 0,
      };
    });
  });
}

function tick(state) {
  const nextState = [];

  state.forEach((row, rowIdx) => {
    nextState[rowIdx] = [];

    row.forEach((cell, cellIdx) => {
      nextState[rowIdx][cellIdx] = getNextCellState(rowIdx, cellIdx, cell);
    });
  });

  return nextState;
}

function getNextCellState(rowIdx, cellIdx, cell) {
  const liveNeighborCount = countLiveNeighbors(rowIdx, cellIdx);
  if (cell.generation > 0) {
    if (liveNeighborCount < 2 || liveNeighborCount > 3) {
      return { generation: 0 };
    } else if (liveNeighborCount === 2 || liveNeighborCount === 3) {
      return { generation: cell.generation + 1 };
    } else {
      return cell;
    }
  } else {
    if (liveNeighborCount === 3) {
      return { generation: 1 };
    } else {
      return cell;
    }
  }
}

function countLiveNeighbors(rowIdx, cellIdx) {
  let neighbors = {
    left: state[rowIdx][cellIdx - 1],
    right: state[rowIdx][cellIdx + 1],
  };

  if (state[rowIdx - 1]) {
    neighbors = {
      ...neighbors,
      topLeft: state[rowIdx - 1][cellIdx - 1],
      top: state[rowIdx - 1][cellIdx],
      topRight: state[rowIdx - 1][cellIdx + 1],
    };
  }

  if (state[rowIdx + 1]) {
    neighbors = {
      ...neighbors,
      bottomLeft: state[rowIdx + 1][cellIdx - 1],
      bottom: state[rowIdx + 1][cellIdx],
      bottomRight: state[rowIdx + 1][cellIdx + 1],
    };
  }

  return Object.values(neighbors).reduce(
    (acc, curr) => (curr?.generation > 0 ? acc + 1 : acc),
    0
  );
}

function populateHtml(data) {
  const container = document.getElementById("container");

  data.forEach((row, i) => {
    const rowElem = document.createElement("div");
    rowElem.id = `row-${i}`;
    rowElem.classList.add("row");
    container.appendChild(rowElem);

    row.forEach((cell, j) => {
      const cellElem = document.createElement("span");
      cellElem.id = `cell-${i}-${j}`;
      cellElem.classList.add("cell", getCellClassName(cell));
      rowElem.appendChild(cellElem);
    });
  });

  return container;
}

function updateHtml(data) {
  data.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellElem = document.getElementById(`cell-${i}-${j}`);
      cellElem.setAttribute("class", `cell ${getCellClassName(cell)}`);
    });
  });
}

function getCellClassName({ generation }) {
  if (generation == 0) {
    return "dead";
  }

  return `gen-${Math.min(generation, 6)}`;
}

function init() {
  state = makeData();
  populateHtml(state);
}

const playBtn = document.getElementById("play-btn");
const autoPlayBtn = document.getElementById("autoplay-btn");
const stopBtn = document.getElementById("stop-btn");

playBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const nextState = tick(state);
  state = nextState;
  updateHtml(nextState);
});

let autoplayInterval;
autoPlayBtn.addEventListener("click", function (e) {
  e.preventDefault();

  autoPlayBtn.disabled = true;
  playBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");

  autoplayInterval = setInterval(function () {
    const nextState = tick(state);
    state = nextState;
    updateHtml(nextState);
  }, 1000);
});

stopBtn.addEventListener("click", function (e) {
  e.preventDefault();

  autoPlayBtn.disabled = false;
  playBtn.classList.remove("hidden");
  stopBtn.classList.add("hidden");

  clearInterval(autoplayInterval);
});

init();
