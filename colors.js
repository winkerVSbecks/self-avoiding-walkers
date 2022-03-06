const Random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors').map((h) => h.hex);
const paperColors = require('paper-colors').map((h) => h.hex);

const minContrast = 3;

const background = Random.pick(paperColors.filter((c) => c !== '#9c96cd'));

const inkColors = risoColors
  .filter((color) => Color.contrastRatio(background, color) >= minContrast)
  .filter((c) => c !== '#000000');

const ink = () => Random.pick(inkColors);

const colors = {
  bg: background,
  foreground: ink(),
  ink,
};

module.exports = { colors };
