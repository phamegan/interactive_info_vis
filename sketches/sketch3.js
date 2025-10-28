// Instance-mode sketch for tab 3
// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  // Function to generate vertices for an irregular ellipse
  function generateIrregularEllipse(x, y, radius, irregularity) {
    let points = [];
    for (let angle = 0; angle < p.TWO_PI; angle += 0.1) {
      let offset = p.noise(p.cos(angle) * irregularity, p.sin(angle) * irregularity) * irregularity;
      let r = radius + offset;
      let xOffset = x + r * p.cos(angle);
      let yOffset = y + r * p.sin(angle);
      points.push({ x: xOffset, y: yOffset });
    }
    return points;
  }

  // Function to fill the space between two irregular ellipses
  function fillBetweenEllipses(ellipse1, ellipse2, fillColor) {
    p.fill(fillColor);
    p.noStroke();
    p.beginShape();
    // Draw the first ellipse's vertices
    for (let pt of ellipse1) {
      p.vertex(pt.x, pt.y);
    }
    // Draw the second ellipse's vertices in reverse order
    for (let i = ellipse2.length - 1; i >= 0; i--) {
      p.vertex(ellipse2[i].x, ellipse2[i].y);
    }
    p.endShape(p.CLOSE);
  }

  // Function to draw concentric rings with gradient-like shading for minutes
  function drawTreeRing(x, y, radius, irregularity, hour) {
    for (let minute = 0; minute < 60; minute++) {
      let minuteAngle = p.map(minute, 0, 60, 0, p.TWO_PI); // Map minute to angle
      let nextMinuteAngle = p.map(minute + 1, 0, 60, 0, p.TWO_PI); // Next minute angle

      // Calculate color based on the minute
      let shade = p.map(minute, 0, 59, 50, 200); // Lighter for earlier minutes, darker for later
      p.fill(shade, 100, 50); // Set fill color for the minute segment
      p.noStroke();

      // Draw a segment of the ring for this minute
      p.beginShape();
      for (let angle = minuteAngle; angle <= nextMinuteAngle; angle += 0.1) {
        let offset = p.noise(p.cos(angle) * irregularity, p.sin(angle) * irregularity) * irregularity;
        let r = radius + offset;
        let xOffset = x + r * p.cos(angle);
        let yOffset = y + r * p.sin(angle);
        p.vertex(xOffset, yOffset);10
      }
      p.endShape(p.CLOSE);
    }
  }

  p.draw = function () {
    p.background(255);

    // Draw 12 concentric irregular rings, one for each hour
    for (let hour = 0; hour < 12; hour++) {
      let radius = 50 + hour * 20; // Start at 50 and increase radius by 20 for each hour
      let irregularity = 10; // Irregularity for the rings
      drawTreeRing(p.width / 2, p.height / 2, radius, irregularity, hour);
    }

    // Example of filling space between two irregular ellipses
    let ellipse1 = generateIrregularEllipse(p.width / 2, p.height / 2, 300, 20);
    let ellipse2 = generateIrregularEllipse(p.width / 2, p.height / 2, 350, 30);
    fillBetweenEllipses(ellipse1, ellipse2, p.color(180, 60, 60, 100));
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});