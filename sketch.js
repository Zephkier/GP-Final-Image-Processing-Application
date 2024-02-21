let capture;
let setWidth = 640 / 4; // minimum = 160
let setHeight = 480 / 4; // minimum = 120
let marginWidth = 20;
let marginHeight = 40;
let buttonMargin = marginHeight / 4;
let positions = []; // positions to end up like this: [ [{x,y}, {x,y}, {x,y}], repeat 4 more times ]

// For picture-taking and resuming video
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
let cyanSlider;
let magentaSlider;
let yellowSlider;
let hueSlider;
let satSlider;
let valSlider;

// For face detection (ensure 'Effect' variable is added to setAllEffectsFalse())
let detector;

let detectDefaultButton;
let detectGreyButton;
let detectBlurButton;
let detectConvertButton;
let detectPixelButton;
let detectNegativeButton;

let detectDefaultEffect = true;
let detectGreyEffect = false;
let detectBlurEffect = false;
let detectConvertEffect = false;
let detectPixelEffect = false;
let detectNegativeEffect = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Setup defaults
  textAlign(CENTER);
  fill(255);
  noStroke();

  pixelDensity(1);
  capture = createCapture(VIDEO);
  capture.size(setWidth, setHeight);
  capture.hide();

  // ----- For picture-taking and resuming video ----- //
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

  // ----- For captures ----- //
  brightSlider = createSlider(0, 300, 120, 1);
  redSlider = createSlider(0, 255, 255, 1);
  greenSlider = createSlider(0, 255, 255, 1);
  blueSlider = createSlider(0, 255, 255, 1);
  redRemovedSlider = createSlider(0, 255, 0, 1);
  greenRemovedSlider = createSlider(0, 255, 0, 1);
  blueRemovedSlider = createSlider(0, 255, 0, 1);
  cyanSlider = createSlider(0, 100, 100, 1);
  magentaSlider = createSlider(0, 100, 100, 1);
  yellowSlider = createSlider(0, 100, 100, 1);
  hueSlider = createSlider(0, 360, 360, 1);
  satSlider = createSlider(0, 100, 100, 1);
  valSlider = createSlider(0, 100, 100, 1);

  let sliders = [];
  sliders.push(brightSlider, redSlider, greenSlider, blueSlider, redRemovedSlider, greenRemovedSlider, blueRemovedSlider, cyanSlider, magentaSlider, yellowSlider, hueSlider, satSlider, valSlider);
  for (let i = 0; i < sliders.length; i++) {
    sliders[i].style("width", capture.width + "px"); // Set slider's width to be capture's width by default
  }

  // ----- For face detection ----- //
  let scaleFactor = 1.2;
  let classifier = objectdetect.frontalface;
  detector = new objectdetect.detector(setWidth, setHeight, scaleFactor, classifier);

  // Button creation (tried using loop to createButton(), doesn't work)
  detectDefaultButton = createButton("Default");
  detectGreyButton = createButton("Greyscale");
  detectBlurButton = createButton("Blur");
  detectConvertButton = createButton("HSV Mode");
  detectPixelButton = createButton("Pixelate");
  detectNegativeButton = createButton("Negative");

  // Button function
  detectDefaultButton.mousePressed(function () {
    setAllEffectsFalse();
    detectDefaultEffect = true;
  });

  detectGreyButton.mousePressed(function () {
    setAllEffectsFalse();
    detectGreyEffect = true;
  });

  detectBlurButton.mousePressed(function () {
    setAllEffectsFalse();
    detectBlurEffect = true;
  });

  detectConvertButton.mousePressed(function () {
    setAllEffectsFalse();
    detectConvertEffect = true;
  });

  detectPixelButton.mousePressed(function () {
    setAllEffectsFalse();
    detectPixelEffect = true;
  });

  detectNegativeButton.mousePressed(function () {
    setAllEffectsFalse();
    detectNegativeEffect = true;
  });
}

function draw() {
  background(20);

  // ----- Update positions in case of window resizing ----- //
  let rowCount = 5;
  let colCount = 3;
  for (let i = 0; i < rowCount; i++) {
    positions[i] = [];
    for (let j = 0; j < colCount; j++) {
      let totalWidth = colCount * (setWidth + marginWidth) - marginWidth;
      let extraHeight = detectDefaultButton.height * 3 + buttonMargin; // Any 3 buttons can be used + (buttonMargin)
      let totalHeight = rowCount * (setHeight + marginHeight) - marginHeight + extraHeight;
      let startX = (width - totalWidth) / 2;
      let startY = (height - totalHeight) / 2;
      positions[i][j] = {
        x: startX + j * (setWidth + marginWidth),
        y: startY + i * (setHeight + marginHeight),
      };
    }
  }

  // Shift pictureButton leftward a tiny bit when its text changes
  let buttonPosX = positions[0][2].x + capture.width / 2;
  let buttonPosY = positions[0][2].y;
  if (!pictureTaken) pictureButton.position(buttonPosX - pictureButton.width / 2, buttonPosY);
  else pictureButton.position(buttonPosX - pictureButton.width / 2 - 4, buttonPosY); // Move leftwards slightly due to longer button text
  videoButton.position(buttonPosX - videoButton.width / 2, buttonPosY + pictureButton.height + buttonMargin);

  // ----- Capture grid ----- //
  // Row 1
  image(inputFeed, positions[0][0].x, positions[0][0].y, setWidth, setHeight);
  hoverEffectAndText(positions[0][0].x, positions[0][0].y, capture.width, capture.height, "Webcam\nImage", 1);

  captureEditGrey(inputFeed, positions[0][1].x, positions[0][1].y, setWidth, setHeight);
  hoverEffectAndText(positions[0][1].x, positions[0][1].y, capture.width, capture.height, "Greyscale\nand\nBrightness at " + brightSlider.value() + "%", 2);
  sliderAndText(brightSlider, positions[0][1].x, positions[0][1].y, "Brightness", "%");

  // Row 2
  captureEditR(inputFeed, positions[1][0].x, positions[1][0].y, setWidth, setHeight);
  hoverEffectAndText(positions[1][0].x, positions[1][0].y, capture.width, capture.height, "Red Channel", 0);
  sliderAndText(redSlider, positions[1][0].x, positions[1][0].y, "Red Value");

  captureEditG(inputFeed, positions[1][1].x, positions[1][1].y, setWidth, setHeight);
  hoverEffectAndText(positions[1][1].x, positions[1][1].y, capture.width, capture.height, "Green Channel", 0);
  sliderAndText(greenSlider, positions[1][1].x, positions[1][1].y, "Green Value");

  captureEditB(inputFeed, positions[1][2].x, positions[1][2].y, setWidth, setHeight);
  hoverEffectAndText(positions[1][2].x, positions[1][2].y, capture.width, capture.height, "Blue Channel", 0);
  sliderAndText(blueSlider, positions[1][2].x, positions[1][2].y, "Blue Value");

  // Row 3
  captureEditSegment1(inputFeed, positions[2][0].x, positions[2][0].y, setWidth, setHeight);
  hoverEffectAndText(positions[2][0].x, positions[2][0].y, capture.width, capture.height, "Segmented Image", 0);
  sliderAndText(redRemovedSlider, positions[2][0].x, positions[2][0].y, "Red Removed");

  captureEditSegment2(inputFeed, positions[2][1].x, positions[2][1].y, setWidth, setHeight);
  hoverEffectAndText(positions[2][1].x, positions[2][1].y, capture.width, capture.height, "Segmented Image", 0);
  sliderAndText(greenRemovedSlider, positions[2][1].x, positions[2][1].y, "Green Removed");

  captureEditSegment3(inputFeed, positions[2][2].x, positions[2][2].y, setWidth, setHeight);
  hoverEffectAndText(positions[2][2].x, positions[2][2].y, capture.width, capture.height, "Segmented Image", 0);
  sliderAndText(blueRemovedSlider, positions[2][2].x, positions[2][2].y, "Blue Removed");

  // Row 4
  captureEditRepeat(inputFeed, positions[3][0].x, positions[3][0].y, setWidth, setHeight);
  hoverEffectAndText(positions[3][0].x, positions[3][0].y, capture.width, capture.height, "Webcam\nImage\n\n(Repeat)", 3);

  captureEditColourSpace1(inputFeed, positions[3][1].x, positions[3][1].y, setWidth, setHeight);
  hoverEffectAndText(positions[3][1].x, positions[3][1].y, capture.width, capture.height, "Colour Space\n(Conversion)\n1\n\nRGB to CMY", 4);

  captureEditColourSpace2(inputFeed, positions[3][2].x, positions[3][2].y, setWidth, setHeight);
  hoverEffectAndText(positions[3][2].x, positions[3][2].y, capture.width, capture.height, "Colour Space\n(Conversion)\n2\n\nRGB to HSV", 4);

  // Row 5 TODO
  captureEditFaceDetect(inputFeed, positions[4][0].x, positions[4][0].y, setWidth, setHeight);
  hoverEffectAndText(positions[4][0].x, positions[4][0].y, capture.width, capture.height, "Face Detection\nand\nReplaced\nFace Images", 3);
  // Left side buttons
  detectDefaultButton.position(positions[4][0].x, positions[4][0].y + inputFeed.height + buttonMargin);
  detectGreyButton.position(positions[4][0].x, detectDefaultButton.y + detectDefaultButton.height);
  detectBlurButton.position(positions[4][0].x, detectGreyButton.y + detectGreyButton.height);
  // Right side buttons
  detectConvertButton.position(positions[4][0].x + inputFeed.width - detectConvertButton.width, positions[4][0].y + inputFeed.height + buttonMargin);
  detectPixelButton.position(positions[4][0].x + inputFeed.width - detectPixelButton.width, detectConvertButton.y + detectConvertButton.height);
  detectNegativeButton.position(positions[4][0].x + inputFeed.width - detectNegativeButton.width, detectPixelButton.y + detectPixelButton.height);

  captureEditColourSpace1Segment(inputFeed, positions[4][1].x, positions[4][1].y, setWidth, setHeight);
  hoverEffectAndText(positions[4][1].x, positions[4][1].y, capture.width, capture.height, "Segmented Image\nfrom\nColour Space\n(Conversion)\n1", 4);
  sliderAndTextAlignLeft(cyanSlider, inputFeed.width * 0.55, positions[4][1].x, positions[4][1].y, "Cyan", "%");
  sliderAndTextAlignLeft(magentaSlider, inputFeed.width * 0.55, positions[4][1].x, positions[4][1].y + cyanSlider.height * 1.2, "Magenta", "%");
  sliderAndTextAlignLeft(yellowSlider, inputFeed.width * 0.55, positions[4][1].x, positions[4][1].y + cyanSlider.height * 1.2 + magentaSlider.height * 1.2, "Yellow", "%");

  captureEditColourSpace2Segment(inputFeed, positions[4][2].x, positions[4][2].y, setWidth, setHeight);
  hoverEffectAndText(positions[4][2].x, positions[4][2].y, capture.width, capture.height, "Segmented Image\nfrom\nColour Space\n(Conversion)\n2", 4);
  sliderAndTextAlignLeft(hueSlider, inputFeed.width * 0.45, positions[4][2].x, positions[4][2].y, "Hue", "°");
  sliderAndTextAlignLeft(satSlider, inputFeed.width * 0.45, positions[4][2].x, positions[4][2].y + hueSlider.height * 1.2, "Sat.", "%");
  sliderAndTextAlignLeft(valSlider, inputFeed.width * 0.45, positions[4][2].x, positions[4][2].y + hueSlider.height * 1.2 + satSlider.height * 1.2, "Value", "%");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Helper functions
function hoverEffectAndText(x, y, w, h, string, linebreakCount) {
  // Hover effect
  if (
    // format
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

  // Text
  let midX = x + w / 2;
  let midY;
  if (linebreakCount == 0) midY = y + h / 2 + textSize() / 2;
  else midY = y + h / 2 - (textSize() * linebreakCount) / 2;
  text(string, midX, midY);
}

function sliderAndText(incomingSlider, inputFeedX, inputFeedY, string, stringSuffix = "") {
  // Text (based on inputFeed's dimensions and incomingSlider's height only)
  text(
    // format
    string + ": " + incomingSlider.value() + stringSuffix,
    inputFeedX + inputFeed.width / 2,
    inputFeedY + inputFeed.height + incomingSlider.height
  );

  // Slider (based on inputFeed's dimensions)
  incomingSlider.position(
    // format
    inputFeedX,
    inputFeedY + inputFeed.height + incomingSlider.height
  );
}

function sliderAndTextAlignLeft(incomingSlider, sliderWidth, inputFeedX, inputFeedY, string, stringSuffix = "") {
  // Text (based on inputFeed's dimensions and incomingSlider's height only)
  textAlign(LEFT);
  text(
    // format
    string + ": " + incomingSlider.value() + stringSuffix,
    inputFeedX,
    inputFeedY + inputFeed.height + incomingSlider.height
  );
  textAlign(CENTER); // Reset to default

  // Slider (based on inputFeed's dimensions)
  incomingSlider.position(
    // format
    inputFeedX + sliderWidth,
    inputFeedY + inputFeed.height + textSize() / 8 // NOTE: added "+ textSize() / 8" to centralise a tiny bit
  );
  incomingSlider.style("width", inputFeed.width - sliderWidth + "px");
}

function setAllEffectsFalse() {
  detectDefaultEffect = false;
  detectGreyEffect = false;
  detectBlurEffect = false;
  detectConvertEffect = false;
  detectPixelEffect = false;
  detectNegativeEffect = false;
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

      /*
      Useful links
      https://users.ece.utexas.edu/~bevans/talks/hp-dsp-seminar/07_C6xImage2/tsld011.htm
      https://www.youtube.com/watch?v=X8OY-iwK_Kw
      https://colormine.org/convert/rgb-to-cmy
      */

      // ----- Convert from RGB to CMY: note that RGB 255 = CMY 0 ----- //
      // Normalise RGB from 0~255 to 0~1
      chanR = map(chanR, 0, 255, 0, 1);
      chanG = map(chanG, 0, 255, 0, 1);
      chanB = map(chanB, 0, 255, 0, 1);

      // Calculate CMY
      let myCyan = 1 - chanR;
      let myMagenta = 1 - chanG;
      let myYellow = 1 - chanB;

      // Change output and reset range back to 0~255
      captureCopy.pixels[index + 0] = map(myCyan, 0, 1, 255, 0);
      captureCopy.pixels[index + 1] = map(myMagenta, 0, 1, 255, 0);
      captureCopy.pixels[index + 2] = map(myYellow, 0, 1, 255, 0);
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

/*
TODO
===== ===== ===== ===== =====
choose one formula to use

then, ensure the following function uses the same one, as it is copy-pasted from here to there:
- captureEditColourSpace2Segment()
- faceDetectEdit()'s 'detectConvertEffect'

then refactor so it can easily be re-used
*/
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

      /*
      Useful links
      https://cs.stackexchange.com/questions/64549/convert-hsv-to-rgb-colors
      */

      // ----- Convert from RGB to HSV: note that H = 0~360 / S = 0~1 / V = 0~1 ----- //

      // ----- Attempt 1: based on own source (the link above)
      // Value
      let myValueMax = max(chanR, chanG, chanB);
      let myValueMin = min(chanR, chanG, chanB);
      // Saturation
      let mySaturation;
      if (myValueMax == 0 || myValueMin == 0) mySaturation = 0;
      else mySaturation = (myValueMax - myValueMin) / myValueMax;
      // Hue
      let myHue;
      if (myValueMax == chanR) myHue = 60 * ((0 + (chanG - chanB)) / (myValueMax - myValueMin));
      else if (myValueMax == chanG) myHue = 60 * ((2 + (chanB - chanR)) / (myValueMax - myValueMin));
      else if (myValueMax == chanB) myHue = 60 * ((4 + (chanR - chanG)) / (myValueMax - myValueMin));
      if (myHue < 0) myHue += 360;
      // Change output and reset range back to 0~255
      captureCopy.pixels[index + 0] = map(myHue, 0, 360, 0, 255);
      captureCopy.pixels[index + 1] = map(mySaturation, 0, 1, 0, 255);
      captureCopy.pixels[index + 2] = map(myValueMax, 0, 1, 0, 255);

      // // ----- Attempt 2: based on Coursera PDF
      // let maxRGB = max(chanR, chanG, chanB);
      // let minRGB = min(chanR, chanG, chanB);
      // // Saturation
      // let mySaturation = (maxRGB - minRGB) / maxRGB;
      // // Value
      // let myValue = maxRGB;
      // // Hue
      // let myHue;
      // let chanRPrime = (maxRGB - chanR) / (maxRGB - minRGB);
      // let chanGPrime = (maxRGB - chanG) / (maxRGB - minRGB);
      // let chanBPrime = (maxRGB - chanB) / (maxRGB - minRGB);
      // if (mySaturation == 0) {
      //   myHue = undefined;
      // } else {
      //   if (chanR == maxRGB && chanG == minRGB) myHue = 5 + chanBPrime;
      //   else if (chanR == maxRGB && chanG != minRGB) myHue = 1 - chanGPrime;
      //   else if (chanG == maxRGB && chanB == minRGB) myHue = chanRPrime + 1;
      //   else if (chanG == maxRGB && chanB != minRGB) myHue = 3 - chanBPrime;
      //   else if (chanR == maxRGB) myHue = 3 + chanGPrime;
      //   else myHue = 5 - chanRPrime;
      // }
      // myHue *= 60;
      // myHue %= 360;
      // // Change output and reset range back to 0~255
      // captureCopy.pixels[index + 0] = map(myHue, 0, 360, 0, 255);
      // captureCopy.pixels[index + 1] = map(mySaturation, 0, 1, 0, 255);
      // captureCopy.pixels[index + 2] = map(maxRGB, 0, 1, 0, 255);
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

// Row 5
function captureEditFaceDetect(src, x, y, w, h) {
  // Display captureCopy
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  image(captureCopy, x, y, w, h);
  captureCopy.loadPixels();

  // Detect face
  let faces = detector.detect(captureCopy.canvas);
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    if (face[4] > 4) {
      // Default effect
      if (detectDefaultEffect) {
        push();
        translate(x, y);
        // Setup
        noFill();
        stroke(255);
        strokeWeight(2);
        // Draw box
        rect(face[0], face[1], face[2], face[3]);
        pop();
        // Reset to default
        fill(255);
        noStroke();
      } else {
        // Other effects
        faceDetectEdit(captureCopy, int(face[0]), int(face[1]), int(face[2]), int(face[3]));
        captureCopy.updatePixels();
        image(captureCopy, x, y, w, h);
      }
    }
  }
}

/*
TODO
===== ===== ===== ===== =====
2) add sliders for every effect if possible
*/
function faceDetectEdit(src, faceX, faceY, faceWidth, faceHeight) {
  for (let x = faceX; x < faceX + faceWidth; x++) {
    for (let y = faceY; y < faceY + faceHeight; y++) {
      let index = (src.width * y + x) * 4;
      let chanR = src.pixels[index + 0];
      let chanG = src.pixels[index + 1];
      let chanB = src.pixels[index + 2];
      // Grey effect
      if (detectGreyEffect) {
        let grey = (chanR + chanG + chanB) / 3;
        src.pixels[index + 0] = grey;
        src.pixels[index + 1] = grey;
        src.pixels[index + 2] = grey;

        // Blur effect
      } else if (detectBlurEffect) {
        let myMatrix = createNormalBlurMatrix(15);
        let myConv = convolution(x, y, myMatrix, src);
        src.pixels[index + 0] = myConv[0];
        src.pixels[index + 1] = myConv[1];
        src.pixels[index + 2] = myConv[2];

        // Convert colour effect, copy-pasted from captureEditColourSpace2() above
      } else if (detectConvertEffect) {
        let myValueMax = max(chanR, chanG, chanB);
        let myValueMin = min(chanR, chanG, chanB);
        let mySaturation;
        if (myValueMax == 0 || myValueMin == 0) mySaturation = 0;
        else mySaturation = (myValueMax - myValueMin) / myValueMax;
        let myHue;
        if (myValueMax == chanR) myHue = 60 * ((0 + (chanG - chanB)) / (myValueMax - myValueMin));
        else if (myValueMax == chanG) myHue = 60 * ((2 + (chanB - chanR)) / (myValueMax - myValueMin));
        else if (myValueMax == chanB) myHue = 60 * ((4 + (chanR - chanG)) / (myValueMax - myValueMin));
        if (myHue < 0) myHue += 360;
        src.pixels[index + 0] = map(myHue, 0, 360, 0, 255);
        src.pixels[index + 1] = map(mySaturation, 0, 1, 0, 255);
        src.pixels[index + 2] = map(myValueMax, 0, 1, 0, 255);

        // Pixelate effect
      } else if (detectPixelEffect) {
        createPixelEffect(10, src, faceX, faceY, faceWidth, faceHeight);

        // Negative effect
      } else if (detectNegativeEffect) {
        src.pixels[index + 0] = map(chanR, 0, 255, 255, 0);
        src.pixels[index + 1] = map(chanG, 0, 255, 255, 0);
        src.pixels[index + 2] = map(chanB, 0, 255, 255, 0);
      }
    }
  }
}

// faceDetectEdit() helper functions
function createNormalBlurMatrix(matrixSize) {
  let totalElements = matrixSize * matrixSize;
  let matrix = [];

  for (let i = 0; i < matrixSize; i++) {
    matrix[i] = [];
    for (let j = 0; j < matrixSize; j++) {
      matrix[i].push(1 / totalElements);
    }
  }

  return matrix;
}

function convolution(x, y, matrix, src) {
  let matrixSize = matrix.length;
  let totalRed = 0.0;
  let totalGreen = 0.0;
  let totalBlue = 0.0;
  let offset = floor(matrixSize / 2);

  for (let i = 0; i < matrixSize; i++) {
    for (let j = 0; j < matrixSize; j++) {
      // Get pixel loc within convolution matrix
      let xLoc = x + i - offset;
      let yLoc = y + j - offset;
      let index = (xLoc + src.width * yLoc) * 4;
      index = constrain(index, 0, src.pixels.length - 1);
      totalRed += src.pixels[index + 0] * matrix[i][j];
      totalGreen += src.pixels[index + 1] * matrix[i][j];
      totalBlue += src.pixels[index + 2] * matrix[i][j];
    }
  }

  return [totalRed, totalGreen, totalBlue];
}

function createPixelEffect(pixelSize, src, faceX, faceY, faceWidth, faceHeight) {
  // Within face detected area...
  for (let x = faceX; x < faceX + faceWidth; x += pixelSize) {
    for (let y = faceY; y < faceY + faceHeight; y += pixelSize) {
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      // Within every block of pixelSize...
      for (let i = 0; i < pixelSize; i++) {
        for (let j = 0; j < pixelSize; j++) {
          let index = (src.width * (y + j) + (x + i)) * 4;
          let chanR = src.pixels[index + 0];
          let chanG = src.pixels[index + 1];
          let chanB = src.pixels[index + 2];
          // Get sum of RGB values in the size of pixelSize
          sumR += chanR;
          sumG += chanG;
          sumB += chanB;
        }
      }

      // Get average RGB values in every pixelSize block
      let pixelArea = pixelSize * pixelSize;
      let avgR = sumR / pixelArea;
      let avgG = sumG / pixelArea;
      let avgB = sumB / pixelArea;

      // Within every block of pixelSize...
      for (let i = 0; i < pixelSize; i++) {
        for (let j = 0; j < pixelSize; j++) {
          let index = (src.width * (y + j) + (x + i)) * 4;
          // Apply average RGB values to the corresponding RGB channels
          src.pixels[index + 0] = avgR;
          src.pixels[index + 1] = avgG;
          src.pixels[index + 2] = avgB;
        }
      }
    }
  }
}

// Copy-pasted from captureEditColourSpace1() above
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

      // Normalise RGB and calculate CMY
      let myCyan = 1 - map(chanR, 0, 255, 0, 1);
      let myMagenta = 1 - map(chanG, 0, 255, 0, 1);
      let myYellow = 1 - map(chanB, 0, 255, 0, 1);

      // Change output and reset range back to 0~255
      captureCopy.pixels[index + 0] = map(myCyan * (cyanSlider.value() / 100), 0, 1, 255, 0);
      captureCopy.pixels[index + 1] = map(myMagenta * (magentaSlider.value() / 100), 0, 1, 255, 0);
      captureCopy.pixels[index + 2] = map(myYellow * (yellowSlider.value() / 100), 0, 1, 255, 0);
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

// TODO: unsure if slider value is applied correctly (eg. should i "+ hueSlider.value()" instead?)
// Copy-pasted from captureEditColourSpace2() above
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

      // Value
      let myValueMax = max(chanR, chanG, chanB);
      let myValueMin = min(chanR, chanG, chanB);

      // Saturation
      let mySaturation;
      if (myValueMax == 0 || myValueMin == 0) mySaturation = 0;
      else mySaturation = (myValueMax - myValueMin) / myValueMax;

      // Hue
      let myHue;
      if (myValueMax == chanR) myHue = 60 * ((0 + (chanG - chanB)) / (myValueMax - myValueMin));
      else if (myValueMax == chanG) myHue = 60 * ((2 + (chanB - chanR)) / (myValueMax - myValueMin));
      else if (myValueMax == chanB) myHue = 60 * ((4 + (chanR - chanG)) / (myValueMax - myValueMin));
      if (myHue < 0) myHue += 360;

      // Change output and reset range back to 0~255
      captureCopy.pixels[index + 0] = map(myHue * (hueSlider.value() / 360), 0, 360, 0, 255);
      captureCopy.pixels[index + 1] = map(mySaturation * (satSlider.value() / 100), 0, 1, 0, 255);
      captureCopy.pixels[index + 2] = map(myValueMax * (valSlider.value() / 100), 0, 1, 0, 255);
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}
