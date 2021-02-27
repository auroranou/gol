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
  return rows.map((r, i) => {
    const cols = [...Array(dimension)].map((_, j) => j);
    const cells = cols.map((c, j) => {
      const isLive = Math.random() < 0.33;
      return {
        generation: isLive ? 1 : 0,
        isLive
      }
    });
    return cells;
  });
}

function tick(state) {
  const nextState = [];

  state.forEach((row, rowIdx) => {
    nextState[rowIdx] = [];

    row.forEach((cell, cellIdx) => {
      const nextCellState = getNextCellState(rowIdx, cellIdx, cell);
      nextState[rowIdx][cellIdx] = nextCellState;
    });
  });

  return nextState;
}

function getNextCellState(rowIdx, cellIdx, cell) {
  const liveNeighborCount = getLiveNeighbors(rowIdx, cellIdx);
  if (cell.isLive) {
    if (liveNeighborCount < 2 || liveNeighborCount > 3) {
      return {
        isLive: false,
        generation: 0
      }
    } else if (liveNeighborCount === 2 || liveNeighborCount === 3) {
      return {
        isLive: true,
        generation: cell.generation + 1
      }
    } else {
      return cell;
    }
  } else {
    if (liveNeighborCount === 3) {
      return {
        isLive: true,
        generation: 1
      }
    } else {
      return cell;
    }
  }
}

function getLiveNeighbors(rowIdx, cellIdx) {
  let neighbors = {
    left: state[rowIdx][cellIdx - 1] ?? undefined,
    right: state[rowIdx][cellIdx + 1] ?? undefined,
  };

  if (state[rowIdx - 1]) {
    neighbors = {...neighbors,
      topLeft: state[rowIdx - 1] ? state[rowIdx-1][cellIdx - 1] : undefined,
      top: state[rowIdx - 1] ? state[rowIdx-1][cellIdx] : undefined,
      topRight: state[rowIdx - 1] ? state[rowIdx-1][cellIdx + 1] : undefined,
    }
  }

  if (state[rowIdx + 1]) {
    neighbors = {...neighbors,
      bottomLeft: state[rowIdx + 1] ? state[rowIdx + 1][cellIdx - 1] : undefined,
      bottom: state[rowIdx + 1] ? state[rowIdx + 1][cellIdx] : undefined,
      bottomRight: state[rowIdx + 1] ? state[rowIdx + 1][cellIdx + 1] : undefined,
    }
  }

  return Object.values(neighbors).reduce((acc, curr) => {
    return curr?.isLive ? acc + 1 : acc;
  }, 0);
}

function populateHtml(data) {
  const container = document.getElementById('container');
  if (!container) {
    return;
  }

  data.forEach((row, i) => {
    const rowElem = document.createElement('div');
    rowElem.id = `row-${i}`;
    rowElem.classList.add('row');
    container.appendChild(rowElem);

    row.forEach((cell, j) => {
      const cellElem = document.createElement('span');
      cellElem.id = `cell-${i}-${j}`;
      cellElem.classList.add('cell', getCellClassName(cell));
      rowElem.appendChild(cellElem);
    });
  });

  return container;
}

function updateHtml(data) {
  data.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellElem = document.getElementById(`cell-${i}-${j}`);
      cellElem.setAttribute('class', `cell ${getCellClassName(cell)}`);
    });
  });
}

function getCellClassName({generation, isLive}) {
  if (!isLive) {
    return 'dead';
  }

  if (generation === 1) {
    return 'seedling'; // code point 127793
  } else if (generation === 2) {
    return 'leaves'; // 127807
  } else if (generation >= 3) {
    return 'tree'; // 127795
  }
}


function init() {
  state = makeData();
  populateHtml(state);
}

document.getElementById('tick-btn').addEventListener('click', function(e) {
  e.preventDefault();

  const nextState = tick(state);
  state = nextState;
  updateHtml(nextState);
});

init();