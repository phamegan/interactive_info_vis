// Sketch for tab 4
registerSketch('sk4', function (p) {

  let PAD = 20;

  let circsH = [];  
  let circsM = []; 
  let circsS = []; 

  let lastHour = -1;
  let lastMinute = -1;
  let lastSecond = -1;

  let wW;
  let wH;

  const COL_CANOPY_MIN = [34, 139, 34];   
  const COL_CANOPY_SEC = [144, 238, 144];  
  const COL_TRUNK      = [110, 75, 50];   
  const COL_MTN_FILL   = [150, 95, 50]; 
  const COL_STROKE     = [0, 0, 0];       
  const SCALE_SEC      = 0.75;     

  p.setup = function () {
    wW = p.windowWidth;
    wH = p.windowHeight;
    p.createCanvas(wW, wH);
    p.frameRate(10);

    const h24 = p.hour();
    const h12 = (h24 % 12) || 12;
    const m = p.minute();
    const s = p.second();

    p.placeN(h12, wW/12, wH/6, 'hour', circsH);  
    p.placeN(m, wW/14, wH/14, 'min', circsM); 
    p.placeN(s, wW/32, wH/28, 'sec', circsS);  

    lastHour = h24;
    lastMinute = m;
    lastSecond = s;
  };

  
  p.draw = function () {

    p.background(250);
    p.noStroke();

    const h24 = p.hour();
    const h12 = (h24 % 12) || 12;
    const m = p.minute();
    const s = p.second();

    if (h24 !== lastHour) {
      circsH = [];
      p.placeN(h12, wW/12, wH/6, 'hour', circsH)
      lastHour = h24;
    }

    if (m !== lastMinute) {
      circsM = [];
      p.placeN(m, wW/14, wH/14, 'min', circsM)
      lastMinute = m;
    }

    if (s !== lastSecond) {
      if (s === 0) {
        circsS = [];
      } else {
        p.placeOne(wW/32, wH/28, 'sec', circsS); 
      }
      lastSecond = s;
    }

    p.drawShapes(circsH, 'hour');
    p.drawShapes(circsM, 'min');
    p.drawShapes(circsS, 'sec');

    p.fill(0);
    p.textSize(40);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`${p.nf(h12, 2)}:${p.nf(m, 2)}:${p.nf(s, 2)}`, 10, 10);
  };

  p.drawShapes = function (arr, type) {
    for (let c of arr) {
      if (type === 'hour') {
        p.drawMountainFilled(c.x, c.y, c.d);
      } else if (type === 'min') {
        p.drawPine(c.x, c.y, c.d, COL_CANOPY_MIN);
      } else if (type === 'sec') {
        p.drawPine(c.x, c.y, c.d * SCALE_SEC, COL_CANOPY_SEC);
      }
    }
  };

  p.placeN = function (n, minD, maxD, type, target) {
    for (let i = 0; i < n; i++) p.placeOne(minD, maxD, type, target);
  };

  p.placeOne = function (minD, maxD, type, target) {
    let tries = 0;
    while (tries < 800) {
      tries++;
      const d = p.random(minD, maxD);
      const x = p.random(PAD + d / 2, p.width - PAD - d / 2);
      const y = p.random(PAD + d / 2, p.height - PAD - d / 2);
      if (p.isFree(x, y, d)) {
        target.push({ x, y, d, type });
        return true;
      }
    }
    return false;
  };

  p.isFree = function (x, y, d) {
    const all = circsH.concat(circsM, circsS);
    for (let c of all) {
      if (p.dist(x, y, c.x, c.y) < d / 2 + c.d / 2 + 1) { 
        return false; 
      }
    }
    return true;
  };

  p.drawPine = function (x, y, size, canopyRGB) {
    const trunkH = size * 0.45;
    const trunkW = Math.max(2, size * 0.14);

    const canopyH = size;
    const topY = y - canopyH * 0.6;
    const midY = y - canopyH * 0.15;
    const botY = y + canopyH * 0.25;

    const w1 = size * 0.35;
    const w2 = size * 0.55;
    const w3 = size * 0.75;

    p.noStroke();
    p.fill(...canopyRGB);

    p.triangle(x, midY + size*0.12, x - w3, botY, x + w3, botY);
    p.triangle(x, midY - size*0.10, x - w2, midY + size*0.08, x + w2, midY + size*0.08);
    p.triangle(x, topY, x - w1, midY - size*0.18, x + w1, midY - size*0.18);

    p.fill(...COL_TRUNK);
    p.rect(x - trunkW/2, botY, trunkW, trunkH, 2);

    p.push();
    p.noFill();
    p.stroke(...COL_STROKE);
    p.strokeWeight(2);
    p.strokeJoin(p.ROUND);

    p.triangle(x, midY + size*0.12, x - w3, botY, x + w3, botY);
    p.triangle(x, midY - size*0.10, x - w2, midY + size*0.08, x + w2, midY + size*0.08);
    p.triangle(x, topY, x - w1, midY - size*0.18, x + w1, midY - size*0.18);

    p.rect(x - trunkW/2, botY, trunkW, trunkH, 2);
    p.pop();
  };

  p.drawMountainFilled = function (x, y, size) {
    const h = size;
    const w = size * 0.95;
    const leftX  = x - w / 2;
    const rightX = x + w / 2;
    const baseY  = y + h / 2;
    const peakY  = y - h / 2;

    p.noStroke();
    p.fill(...COL_MTN_FILL);
    p.triangle(leftX, baseY, x, peakY, rightX, baseY);

    p.noFill();
    p.stroke(...COL_STROKE);
    p.strokeWeight(2);
    p.strokeJoin(p.ROUND);
    p.triangle(leftX, baseY, x, peakY, rightX, baseY);
  };

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
