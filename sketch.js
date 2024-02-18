let capture;
let setWidth = 640 / 4; // minimum = 160
let setHeight = 480 / 4; // minimum = 120
let marginWidth = 20;
let marginHeight = 60;
let positions = []; // positions to end up like this: [ [{x,y}, {x,y}, {x,y}], repeat 4 more times ]

// Picture and video functionality
let inputFeed;
let pictureButton;
let videoButton;
let pictureTaken = false;

// For captures
let hoverText = "";
let brightSlider;
let redSlider;
let greenSlider;
let blueSlider;
let redRemovedSlider;
let greenRemovedSlider;
let blueRemovedSlider;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);
  angleMode(DEGREES);
  fill(255);

  pixelDensity(1);
  capture = createCapture(VIDEO);
  capture.size(setWidth, setHeight);
  capture.hide();

  // ----- Picture and video functionality  ----- //
  // Set inputFeed upon startup
  inputFeed = capture;

  // Button creation
  pictureButton = createButton("Take picture");
  videoButton = createButton("Resume video");
  videoButton.hide();

  // Button function
  pictureButton.mousePressed(function () {
    let picture = createImage(capture.width, capture.height);
    picture.copy(capture, 0, 0, capture.width, capture.height, 0, 0, capture.width, capture.height);
    inputFeed = picture;
    pictureButton.html("Take another!");
    videoButton.show();
    pictureTaken = true;
  });

  videoButton.mousePressed(function () {
    inputFeed = capture;
    pictureButton.html("Take picture");
    videoButton.hide();
    pictureTaken = false;
  });

  // ----- For captures  ----- //
  brightSlider = createSlider(0, 300, 120, 1);
  redSlider = createSlider(0, 255, 255, 1);
  greenSlider = createSlider(0, 255, 255, 1);
  blueSlider = createSlider(0, 255, 255, 1);
  redRemovedSlider = createSlider(0, 255, 0, 1);
  greenRemovedSlider = createSlider(0, 255, 0, 1);
  blueRemovedSlider = createSlider(0, 255, 0, 1);

  let sliders = [];
  sliders.push(brightSlider, redSlider, greenSlider, blueSlider, redRemovedSlider, greenRemovedSlider, blueRemovedSlider);
  for (let i = 0; i < sliders.length; i++) {
    sliders[i].style("width", capture.width + "px");
  }
}

function draw() {
  background(20);

  // ----- Update positions in case of window resizing  ----- //
  let rowCount = 5;
  let colCount = 3;
  for (let i = 0; i < rowCount; i++) {
    positions[i] = [];
    for (let j = 0; j < colCount; j++) {
      let totalWidth = colCount * (setWidth + marginWidth) - marginWidth;
      let totalHeight = rowCount * (setHeight + marginHeight) - marginHeight;
      let startX = (width - totalWidth) / 2;
      let startY = (height - totalHeight) / 2;
      positions[i][j] = {
        x: startX + j * (setWidth + marginWidth),
        y: startY + i * (setHeight + marginHeight),
      };
    }
  }

  // Shift pictureButton leftward a tiny bit when its text changes
  if (!pictureTaken) pictureButton.position(positions[0][2].x + capture.width / 2 - pictureButton.width / 2, positions[0][2].y);
  else pictureButton.position(positions[0][2].x + capture.width / 2 - pictureButton.width / 2 - 4, positions[0][2].y);
  videoButton.position(positions[0][2].x + capture.width / 2 - videoButton.width / 2, positions[0][2].y + pictureButton.height + marginHeight / 4);

  // ----- Capture grid ----- //
  // Row 1
  image(inputFeed, positions[0][0].x, positions[0][0].y, setWidth, setHeight);
  hoverEffect("Webcam\nImage", positions[0][0].x, positions[0][0].y, capture.width, capture.height);
  let midWidth = positions[0][0].x + capture.width / 2;
  let midHeight = positions[0][0].y + capture.height / 2 - (textSize() * 1) / 2; // NOTE: textSize() * <number of line break(s)>
  text(hoverText, midWidth, midHeight);

  captureEditGrey(inputFeed, positions[0][1].x, positions[0][1].y, setWidth, setHeight);
  hoverEffect("Greyscale\nand\nBrightness", positions[0][1].x, positions[0][1].y, capture.width, capture.height);
  midWidth = positions[0][1].x + capture.width / 2;
  midHeight = positions[0][1].y + capture.height / 2 - (textSize() * 2) / 2;
  text(hoverText, midWidth, midHeight);
  brightSlider.position(positions[0][1].x, positions[0][1].y + capture.height + brightSlider.height);
  text("Brightness: " + brightSlider.value() + "%", brightSlider.x + brightSlider.width / 2, brightSlider.y);

  // Row 2 NOTE unsure if this is correct
  captureEditR(inputFeed, positions[1][0].x, positions[1][0].y, setWidth, setHeight);
  hoverEffect("Red Channel", positions[1][0].x, positions[1][0].y, capture.width, capture.height);
  midWidth = positions[1][0].x + capture.width / 2;
  midHeight = positions[1][0].y + capture.height / 2 + textSize() / 2; //NOTE: no line breaks = textSize() / 2
  text(hoverText, midWidth, midHeight);
  redSlider.position(positions[1][0].x, positions[1][0].y + capture.height + redSlider.height);
  text("Red Value: " + redSlider.value(), redSlider.x + redSlider.width / 2, redSlider.y);

  captureEditG(inputFeed, positions[1][1].x, positions[1][1].y, setWidth, setHeight);
  hoverEffect("Green Channel", positions[1][1].x, positions[1][1].y, capture.width, capture.height);
  midWidth = positions[1][1].x + capture.width / 2;
  midHeight = positions[1][1].y + capture.height / 2 + textSize() / 2;
  text(hoverText, midWidth, midHeight);
  greenSlider.position(positions[1][1].x, positions[1][1].y + capture.height + greenSlider.height);
  text("Green Value: " + greenSlider.value(), greenSlider.x + greenSlider.width / 2, greenSlider.y);

  captureEditB(inputFeed, positions[1][2].x, positions[1][2].y, setWidth, setHeight);
  hoverEffect("Blue Channel", positions[1][2].x, positions[1][2].y, capture.width, capture.height);
  midWidth = positions[1][2].x + capture.width / 2;
  midHeight = positions[1][2].y + capture.height / 2 + textSize() / 2;
  text(hoverText, midWidth, midHeight);
  blueSlider.position(positions[1][2].x, positions[1][2].y + capture.height + blueSlider.height);
  text("Blue Value: " + blueSlider.value(), blueSlider.x + blueSlider.width / 2, blueSlider.y);

  // Row 3 NOTE unsure if this is correct
  captureEditSegment1(inputFeed, positions[2][0].x, positions[2][0].y, setWidth, setHeight);
  hoverEffect("Segmented Image", positions[2][0].x, positions[2][0].y, capture.width, capture.height);
  midWidth = positions[2][0].x + capture.width / 2;
  midHeight = positions[2][0].y + capture.height / 2 + textSize() / 2;
  text(hoverText, midWidth, midHeight);
  redRemovedSlider.position(positions[2][0].x, positions[2][0].y + capture.height + redRemovedSlider.height);
  text("Red Removed: " + redRemovedSlider.value(), redRemovedSlider.x + redRemovedSlider.width / 2, redRemovedSlider.y);

  captureEditSegment2(inputFeed, positions[2][1].x, positions[2][1].y, setWidth, setHeight);
  hoverEffect("Segmented Image", positions[2][1].x, positions[2][1].y, capture.width, capture.height);
  midWidth = positions[2][1].x + capture.width / 2;
  midHeight = positions[2][1].y + capture.height / 2 + textSize() / 2;
  text(hoverText, midWidth, midHeight);
  greenRemovedSlider.position(positions[2][1].x, positions[2][1].y + capture.height + greenRemovedSlider.height);
  text("Green Removed: " + greenRemovedSlider.value(), greenRemovedSlider.x + greenRemovedSlider.width / 2, greenRemovedSlider.y);

  captureEditSegment3(inputFeed, positions[2][2].x, positions[2][2].y, setWidth, setHeight);
  hoverEffect("Segmented Image", positions[2][2].x, positions[2][2].y, capture.width, capture.height);
  midWidth = positions[2][2].x + capture.width / 2;
  midHeight = positions[2][2].y + capture.height / 2 + textSize() / 2;
  text(hoverText, midWidth, midHeight);
  blueRemovedSlider.position(positions[2][2].x, positions[2][2].y + capture.height + blueRemovedSlider.height);
  text("Blue Removed: " + blueRemovedSlider.value(), blueRemovedSlider.x + blueRemovedSlider.width / 2, blueRemovedSlider.y);

  // Row 4 TODO
  captureEditRepeat(inputFeed, positions[3][0].x, positions[3][0].y, setWidth, setHeight);
  hoverEffect("Webcam\nImage\n\n(Repeat)", positions[3][0].x, positions[3][0].y, capture.width, capture.height);
  midWidth = positions[3][0].x + capture.width / 2;
  midHeight = positions[3][0].y + capture.height / 2 - (textSize() * 3) / 2;
  text(hoverText, midWidth, midHeight);

  captureEditColourSpace1(inputFeed, positions[3][1].x, positions[3][1].y, setWidth, setHeight);
  hoverEffect("Colour Space\n(Conversion)\n1", positions[3][1].x, positions[3][1].y, capture.width, capture.height);
  midWidth = positions[3][1].x + capture.width / 2;
  midHeight = positions[3][1].y + capture.height / 2 - (textSize() * 2) / 2;
  text(hoverText, midWidth, midHeight);

  captureEditColourSpace2(inputFeed, positions[3][2].x, positions[3][2].y, setWidth, setHeight);
  hoverEffect("Colour Space\n(Conversion)\n2", positions[3][2].x, positions[3][2].y, capture.width, capture.height);
  midWidth = positions[3][2].x + capture.width / 2;
  midHeight = positions[3][2].y + capture.height / 2 - (textSize() * 2) / 2;
  text(hoverText, midWidth, midHeight);

  // Row 5 TODO
  captureEditFaceDetect(inputFeed, positions[4][0].x, positions[4][0].y, setWidth, setHeight);
  hoverEffect("Face Detection\nand\nReplaced\nFace Images", positions[4][0].x, positions[4][0].y, capture.width, capture.height);
  midWidth = positions[4][0].x + capture.width / 2;
  midHeight = positions[4][0].y + capture.height / 2 - (textSize() * 3) / 2;
  text(hoverText, midWidth, midHeight);

  captureEditColourSpace1Segment(inputFeed, positions[4][1].x, positions[4][1].y, setWidth, setHeight);
  hoverEffect("Segmented Image\nfrom\nColour Space\n(Conversion)\n1", positions[4][1].x, positions[4][1].y, capture.width, capture.height);
  midWidth = positions[4][1].x + capture.width / 2;
  midHeight = positions[4][1].y + capture.height / 2 - (textSize() * 4) / 2;
  text(hoverText, midWidth, midHeight);

  captureEditColourSpace2Segment(inputFeed, positions[4][2].x, positions[4][2].y, setWidth, setHeight);
  hoverEffect("Segmented Image\nfrom\nColour Space\n(Conversion)\n2", positions[4][2].x, positions[4][2].y, capture.width, capture.height);
  midWidth = positions[4][2].x + capture.width / 2;
  midHeight = positions[4][2].y + capture.height / 2 - (textSize() * 4) / 2;
  text(hoverText, midWidth, midHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function hoverEffect(text, x, y, w, h) {
  if (
    //format
    mouseX > x &&
    mouseX < x + w &&
    mouseY > y &&
    mouseY < y + h
  ) {
    fill(0, 200);
    rect(x, y, w, h);
    fill(255);
    hoverText = text;
  } else {
    hoverText = "";
  }
}

/*
NOTE
actual 'capture' is at position (0, 0)
image() simply draws it at position (margin, margin)
thus, have to copy from (0, 0) to (0, 0), then simply move the copy using image()
*/

// Row 1
function captureEditGrey(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = captureCopy.pixels[index + 0];
      let chanG = captureCopy.pixels[index + 1];
      let chanB = captureCopy.pixels[index + 2];
      let grey = (chanR + chanG + chanB) / 3;
      let bright = brightSlider.value() / 100;
      // "Prevent pixel intensity from going beyond 255"
      let output = min(grey * bright, 255);
      captureCopy.pixels[index + 0] = output;
      captureCopy.pixels[index + 1] = output;
      captureCopy.pixels[index + 2] = output;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

// Row 2
function captureEditR(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = captureCopy.pixels[index + 0];
      let chanG = 0;
      let chanB = 0;
      captureCopy.pixels[index + 0] = min(chanR, redSlider.value());
      captureCopy.pixels[index + 1] = chanG;
      captureCopy.pixels[index + 2] = chanB;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

function captureEditG(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = 0;
      let chanG = captureCopy.pixels[index + 1];
      let chanB = 0;
      captureCopy.pixels[index + 0] = chanR;
      captureCopy.pixels[index + 1] = min(chanG, greenSlider.value());
      captureCopy.pixels[index + 2] = chanB;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

function captureEditB(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = 0;
      let chanG = 0;
      let chanB = captureCopy.pixels[index + 2];
      captureCopy.pixels[index + 0] = chanR;
      captureCopy.pixels[index + 1] = chanG;
      captureCopy.pixels[index + 2] = min(chanB, blueSlider.value());
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

// Row 3
function captureEditSegment1(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = captureCopy.pixels[index + 0];
      let chanG = captureCopy.pixels[index + 1];
      let chanB = captureCopy.pixels[index + 2];
      captureCopy.pixels[index + 0] = chanR - redRemovedSlider.value();
      captureCopy.pixels[index + 1] = chanG;
      captureCopy.pixels[index + 2] = chanB;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

function captureEditSegment2(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = captureCopy.pixels[index + 0];
      let chanG = captureCopy.pixels[index + 1];
      let chanB = captureCopy.pixels[index + 2];
      captureCopy.pixels[index + 0] = chanR;
      captureCopy.pixels[index + 1] = chanG - greenRemovedSlider.value();
      captureCopy.pixels[index + 2] = chanB;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

function captureEditSegment3(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = captureCopy.pixels[index + 0];
      let chanG = captureCopy.pixels[index + 1];
      let chanB = captureCopy.pixels[index + 2];
      captureCopy.pixels[index + 0] = chanR;
      captureCopy.pixels[index + 1] = chanG;
      captureCopy.pixels[index + 2] = chanB - blueRemovedSlider.value();
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

// Row 4
function captureEditRepeat(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  image(captureCopy, x, y, w, h);
}

function captureEditColourSpace1(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = captureCopy.pixels[index + 0];
      let chanG = captureCopy.pixels[index + 1];
      let chanB = captureCopy.pixels[index + 2];
      let chanA = captureCopy.pixels[index + 3];
      captureCopy.pixels[index + 0] = chanR;
      captureCopy.pixels[index + 1] = chanG;
      captureCopy.pixels[index + 2] = chanB;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

function captureEditColourSpace2(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = captureCopy.pixels[index + 0];
      let chanG = captureCopy.pixels[index + 1];
      let chanB = captureCopy.pixels[index + 2];
      let chanA = captureCopy.pixels[index + 3];
      captureCopy.pixels[index + 0] = chanR;
      captureCopy.pixels[index + 1] = chanG;
      captureCopy.pixels[index + 2] = chanB;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

// Row 5
function captureEditFaceDetect(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = captureCopy.pixels[index + 0];
      let chanG = captureCopy.pixels[index + 1];
      let chanB = captureCopy.pixels[index + 2];
      let chanA = captureCopy.pixels[index + 3];
      captureCopy.pixels[index + 0] = chanR;
      captureCopy.pixels[index + 1] = chanG;
      captureCopy.pixels[index + 2] = chanB;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

function captureEditColourSpace1Segment(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = captureCopy.pixels[index + 0];
      let chanG = captureCopy.pixels[index + 1];
      let chanB = captureCopy.pixels[index + 2];
      let chanA = captureCopy.pixels[index + 3];
      captureCopy.pixels[index + 0] = chanR;
      captureCopy.pixels[index + 1] = chanG;
      captureCopy.pixels[index + 2] = chanB;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

function captureEditColourSpace2Segment(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = captureCopy.pixels[index + 0];
      let chanG = captureCopy.pixels[index + 1];
      let chanB = captureCopy.pixels[index + 2];
      let chanA = captureCopy.pixels[index + 3];
      captureCopy.pixels[index + 0] = chanR;
      captureCopy.pixels[index + 1] = chanG;
      captureCopy.pixels[index + 2] = chanB;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}
