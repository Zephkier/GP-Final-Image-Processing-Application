let capture;
let setWidth = 640 / 4; // minimum = 160
let setHeight = 480 / 4; // minimum = 120
let marginWidth = 20;
let marginHeight = 60;
let positions = []; // positions to end up like this: [ [{x,y}, {x,y}, {x,y}], repeat 4 more times ]

let inputFeed;
let pictureButton;
let videoButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  angleMode(DEGREES);

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
  });

  videoButton.mousePressed(function () {
    inputFeed = capture;
    pictureButton.html("Take picture");
    videoButton.hide();
  });
}

function draw() {
  background(20);

  // ----- Placed in draw() in case of window resizing  ----- //
  // Update positions due to using 'width' and 'height'
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

  // Update button positions
  pictureButton.position(positions[0][2].x, positions[0][2].y);
  videoButton.position(positions[0][2].x, positions[0][2].y + pictureButton.height + marginHeight / 4);

  // ----- Capture grid ----- //
  // Row 1 DONE
  image(inputFeed, positions[0][0].x, positions[0][0].y, setWidth, setHeight);
  captureEditGrey(inputFeed, positions[0][1].x, positions[0][1].y, setWidth, setHeight);

  // Row 2 DONE
  captureEditR(inputFeed, positions[1][0].x, positions[1][0].y, setWidth, setHeight);
  captureEditG(inputFeed, positions[1][1].x, positions[1][1].y, setWidth, setHeight);
  captureEditB(inputFeed, positions[1][2].x, positions[1][2].y, setWidth, setHeight);

  // Row 3 TODO
  captureEditSegment1(inputFeed, positions[2][0].x, positions[2][0].y, setWidth, setHeight);
  captureEditSegment2(inputFeed, positions[2][1].x, positions[2][1].y, setWidth, setHeight);
  captureEditSegment3(inputFeed, positions[2][2].x, positions[2][2].y, setWidth, setHeight);

  // Row 4 TODO
  captureEditRepeat(inputFeed, positions[3][0].x, positions[3][0].y, setWidth, setHeight); // DONE ?
  captureEditColourSpace1(inputFeed, positions[3][1].x, positions[3][1].y, setWidth, setHeight);
  captureEditColourSpace2(inputFeed, positions[3][2].x, positions[3][2].y, setWidth, setHeight);

  // Row 5 TODO
  captureEditFaceDetect(inputFeed, positions[4][0].x, positions[4][0].y, setWidth, setHeight);
  captureEditColourSpace1Segment(inputFeed, positions[4][1].x, positions[4][1].y, setWidth, setHeight);
  captureEditColourSpace2Segment(inputFeed, positions[4][2].x, positions[4][2].y, setWidth, setHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
      // Value cannot go over 255
      let percentage = 100 / 100;
      let bright = min(255, grey * percentage);
      captureCopy.pixels[index + 0] = bright;
      captureCopy.pixels[index + 1] = bright;
      captureCopy.pixels[index + 2] = bright;
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
      captureCopy.pixels[index + 0] = chanR;
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
      captureCopy.pixels[index + 1] = chanG;
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
      captureCopy.pixels[index + 2] = chanB;
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
      captureCopy.pixels[index + 0] = chanR;
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
      captureCopy.pixels[index + 1] = chanG;
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
      captureCopy.pixels[index + 2] = chanB;
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
      captureCopy.pixels[index + 0] = chanR;
      captureCopy.pixels[index + 1] = chanG;
      captureCopy.pixels[index + 2] = chanB;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}
