// sketch for tab 2
registerSketch('sk2', function (p) {

  p.ui = { ringsInput: null };

  p.state = { rings: 5 };


  // Layout
  let wW, wH;
  const FIG_X = 120;     // stick figure base x
  const FIG_Y = () => wH - 140; // ground baseline for the figure
  const BEAM_ANGLE = -p.PI / 10; // flashlight aim angle
  const BEAM_LEN = () => Math.min(wW, wH) * 0.65; // distance to spot

  // Ring setup
  const OUTER_R = () => Math.min(wW, wH) * 0.32;
  const RING_W = () => OUTER_R() / p.state.rings;

  // Colors
  const COL_BG   = [50, 50, 50];
  const COL_LINE = [0, 0, 0];
  const COL_YEL  = [255, 235, 100];  // bright yellow
  const COL_OFF  = [0, 0, 0];        // black
  
  const MIN_ALPHA = 70; // minimum alpha for faded rings

  const TIMER_PAD = 10;
  const TIMER_TXT = 24;
  const TIMER_BG  = [0, 0, 0, 120];
  const TIMER_FG  = [255, 255, 255];
  // Cached colors 
  let cYel, cBg;

  // Time tracking (so it works immediately on load)
  // let lastMinute = -1;
  

  p.setup = function () {
    wW = p.windowWidth;
    wH = p.windowHeight;
    p.createCanvas(wW, wH);

    cYel = p.color(...COL_YEL);
    cBg = p.color(...COL_OFF);

    lastMinute = p.minute();

    p.ui.ringsInput = p.createInput(String(p.state.rings), 'number');
    p.ui.ringsInput.attribute('min', '1');
    p.ui.ringsInput.attribute('step', '1');
    p.ui.ringsInput.style('font-size', '16px');
    p.ui.ringsInput.style('padding', '6px 10px');
    p.ui.ringsInput.style('border-radius', '10px');

    p.ui.ringsInput.input(() => {
      const val = parseInt(p.ui.ringsInput.value(), 10);
      if (Number.isFinite(val) && val > 0) p.state.rings = val;
    });

  };

  p.placeRingControl = function () {
    if (!p.ui.ringsInput) return;
  
    const label = 'Select how many rings (minutes):';
    const inputW = 60;
    const inputH = 36;
  
    const margin = 20;
    const pad = 10;
  
    p.textSize(16);
    const labelW = p.textWidth(label);
  
    // Panel matches input width for clean stacking
    const panelW = Math.max(labelW + pad * 2, inputW);
    const panelH = inputH;
  
    const panelX = margin;
    const panelY = margin;
  
    // Panel background
    p.noStroke();
    p.fill(255, 255, 255, 170);
    p.rect(panelX, panelY, panelW, panelH, 12);
  
    // Label centered vertically in panel
    p.fill(30);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(label, panelX + pad, panelY + panelH / 2);
  
    // Input directly below the panel
    const inputX = panelX;
    const inputY = panelY + panelH + 80;
  
    p.ui.ringsInput.position(inputX, inputY);
    p.ui.ringsInput.size(panelW - pad * 2, inputH);
  };


  p.draw = function () {
    p.background(...COL_BG);
    
    // Time
    const m = p.minute();
    const s = p.second();
    const activeRingIdx = m % p.state.rings;     // which ring is fading this minute
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

    drawRings(spotCenter.x, spotCenter.y, activeRingIdx, fadeT);
    drawCycleTimerAboveFigure(figX, figY, activeRingIdx, s, p.state.rings);

    p.placeRingControl();


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
  function drawRings(cx, cy, activeIdx, t) {
    p.stroke(...COL_LINE);
    p.strokeWeight(1.5);
  
    for (let i = 0; i < p.state.rings; i++) {
      const outerR = OUTER_R() - i * RING_W();
      const innerR = Math.max(0, outerR - RING_W());
  
      // Base color interpolation: yellow -> background
      let baseCol;
      if (i < activeIdx) {
        baseCol = p.lerpColor(cYel, p.color(...COL_BG), 1);     // fully at BG tone
      } else if (i === activeIdx) {
        baseCol = p.lerpColor(cYel, p.color(...COL_BG), t);     // fading this minute
      } else {
        baseCol = cYel;                                         // future rings stay bright
      }
  
      // Apply a minimum alpha so faded rings remain visible
      const alpha = (i < activeIdx) ? MIN_ALPHA
                   : (i === activeIdx) ? p.map(t, 0, 1, 200, MIN_ALPHA)
                   : 220;
  
      const fillCol = p.color(p.red(baseCol), p.green(baseCol), p.blue(baseCol), alpha);
  
      // Filled annulus
      p.noStroke();
      p.fill(fillCol);
      p.circle(cx, cy, outerR * 2);
  
      // Carve inner hole
      p.fill(...COL_BG);
      p.circle(cx, cy, innerR * 2);
  
      // Outline so rings are always legible
      p.noFill();
      p.stroke(...COL_LINE);
      p.circle(cx, cy, outerR * 2);
    }
  
    // Inner most dot outline
    p.noFill();
    p.stroke(...COL_LINE);
    p.circle(cx, cy, Math.max(2, (OUTER_R() - p.state.rings * RING_W()) * 2));
  }
  function drawCycleTimerAboveFigure(figX, figY, activeRingIdx, secInMinute, ringsTotal) {
    // total seconds in the cycle
    const total = ringsTotal * 60;
    // seconds elapsed so far in the cycle
    const elapsed = activeRingIdx * 60 + secInMinute;
    // seconds remaining, never negative
    const remaining = Math.max(0, total - elapsed);
  
    const mm = Math.floor(remaining / 60);
    const ss = remaining % 60;
  
    const tStr = `${p.nf(mm,2)}:${p.nf(ss,2)}`;
  
    p.textSize(TIMER_TXT);
    p.textAlign(p.CENTER, p.TOP);
    const tw = p.textWidth(tStr);
    const th = TIMER_TXT * 1.3;
  
    const yTop = Math.max(10, figY - 110);
  
    p.noStroke();
    p.fill(...TIMER_BG);
    p.rect(figX - tw/2 - TIMER_PAD*0.5, yTop, tw + TIMER_PAD, th, 8);
  
    p.fill(...TIMER_FG);
    p.text(tStr, figX, yTop + th * 0.12);
  }
  p.windowResized = function () { 
    p.resizeCanvas(p.windowWidth, p.windowHeight); 
    p.placeRingControl();
  };
});
