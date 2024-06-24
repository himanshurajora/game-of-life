import "./style.css";

const app = document.getElementById("app");
const canvas = document.createElement("canvas");

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

canvas.width = windowWidth;
canvas.height = windowHeight;

if (app) app.appendChild(canvas);

const context = canvas.getContext("2d")!;

// grid size 100 equal segments of width
const gridSize = windowWidth / 100;

function drawGrid() {
  context.strokeStyle = "white";
  context.lineWidth = 1;

  // stoke width
  for (let x = 0; x < windowWidth; x += gridSize) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, windowHeight);
    context.stroke();
  }

  for (let y = 0; y < windowHeight; y += gridSize) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(windowWidth, y);
    context.stroke();
  }
}

function paintCell(x: number, y: number) {
  context.strokeStyle = "black";
  context.fillStyle = "yellow";
  context.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

let cells: [number, number][] = [
  [30, 30],
  [30, 31],
  [30, 32],
  [31, 30],
  [31, 31],
  [31, 32],
  [32, 30],
  [32, 31],
  [32, 32],
  [32, 33],
  [32, 34],

];

const calculateNextGeneration = (cells: [number, number][]) => {
  // check for each cell if it should be alive or dead
  const nextGeneration: [number, number][] = [];
  for (let x = 0; x < 100; x++) {
    for (let y = 0; y < 100; y++) {
      const neighbors = [
        [x - 1, y - 1],
        [x, y - 1],
        [x + 1, y - 1],
        [x - 1, y],
        [x + 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1],
      ];

      // check if the current cell is alive
      const isAlive = cells.some(
        ([cellX, cellY]) => cellX === x && cellY === y
      );

      const aliveNeighbors = neighbors.filter(([x, y]) => {
        return cells.some(([cellX, cellY]) => cellX === x && cellY === y);
      });

      // if has less than 2 neighbors, it dies
      if (aliveNeighbors.length < 2) {
        continue;
      }

      // if the current cell is alive and has 2 or 3 neighbors, it stays alive
      if (
        isAlive &&
        (aliveNeighbors.length === 2 || aliveNeighbors.length === 3)
      ) {
        nextGeneration.push([x, y]);
      }

      // if it has more than 3 neighbors, it dies
      if (aliveNeighbors.length > 3) {
        continue;
      }

      // if the current cell is dead and has 3 neighbors, it becomes alive
      if (!isAlive && aliveNeighbors.length === 3) {
        nextGeneration.push([x, y]);
      }
    }
  }

  return nextGeneration;
};

function render() {
  context.fillStyle = "black";
  context.fillRect(0, 0, windowWidth, windowHeight);

  cells.forEach(([x, y]) => {
    paintCell(x, y);
  });

  cells = calculateNextGeneration(cells);

  drawGrid();

  requestAnimationFrame(render)
}

render();
