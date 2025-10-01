//custom variables for y-coordinate of sun & horizon
let shapeHeight;

let horizon ;
function setup() {
  createCanvas(windowWidth,windowHeight);
  horizon =height/2;
}

function draw() {

  //shape follows y-coordinate of mouse
  shapeHeight = mouseY;
  currentWidth = mouseX;

  //light blue background if the shape is above horizon

  //with if-else statement
  if (shapeHeight < horizon) {
    background("pink"); // pink if above horizon
    
  } else {
    background("white"); // white if below horizon
  }

  //sun
  fill("lightyellow");
  
  rect(width/4, shapeHeight, width/2);
  textSize(20);
  fill("black");
  text('Hi! My name is Megan Pham', currentWidth/2, shapeHeight/2);
  


  // draw line for horizon
  stroke('lavender');
  line(0,horizon,width,horizon);

  //grass

  fill("lavender");

  rect(0, horizon, width, height);

}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  horizon = height / 2; // recalc horizon after resize
}

