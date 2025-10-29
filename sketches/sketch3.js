// Sketch for tab 3
registerSketch('sk3', function (p) {
  p.state = {
    waterLevel: 1,               
    totalSeconds: .5 * 60,    
    remainingSeconds: .5 * 60,
    lastSecondTick: 0,      
    minutesInput: null,
    minutesApplyBtn: null,
  };

  p.bottle = {
    x: 0, y: 0, width: 0, height: 0,
    corner: 20,
    capHeight: 0
  };

  p.ui = { resetBtn: null, setMinutesBtn: null };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.layoutBottle();
    p.state.lastSecondTick = p.millis();

    p.ui.minutesInput = p.createInput(String(Math.round(p.state.totalSeconds / 60)), 'number');
    p.ui.minutesInput.attribute('min', '1');
    p.ui.minutesInput.attribute('step', '1');
    p.ui.minutesInput.size(90);
    p.ui.minutesInput.style('font-size', '16px');
    p.ui.minutesInput.style('padding', '6px 10px');
    p.ui.minutesInput.style('border-radius', '10px');

    p.ui.minutesApplyBtn = p.createButton('Apply');
    p.ui.minutesApplyBtn.size(90, 40);
    p.ui.minutesApplyBtn.style('font-size', '16px');
    p.ui.minutesApplyBtn.style('border-radius', '12px');
    p.ui.minutesApplyBtn.style('cursor', 'pointer');
    p.ui.minutesApplyBtn.mousePressed(p.applyMinutes);

    p.ui.resetBtn = p.createButton('Reset timer');
    p.ui.resetBtn.size(160, 40);
    p.ui.resetBtn.style('font-size', '16px');
    p.ui.resetBtn.style('border-radius', '12px');
    p.ui.resetBtn.style('cursor', 'pointer');
    p.ui.resetBtn.mousePressed(function () {
      p.state.remainingSeconds = p.state.totalSeconds;
      p.state.waterLevel = 1;
      p.state.lastSecondTick = p.millis();
});

    p.ui.minutesInput.elt.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') p.applyMinutes();
    });

    
  };

  p.layoutBottle = function () {
    const bodyH = Math.min(p.height * 0.6, 500);
    const bodyW = Math.min(p.width * 0.18, 220);
  
    p.bottle.width = bodyW;
    p.bottle.height = bodyH;
  
    const centerX = p.width * 0.60;
    p.bottle.x = centerX - bodyW / 2;
    p.bottle.y = p.height / 2 - bodyH / 2;
    p.bottle.corner = Math.min(24, bodyW * 0.15);
    p.bottle.capHeight = Math.max(18, bodyH * 0.08);
  };

  p.drawBottle = function () {
    const b = p.bottle;
  
    p.stroke(0);
    p.strokeWeight(2);
    p.fill(255);
    p.rect(b.x, b.y, b.width, b.height, b.corner);
  
    const capY = b.y - b.capHeight + 2;
    p.noStroke();
    p.fill(0);
    p.rect(b.x, capY, b.width, b.capHeight, b.corner * 0.6, b.corner * 0.6, 0, 0);
  
    const innerPad = 6;
    const innerX = b.x + innerPad;
    const innerY = b.y + innerPad;
    const innerW = b.width - innerPad * 2;
    const innerH = b.height - innerPad * 2;
  
    const wl = p.state.waterLevel;
    const waterTop = innerY + innerH * (1 - wl);
  
    p.noStroke();
    p.fill(0, 120, 255);
    p.rect(innerX, waterTop, innerW, innerH * wl, b.corner * 0.6);

  };

  p.tickTimerEachSecond = function () {
    const now = p.millis();
    if (now - p.state.lastSecondTick >= 1000) {
      p.state.lastSecondTick = now;
  
      if (p.state.remainingSeconds > 0) {
        p.state.remainingSeconds -= 1;
  
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
  
    const frac = p.state.remainingSeconds / p.state.totalSeconds; 
    let mood = 0; 
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
  
  p.applyMinutes = function () {
    const val = parseInt(p.ui.minutesInput.value(), 10);
    if (!Number.isFinite(val) || val <= 0) {
    
      p.ui.minutesInput.value(String(Math.max(1, Math.round(p.state.totalSeconds / 60))));
      return;
    }
    p.state.totalSeconds = val * 60;
    p.state.remainingSeconds = p.state.totalSeconds;
    p.state.waterLevel = 1;
    p.state.lastSecondTick = p.millis();
  };
  
  p.drawMessages = function (midX, controlsY, labelGap = 36) {
    const baselineY = controlsY - labelGap; 
    p.noStroke();
    p.textAlign(p.CENTER, p.BOTTOM);
  
    if (p.state.remainingSeconds <= 0) {
      p.fill(200, 0, 0);
      p.textSize(18);
      p.text('Water is empty. Choose another time for your next break!', midX, baselineY);
    } else {
      p.fill(30);
      p.textSize(16);
      p.text('Choose how long till your next water break (minutes)', midX, baselineY);
    }
  };  

  p.placeControls = function () {
    const btnW = 160, btnH = 40, gap = 30;
    const inputW = 90, applyW = 90;
  

    const faceSize = Math.min(p.width, p.height) * 0.22;
    const faceX = Math.max(160, p.width * 0.18);
    const bottleCenterX = p.bottle.x + p.bottle.width / 2;
    const midX = (faceX + bottleCenterX) / 2;
  

    const labelGap = 100; 
    const totalW = btnW + gap + inputW + gap + applyW;
    const startX = midX - totalW / 2;
    const baseY = p.height / 2 - btnH / 2;  
    const controlsY = baseY + labelGap; 
  
    if (p.ui.resetBtn) {
      p.ui.resetBtn.size(btnW, btnH);
      p.ui.resetBtn.position(startX, controlsY);
    }
    if (p.ui.minutesInput) {
      p.ui.minutesInput.size(inputW, btnH);
      p.ui.minutesInput.position(startX + btnW + gap, controlsY);
    }
    if (p.ui.minutesApplyBtn) {
      p.ui.minutesApplyBtn.size(applyW, btnH);
      p.ui.minutesApplyBtn.position(startX + btnW + gap + inputW + gap, controlsY);
    }
  
    if (typeof p.drawMessages === 'function') {
      p.drawMessages(midX, controlsY, labelGap);
    }
  };

  p.draw = function () {
    p.background(240);
    p.tickTimerEachSecond();
    p.drawBottle();
    p.drawFaceWithMood();
    p.placeControls();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.layoutBottle();
    p.placeControls();

  };
});