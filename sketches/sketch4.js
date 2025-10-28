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
    p.createCanvas(800, 800);
    p.frameRate(10);

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
    p.background(200, 240, 200);
    p.fill(30, 120, 40);
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('HWK #4. C', p.width / 2, p.height / 2);
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
