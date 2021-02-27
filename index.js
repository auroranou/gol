/**
 * Rules
 * 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
 * 2. Any live cell with two or three live neighbours lives on to the next generation.
 * 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
 * 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 */

function makeData() {
  const rows = [...Array(20)].map((_, i) => i);
  return rows.map((r, i) => {
    const cols = [...Array(20)].map((_, j) => j);
    const cells = cols.map((c, j) => {
      const isLive = Math.random() < 0.5;
      return {
        generation: isLive ? 1 : 0,
        isLive
      }
    });
    return cells;
  });
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
  const data = makeData();
  populateHtml(data);
}

init();