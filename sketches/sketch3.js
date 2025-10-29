// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  p.state = {
    waterLevel: 1,                // 1 = full, 0 = empty
    totalSeconds: 15 * 60,        // default capacity in seconds
    remainingSeconds: 15 * 60,
    lastSecondTick: 0,
    faceMood: 0                   // 0 happy, 1 neutral, 2 angry
  };

  p.ui = {
    resetBtn: null,
    setMinutesBtn: null
  };

  p.bottle = {
    x: 0, y: 0, width: 0, height: 0,
    corner: 20,
    capHeight: 0
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };


  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});