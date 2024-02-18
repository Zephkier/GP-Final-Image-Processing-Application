let capture;
let setWidth = 640 / 4;
let setHeight = 480 / 4;
let margin = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  angleMode(DEGREES);

  pixelDensity(1);
  capture = createCapture(VIDEO);
  capture.size(setWidth, setHeight);
  capture.hide();
}

function draw() {
  background(20);

  // reference: positions = [ [{x,y}, {x,y}, {x,y}], repeat 4 more times ]
  let positions = [];
  for (let i = 0; i < 5; i++) {
    positions[i] = [];
    for (let j = 0; j < 3; j++) {
      positions[i][j] = {
        x: margin + j * (setWidth + margin),
        y: margin + i * (setHeight + margin),
      };
    }
  }

  // Original
  image(capture, positions[0][0].x, positions[0][0].y, setWidth, setHeight);

  // Greyscale and brightness + 20%
  captureEditGrey(capture, positions[0][1].x, positions[0][1].y, setWidth, setHeight);

  // Red channel
  captureEditRed(capture, positions[1][0].x, positions[1][0].y, setWidth, setHeight);

  // Green channel
  captureEditGreen(capture, positions[1][1].x, positions[1][1].y, setWidth, setHeight);

  // Blue channel
  captureEditBlue(capture, positions[1][2].x, positions[1][2].y, setWidth, setHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// NOTE: actual 'capture' is at position (0, 0)
//       image() simply draws it at position (margin, margin)
//       thus, have to copy from (0, 0) to (0, 0), then simply move the copy using image()

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
      let bright = min(255, grey * 1.2);
      captureCopy.pixels[index] = bright;
      captureCopy.pixels[index + 1] = bright;
      captureCopy.pixels[index + 2] = bright;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

function captureEditRed(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = captureCopy.pixels[index + 0];
      let chanG = 0;
      let chanB = 0;
      captureCopy.pixels[index] = chanR;
      captureCopy.pixels[index + 1] = chanG;
      captureCopy.pixels[index + 2] = chanB;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

function captureEditGreen(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = 0;
      let chanG = captureCopy.pixels[index + 1];
      let chanB = 0;
      captureCopy.pixels[index] = chanR;
      captureCopy.pixels[index + 1] = chanG;
      captureCopy.pixels[index + 2] = chanB;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

function captureEditBlue(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = 0;
      let chanG = 0;
      let chanB = captureCopy.pixels[index + 2];
      captureCopy.pixels[index] = chanR;
      captureCopy.pixels[index + 1] = chanG;
      captureCopy.pixels[index + 2] = chanB;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}
