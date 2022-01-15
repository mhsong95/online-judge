const COLORS = Object.freeze({
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
});

function colored(str, color = '') {
  const s = COLORS[color] || '';
  const e = COLORS.reset;
  return `${s}${str}${e}`;
}

function pad(str, max = 0, fill = ' ') {
  return str.padEnd(max, fill);
}

module.exports = {
  COLORS,
  colored,
  pad,
};
