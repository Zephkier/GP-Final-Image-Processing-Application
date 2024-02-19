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
  fill(255); // Ensure hoverEffectAndText() resets to this line

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
  hoverEffectAndText(positions[0][0].x, positions[0][0].y, capture.width, capture.height, "Webcam\nImage", 1);

  captureEditGrey(inputFeed, positions[0][1].x, positions[0][1].y, setWidth, setHeight);
  hoverEffectAndText(positions[0][1].x, positions[0][1].y, capture.width, capture.height, "Greyscale\nand\nBrightness + " + brightSlider.value() + "%", 2);
  sliderAndText(brightSlider, positions[0][1].x, positions[0][1].y, "Brightness", "%");

  // Row 2 NOTE unsure if this is correct
  captureEditR(inputFeed, positions[1][0].x, positions[1][0].y, setWidth, setHeight);
  hoverEffectAndText(positions[1][0].x, positions[1][0].y, capture.width, capture.height, "Red Channel", 0);
  sliderAndText(redSlider, positions[1][0].x, positions[1][0].y, "Red Value");

  captureEditG(inputFeed, positions[1][1].x, positions[1][1].y, setWidth, setHeight);
  hoverEffectAndText(positions[1][1].x, positions[1][1].y, capture.width, capture.height, "Green Channel", 0);
  sliderAndText(greenSlider, positions[1][1].x, positions[1][1].y, "Green Value");

  captureEditB(inputFeed, positions[1][2].x, positions[1][2].y, setWidth, setHeight);
  hoverEffectAndText(positions[1][2].x, positions[1][2].y, capture.width, capture.height, "Blue Channel", 0);
  sliderAndText(blueSlider, positions[1][2].x, positions[1][2].y, "Blue Value");

  // Row 3 NOTE unsure if this is correct
  captureEditSegment1(inputFeed, positions[2][0].x, positions[2][0].y, setWidth, setHeight);
  hoverEffectAndText(positions[2][0].x, positions[2][0].y, capture.width, capture.height, "Segmented Image", 0);
  sliderAndText(redRemovedSlider, positions[2][0].x, positions[2][0].y, "Red Removed");

  captureEditSegment2(inputFeed, positions[2][1].x, positions[2][1].y, setWidth, setHeight);
  hoverEffectAndText(positions[2][1].x, positions[2][1].y, capture.width, capture.height, "Segmented Image", 0);
  sliderAndText(greenRemovedSlider, positions[2][1].x, positions[2][1].y, "Green Removed");

  captureEditSegment3(inputFeed, positions[2][2].x, positions[2][2].y, setWidth, setHeight);
  hoverEffectAndText(positions[2][2].x, positions[2][2].y, capture.width, capture.height, "Segmented Image", 0);
  sliderAndText(blueRemovedSlider, positions[2][2].x, positions[2][2].y, "Blue Removed");

  // Row 4 NOTE unsure if this is correct
  captureEditRepeat(inputFeed, positions[3][0].x, positions[3][0].y, setWidth, setHeight);
  hoverEffectAndText(positions[3][0].x, positions[3][0].y, capture.width, capture.height, "Webcam\nImage\n\n(Repeat)", 3);

  captureEditColourSpace1(inputFeed, positions[3][1].x, positions[3][1].y, setWidth, setHeight);
  hoverEffectAndText(positions[3][1].x, positions[3][1].y, capture.width, capture.height, "Colour Space\n(Conversion)\n1\n\nRGB to CMY", 4);

  captureEditColourSpace2(inputFeed, positions[3][2].x, positions[3][2].y, setWidth, setHeight);
  hoverEffectAndText(positions[3][2].x, positions[3][2].y, capture.width, capture.height, "Colour Space\n(Conversion)\n2\n\nRGB to CMY to CMYK", 4);

  // Row 5 TODO
  captureEditFaceDetect(inputFeed, positions[4][0].x, positions[4][0].y, setWidth, setHeight);
  hoverEffectAndText(positions[4][0].x, positions[4][0].y, capture.width, capture.height, "Face Detection\nand\nReplaced\nFace Images", 3);

  captureEditColourSpace1Segment(inputFeed, positions[4][1].x, positions[4][1].y, setWidth, setHeight);
  hoverEffectAndText(positions[4][1].x, positions[4][1].y, capture.width, capture.height, "Segmented Image\nfrom\nColour Space\n(Conversion)\n1", 4);

  captureEditColourSpace2Segment(inputFeed, positions[4][2].x, positions[4][2].y, setWidth, setHeight);
  hoverEffectAndText(positions[4][2].x, positions[4][2].y, capture.width, capture.height, "Segmented Image\nfrom\nColour Space\n(Conversion)\n2", 4);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function hoverEffectAndText(x, y, w, h, string, linebreakCount) {
  if (
    //format
    mouseX > x &&
    mouseX < x + w &&
    mouseY > y &&
    mouseY < y + h
  ) {
    fill(0, 200);
    rect(x, y, w, h);
    fill(255); // Reset to default
  } else {
    string = "";
  }

  /*
  NOTE
  if 0  line break, then "+ textSize() / 2"
  if >0 line break, then "- (textSize() * linebreakCount) / 2"
  */

  let midX = x + w / 2;
  let midY;
  if (linebreakCount == 0) midY = y + h / 2 + textSize() / 2;
  else midY = y + h / 2 - (textSize() * linebreakCount) / 2;

  text(string, midX, midY);
}

function sliderAndText(incomingSlider, sliderX, sliderY, string, stringSuffix = "") {
  incomingSlider.position(
    //format
    sliderX,
    sliderY + capture.height + incomingSlider.height
  );
  text(
    //format
    string + ": " + incomingSlider.value() + stringSuffix,
    incomingSlider.x + incomingSlider.width / 2,
    incomingSlider.y
  );
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
      // See https://users.ece.utexas.edu/~bevans/talks/hp-dsp-seminar/07_C6xImage2/tsld011.htm
      // Convert from RGB to CMY
      let myCyan = 255 - chanR;
      let myMagenta = 255 - chanG;
      let myYellow = 255 - chanB;
      captureCopy.pixels[index + 0] = myCyan;
      captureCopy.pixels[index + 1] = myMagenta;
      captureCopy.pixels[index + 2] = myYellow;
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
      // See https://users.ece.utexas.edu/~bevans/talks/hp-dsp-seminar/07_C6xImage2/tsld011.htm
      // Convert from RGB to CMY
      let myCyan = 255 - chanR;
      let myMagenta = 255 - chanG;
      let myYellow = 255 - chanB;
      // Convert from CMY to CMYK
      let myKey = min(myCyan, myMagenta, myYellow);
      myCyan = (255 * (myCyan - myKey)) / (255 - myKey);
      myMagenta = (255 * (myMagenta - myKey)) / (255 - myKey);
      myYellow = (255 * (myYellow - myKey)) / (255 - myKey);
      captureCopy.pixels[index + 0] = myCyan;
      captureCopy.pixels[index + 1] = myMagenta;
      captureCopy.pixels[index + 2] = myYellow;
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
