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
  const nextGeneration: [number, number][] = [];
  const cellMap: Map<string, number> = new Map();

  for (const [x, y] of cells) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;

        const neighborX = x + i;
        const neighborY = y + j;
        const key = `${neighborX},${neighborY}`;

        if (cellMap.has(key)) {
          cellMap.set(key, cellMap.get(key)! + 1);
        } else {
          cellMap.set(key, 1);
        }
      }
    }
  }

  for (const [key, count] of cellMap) {
    const [x, y] = key.split(",").map(Number);

    if (
      count === 3 ||
      (count === 2 &&
        cells.some(([cellX, cellY]) => cellX === x && cellY === y))
    ) {
      nextGeneration.push([x, y]);
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

  requestAnimationFrame(render);
}

render();
