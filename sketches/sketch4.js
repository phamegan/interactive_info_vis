// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {

  let PAD = 20;

  let circsH = [];  // hour mountains
  let circsM = [];  // minute trees
  let circsS = [];  // second mini samplings (accumulate, then reset each minute)

  let lastHour = -1;
  let lastMinute = -1;
  let lastSecond = -1;

  let wW;
  let wH;

  p.setup = function () {
    wW = p.windowWidth;
    wH = p.windowHeight;
    p.createCanvas(wW, wH);
    p.frameRate(10);

      // Build initial state so it doesn't start empty
    const h24 = p.hour();
    const h12 = (h24 % 12) || 12;
    const m = p.minute();
    const s = p.second();

    p.placeN(h12, wW/12, wH/6, 'hour', circsH);  // hours
    p.placeN(m, wW/14, wH/14, 'min', circsM);  // minutes
    p.placeN(s, wW/32, wH/28, 'sec', circsS);  // seconds already elapsed

    // Set last-variables so we only react on change afterward
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

    // Build and reset state as time progresses
    // Rebuild hours once per hour
    if (h24 !== lastHour) {
      circsH = [];
      p.placeN(h12, wW/12, wH/6, 'hour', circsH)
      lastHour = h24;
    }

    // Rebuild minutes once per minute
    if (m !== lastMinute) {
      circsM = [];
      p.placeN(m, wW/14, wH/14, 'min', circsM)
      lastMinute = m;
    }

    // Seconds: add one each second; reset at start of minute
    if (s !== lastSecond) {
      if (s === 0) {
        circsS = []; // reset
      } else {
        p.placeOne(wW/32, wH/28, 'sec', circsS); // add exactly one
      }
      lastSecond = s;
    }

    // Draw layers
    p.drawShapes(circsH, 'hour');
    p.drawShapes(circsM, 'min');
    p.drawShapes(circsS, 'sec');

    // Time label
    p.fill(0);
    p.textSize(40);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`${p.nf(h12, 2)}:${p.nf(m, 2)}:${p.nf(s, 2)}`, 10, 10);
  };

  // Functions to draw samplings, trees and mountains
  p.drawShapes = function (arr, type) {
    for (let c of arr) {
      if (type === 'hour') {
        p.drawMountain(c.x, c.y, c.d); // Draw mountain for hours
      } else if (type === 'min') {
        p.drawTree(c.x, c.y, c.d, 10, p.color(34, 139, 34)); // Draw larger tree for minutes
      } else if (type === 'sec') {
        p.drawTree(c.x, c.y, c.d, 5, p.color(60, 179, 113)); // Draw mini tree for seconds
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
    return false; // (give up, too packed)
  };

  p.isFree = function (x, y, d) {
    const all = circsH.concat(circsM, circsS);
    for (let c of all) {
      if (p.dist(x, y, c.x, c.y) < d / 2 + c.d / 2 + 1) { // Check for overlap
        return false; 
      }
    }
    return true;
  };

  // Function to draw a tree
  p.drawTree = function (x, y, size, irregularity, color) {
    p.fill(color);
    p.noStroke();
    p.beginShape();
    for (let angle = 0; angle < p.TWO_PI; angle += 0.1) {
      let offset = p.noise(p.cos(angle) * irregularity, p.sin(angle) * irregularity) * irregularity;
      let r = size + offset;
      let xOffset = x + r * p.cos(angle);
      let yOffset = y + r * p.sin(angle);
      p.vertex(xOffset, yOffset);
    }
    p.endShape(p.CLOSE);
  };

  // Function to draw a mountain
  p.drawMountain = function (x, y, size) {
    p.fill(139, 69, 19); // Brown color for the mountain
    p.noStroke();
    p.beginShape();
    p.vertex(x - size / 2, y + size / 2); // Bottom left
    p.vertex(x, y - size / 2); // Peak
    p.vertex(x + size / 2, y + size / 2); // Bottom right
    p.endShape(p.CLOSE);
  };

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
