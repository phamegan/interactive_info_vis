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
    
    // Time
    const m = p.minute();
    const s = p.second();
    const activeRingIdx = m % RINGS;     // which ring is fading this minute
    const fadeT = s / 60;                // 0..1 over the minute

    // Geometry for flashlight and spot
    const figX = FIG_X;
    const figY = FIG_Y();

    const torchLen = 38;
    const torchTip = p.createVector(figX + torchLen * p.cos(BEAM_ANGLE),
                                    figY + torchLen * p.sin(BEAM_ANGLE));

        
    const spotCenter = p.createVector(
      torchTip.x + BEAM_LEN() * p.cos(BEAM_ANGLE),
      torchTip.y + BEAM_LEN() * p.sin(BEAM_ANGLE)
    );
    // Draw stick figure on top so it is visible
    drawStickFigure(figX, figY);
    drawFlashlight(figX, figY, torchTip);

    drawCone(figX, figY, torchTip, spotCenter);


  };

  function drawStickFigure(x, y) {
    p.push();
    p.stroke(...COL_LINE);
    p.strokeWeight(3);
    p.noFill();

    // head
    p.circle(x, y - 30, 22);

    // body
    p.line(x, y - 20, x, y + 30);

    // legs
    p.line(x, y + 30, x - 16, y + 60);
    p.line(x, y + 30, x + 16, y + 60);

    // front arm holding flashlight
    const handX = x + 26 * p.cos(BEAM_ANGLE);
    const handY = y + 26 * p.sin(BEAM_ANGLE);
    p.line(x, y - 6, handX, handY);
    p.pop();
  }

  function drawFlashlight(baseX, baseY, tip) {
    // Centers of the two dots
    const baseC = p.createVector(
      baseX + 12 * p.cos(BEAM_ANGLE),
      baseY + 12 * p.sin(BEAM_ANGLE)
    );
    const tipC = p.createVector(tip.x, tip.y);
  
    // Direction from base to tip and its normal
    const dir = p5.Vector.sub(tipC, baseC).normalize();
    const nrm = p.createVector(-dir.y, dir.x);
  
    // Offset for the two parallel lines
    const halfGap = 3.5; // adjust for wider or narrower body
  
    const b1 = p5.Vector.add(baseC, p5.Vector.mult(nrm,  halfGap));
    const b2 = p5.Vector.add(baseC, p5.Vector.mult(nrm, -halfGap));
    const t1 = p5.Vector.add(tipC,  p5.Vector.mult(nrm,  halfGap));
    const t2 = p5.Vector.add(tipC,  p5.Vector.mult(nrm, -halfGap));
  
    // Body lines
    p.push();
    p.stroke(...COL_LINE);
    p.strokeWeight(3);
    p.line(b1.x, b1.y, t1.x, t1.y);
    p.line(b2.x, b2.y, t2.x, t2.y);
  
    // Dots
    p.fill(40);
    p.circle(baseC.x, baseC.y, 10); // barrel
    p.circle(tipC.x,  tipC.y,  14); // tip head
    p.pop();
  }

  function drawCone(baseX, baseY, tip, spot) {
    const coneW = Math.max(60, BEAM_LEN() * 0.30); // width at the spot

    // Vector from tip to spot
    const dir = p.createVector(spot.x - tip.x, spot.y - tip.y).normalize();
    const normal = p.createVector(-dir.y, dir.x);

    const nearW = 16; // small opening near flashlight
    const a1 = p.createVector(tip.x + normal.x * nearW, tip.y + normal.y * nearW);
    const a2 = p.createVector(tip.x - normal.x * nearW, tip.y - normal.y * nearW);
    const b1 = p.createVector(spot.x + normal.x * coneW, spot.y + normal.y * coneW);
    const b2 = p.createVector(spot.x - normal.x * coneW, spot.y - normal.y * coneW);

    // Soft cone fill
    p.noStroke();
    p.fill(255, 255, 200, 60);
    p.quad(a1.x, a1.y, a2.x, a2.y, b2.x, b2.y, b1.x, b1.y);

    // Outline
    p.noFill();
    p.stroke(...COL_LINE);
    p.strokeWeight(1.5);
    p.line(a1.x, a1.y, b1.x, b1.y);
    p.line(a2.x, a2.y, b2.x, b2.y);
  }
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
