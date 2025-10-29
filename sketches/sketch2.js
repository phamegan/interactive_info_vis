// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {

  // Layout
  let wW, wH;
  const FIG_X = 120;     // stick figure base x
  const FIG_Y = () => wH - 140; // ground baseline for the figure
  const BEAM_ANGLE = -p.PI / 10; // flashlight aim angle
  const BEAM_LEN = () => Math.min(wW, wH) * 0.65; // distance to spot

  // Ring setup
  const RINGS = 12;              // total rings from outer to inner
  const OUTER_R = () => Math.min(wW, wH) * 0.32;
  const RING_W = () => OUTER_R() / RINGS;

  // Colors
  const COL_BG   = [245, 245, 245];
  const COL_LINE = [0, 0, 0];
  const COL_YEL  = [255, 235, 100];  // bright yellow
  const COL_OFF  = [0, 0, 0];        // black

  // Cached colors for lerp
  let cYel, cOff;

  // Time tracking (so it works immediately on load)
  let lastMinute = -1;

  p.setup = function () {
    wW = p.windowWidth;
    wH = p.windowHeight;
    p.createCanvas(wW, wH);

    cYel = p.color(...COL_YEL);
    cOff = p.color(...COL_OFF);

    lastMinute = p.minute();
  };
  p.draw = function () {
    p.background(...COL_BG);
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});