// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  p.state = {
    waterLevel: 1,                // 1 = full, 0 = empty
    totalSeconds: .5 * 60,     // capacity in seconds
    remainingSeconds: .5 * 60, // starts full
    lastSecondTick: 0          // last 1s tick time
  };

  p.bottle = {
    x: 0, y: 0, width: 0, height: 0,
    corner: 20,
    capHeight: 0
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.layoutBottle();
    p.state.lastSecondTick = p.millis();
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

  p.tickTimerEachSecond = function () {
    const now = p.millis();
    if (now - p.state.lastSecondTick >= 1000) {
      p.state.lastSecondTick = now;
  
      if (p.state.remainingSeconds > 0) {
        p.state.remainingSeconds -= 1;
  
        // Update water level from time fraction
        p.state.waterLevel = p.constrain(
          p.state.remainingSeconds / p.state.totalSeconds, 0, 1
        );
      }
    }
  };

  p.drawFaceBase = function (x, y, size) {
    p.push();
    p.fill(255, 220, 180);
    p.stroke(0);
    p.strokeWeight(2);
    p.ellipse(x, y, size);
  
    const eyeOffsetX = size * 0.22;
    const eyeOffsetY = size * 0.16;
    const eyeR = size * 0.06;
    p.fill(0);
    p.noStroke();
    p.ellipse(x - eyeOffsetX, y - eyeOffsetY, eyeR);
    p.ellipse(x + eyeOffsetX, y - eyeOffsetY, eyeR);
    p.pop();
  };

  p.drawFaceWithMood = function () {
    const size = Math.min(p.width, p.height) * 0.22;
    const x = Math.max(160, p.width * 0.18);
    const y = p.height / 2;
  
    const frac = p.state.remainingSeconds / p.state.totalSeconds; // 1..0
    let mood = 0; // 0 happy, 1 neutral, 2 angry
    if (frac > 0.5) mood = 0;
    else if (frac > 0.2) mood = 1;
    else mood = 2;
  
    p.drawFaceBase(x, y, size);
  
    p.push();
    p.noFill();
    p.stroke(0);
    p.strokeWeight(4);
    if (mood === 0) {
      p.arc(x, y + size * 0.18, size * 0.44, size * 0.26, 0, p.PI);
    } else if (mood === 1) {
      p.line(x - size * 0.22, y + size * 0.2, x + size * 0.22, y + size * 0.2);
    } else {
      p.arc(x, y + size * 0.26, size * 0.44, size * 0.26, p.PI, 0);
      const eyeOffsetX = size * 0.22;
      const eyeOffsetY = size * 0.16;
      p.line(x - eyeOffsetX - size * 0.06, y - eyeOffsetY - size * 0.08,
             x - eyeOffsetX + size * 0.04, y - eyeOffsetY - size * 0.02);
      p.line(x + eyeOffsetX - size * 0.04, y - eyeOffsetY - size * 0.02,
             x + eyeOffsetX + size * 0.06, y - eyeOffsetY - size * 0.08);
    }
    p.pop();
  };

  p.draw = function () {
    p.background(240);
    p.tickTimerEachSecond();
    p.drawBottle();
    p.drawFaceWithMood();
  };

  
  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.layoutBottle();
  };
});