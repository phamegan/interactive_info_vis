// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {

  let PAD = 20;

  let circsH = [];  // hour mountains
  let circsM = [];  // minute trees
  let circsS = [];  // second mini samplings (accumulate, then reset each minute)

  let lastHour = -1;
  let lastMinute = -1;
  let lastSecond = -1;

  p.setup = function () {
    wW = p.windowWidth;
    wH = p.windowHeight;
    p.createCanvas(wW, wH);
    p.frameRate(10);
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

  // Functions to draw a tree
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
  
  p.draw = function () {
    // p.background(200, 240, 200);
    // p.fill(30, 120, 40);
    // p.textSize(32);
    // p.textAlign(p.CENTER, p.CENTER);
    // p.text('HWK #4. C', p.width / 2, p.height / 2);

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
    
    
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
