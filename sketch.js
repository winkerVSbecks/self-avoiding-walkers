const canvasSketch = require('canvas-sketch');
const { mapRange, lerpFrames, clamp } = require('canvas-sketch-util/math');
const Random = require('canvas-sketch-util/random');
const { colors } = require('./colors');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  duration: 8,
};

const config = {
  resolution: 40,
  size: 5,
  walkerCount: 1,
  colors: {
    background: colors.bg,
    grid: colors.ink(),
  },
};

const state = {
  grid: [],
};

const sketch = () => {
  return {
    begin() {
      state.grid = makeGrid();
      state.walkers = new Array(config.walkerCount).fill(null).map(makeWalker);
    },
    render({ context, width, height }) {
      // clear
      context.clearRect(0, 0, width, height);
      context.fillStyle = config.colors.background;
      context.fillRect(0, 0, width, height);

      drawGrid(context, state.grid, width, height);

      state.walkers.forEach((walker) => {
        if (walker.state === 'alive') {
          step(walker);
        }
        drawWalker(context, walker, width, height);
      });
    },
  };
};

/**
 * Walker
 */
function makeWalker() {
  const start = {
    x: Random.rangeFloor(1, config.resolution - 1),
    y: Random.rangeFloor(1, config.resolution - 1),
  };

  return {
    path: [start],
    color: colors.ink(),
    state: 'alive',
  };
}

function step(walker) {
  let currentIndex = walker.path.length - 1;
  let current = walker.path[currentIndex];
  let next = findNextStep(current);

  setOccupied(next);
  walker.path.push(next);
}

function findNextStep({ x, y }) {
  const options = [
    { x: x + 1, y: y },
    { x: x - 1, y: y },
    { x: x, y: y + 1 },
    { x: x, y: y - 1 },
  ];

  return Random.pick(options);
}

function drawWalker(context, walker, width, height) {
  context.strokeStyle = walker.color;
  context.lineWidth = config.size;

  context.beginPath();

  walker.path.map(({ x, y }) => {
    context.lineTo(...xyToCoords(x, y, width, height));
  });

  context.stroke();
}

/**
 * Grid
 */
function makeGrid() {
  const grid = [];

  for (let y = 1; y < config.resolution; y++) {
    for (let x = 1; x < config.resolution; x++) {
      grid.push({ x, y, occupied: false });
    }
  }

  return grid;
}

function drawGrid(context, grid, width, height) {
  grid.map(({ x, y, occupied }) => {
    context.fillStyle = config.colors.grid;
    if (!occupied) {
      const [worldX, worldY] = xyToCoords(x, y, width, height);

      context.fillRect(
        worldX - config.size / 2,
        worldY - config.size / 2,
        config.size,
        config.size
      );
    }
  });
}

function isOccupied({ x, y }) {
  const idx = xyToIndex(x, y);
  return state.grid[idx].occupied;
}

function setOccupied({ x, y }) {
  const idx = xyToIndex(x, y);
  if (idx >= 0 && idx < state.grid.length) {
    state.grid[idx].occupied = true;
  }
}

/**
 * Utils
 */
function xyToIndex(x, y) {
  return x - 1 + (config.resolution - 1) * (y - 1);
}

function xyToCoords(x, y, width, height) {
  return [
    (x * width) / config.resolution - 1,
    (y * height) / config.resolution - 1,
  ];
}

canvasSketch(sketch, settings);
