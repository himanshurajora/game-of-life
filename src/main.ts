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

function paintCell(x: number, y: number, color = "yellow") {
  context.strokeStyle = "black";
  context.fillStyle = color;
  context.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

let isStarted = false;

let isMouseDown = false;
let currentMousePosition: null | [number, number] = null;
let speed = 900;

let initialValue: [number, number][] = [
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
  [12, 12],
  [12, 13],
  [12, 14],
  [13, 12],
  [13, 13],
  [13, 14],
  [14, 12],
  [14, 13],
  [14, 14],
  [14, 15],
  [14, 16],
  [14, 17],
];

let cells: [number, number][] = initialValue;
  
const calculateNextGeneration = (cells: [number, number][]) => {
  const nextGeneration: [number, number][] = [];
  const cellMap: Map<string, number> = new Map();

  for (const [x, y] of cells) {
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
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

let lastRenderTime = performance.now();

function render() {
  const currentRenderTime = performance.now();
  context.fillStyle = "black";
  context.fillRect(0, 0, windowWidth, windowHeight);
  cells.forEach(([x, y]) => {
    paintCell(x, y);
  });

  if (currentMousePosition) {
    paintCell(...currentMousePosition, "red");
  }

  if (isStarted && speed > 0 && (currentRenderTime - lastRenderTime) > (1000 - speed)) {
    cells = calculateNextGeneration(cells);
    lastRenderTime = currentRenderTime;
  }

  drawGrid();

  requestAnimationFrame(render);
}

render();

// handle drawing cells
canvas.addEventListener("mouseup", (event) => {
  cells.push(getCurrentCellCords(event));
});

canvas.addEventListener("mousedown", () => {
  isMouseDown = true;
});

// if mouse move and mouse is clicked
canvas.addEventListener("mousemove", (event) => {
  currentMousePosition = getCurrentCellCords(event);
  if (isMouseDown) {
    // check if cell already exists
    const cellIndex = cells.findIndex(([x, y]) => x === currentMousePosition![0] && y === currentMousePosition![1]);
    if (cellIndex === -1) {
      cells.push(getCurrentCellCords(event));
    }
  }
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});

// handle controls
const start = document.getElementById("start") as HTMLButtonElement;
const stop = document.getElementById("stop") as HTMLButtonElement;
const clear = document.getElementById("clear") as HTMLButtonElement;
const next = document.getElementById("next") as HTMLButtonElement;
const reset = document.getElementById("reset") as HTMLButtonElement;


start?.addEventListener("click", () => {
  isStarted = true;
  start.disabled = true;
  stop.disabled = false;
  start.hidden = true;
  stop.hidden = false;
});

stop?.addEventListener("click", () => {
  isStarted = false;
  start.disabled = false;
  stop.disabled = true;
  start.hidden = false;
  stop.hidden = true;
});

clear?.addEventListener("click", () => {
  cells = [];
  start.disabled = false;
  start.hidden = false;
  stop.disabled = true;
  stop.hidden = true;
  isStarted = false;
});

next?.addEventListener("click", () => {
  cells = calculateNextGeneration(cells);
});

reset.addEventListener("click", () => {
  cells = initialValue;
});

// on keyboard press right arrow key
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    cells = calculateNextGeneration(cells);
  }
});

// speed control
const speedInput = document.getElementById("speed") as HTMLInputElement;

speedInput.oninput = () => {
  speed = Number(speedInput.value);
}



function getCurrentCellCords(event: MouseEvent): [number, number] {
  const x = Math.floor(event.offsetX / gridSize);
  const y = Math.floor(event.offsetY / gridSize);
  return [x, y];
}
