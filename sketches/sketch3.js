// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  p.state = {
    waterLevel: 1,                // 1 = full, 0 = empty
  };

  p.bottle = {
    x: 0, y: 0, width: 0, height: 0,
    corner: 20,
    capHeight: 0
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.layoutBottle();
  };

  p.layoutBottle = function () {
    const bodyH = Math.min(p.height * 0.6, 500);
    const bodyW = Math.min(p.width * 0.18, 220);
  
    p.bottle.width = bodyW;
    p.bottle.height = bodyH;
  
    // Slightly right of center to balance face on the left
    const centerX = p.width * 0.60;
    p.bottle.x = centerX - bodyW / 2;
    p.bottle.y = p.height / 2 - bodyH / 2;
    p.bottle.corner = Math.min(24, bodyW * 0.15);
    p.bottle.capHeight = Math.max(18, bodyH * 0.08);
  };

  p.drawBottle = function () {
    const b = p.bottle;
  
    // Body
    p.stroke(0);
    p.strokeWeight(2);
    p.fill(255);
    p.rect(b.x, b.y, b.width, b.height, b.corner);
  
    // Cap: black rectangle same width as body, rounded on top corners
    const capY = b.y - b.capHeight + 2;
    p.noStroke();
    p.fill(0);
    p.rect(b.x, capY, b.width, b.capHeight, b.corner * 0.6, b.corner * 0.6, 0, 0);
  
    // Water fill
    const innerPad = 6;
    const innerX = b.x + innerPad;
    const innerY = b.y + innerPad;
    const innerW = b.width - innerPad * 2;
    const innerH = b.height - innerPad * 2;
  
    const wl = p.state.waterLevel; // defined in step 2
    const waterTop = innerY + innerH * (1 - wl);
  
    p.noStroke();
    p.fill(0, 120, 255);
    p.rect(innerX, waterTop, innerW, innerH * wl, b.corner * 0.6);
  
    // Highlight
    p.noFill();
    p.stroke(255);
    p.strokeWeight(2);
    p.line(innerX + 8, waterTop + 6, innerX + innerW - 8, waterTop + 6);
    p.strokeWeight(1);
  };

  p.draw = function () {
    p.background(240);

    // 1) bottle
    p.drawBottle();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.layoutBottle();
  };
});