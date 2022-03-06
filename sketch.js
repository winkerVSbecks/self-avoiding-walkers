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
  walkerCount: 10,
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
    },
    render({ context, width, height }) {
      // clear
      context.clearRect(0, 0, width, height);
      context.fillStyle = config.colors.background;
      context.fillRect(0, 0, width, height);

      drawGrid(context, state.grid, width, height);
    },
  };
};

/**
 * Walker
 */

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
  if (idx >= 0) {
    state.grid[idx].occupied = true;
  }
}

/**
 * Utils
 */
function xyToCoords(x, y, width, height) {
  return [
    (x * width) / config.resolution - 1,
    (y * height) / config.resolution - 1,
  ];
}

canvasSketch(sketch, settings);
