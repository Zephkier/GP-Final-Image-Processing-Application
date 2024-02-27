// General
let capture;
let setWidth = 160; // This is the minimum, original = 640
let setHeight = 120; // This is the minimum, original = 480
let marginWidth = 20; // Recommended minimum = 20
let marginHeight = 70; // Recommended minimum = 40 / maximum = 70
let positions = []; // positions to end up like this: [ [{x,y}, {x,y}, {x,y}], repeat 4 more times ]
let hoverToggleButton;
let hoverEffectIsOn = true;

// For exporting
let backgroundColour = 20;
let exportButton;
let exportDelaySlider;
let exportingNow = false;
let allButtonsAndSliders;

// For chaning inputFeed (aka. (un)freezing frame, using image)
let inputFeed;
let freezeButton;
let unfreezeButton;
let incomingImage;
let switchToImageButton;
let showUnfreezeButton = false;

// For captures
let brightSlider;
let redSlider;
let greenSlider;
let blueSlider;
let redThresholdSlider;
let greenThresholdSlider;
let blueThresholdSlider;
let cyanSlider;
let magentaSlider;
let yellowSlider;
let hueSlider;
let satSlider;
let valSlider;

// For threshold
let thresholdToggleBlackButton;
let thresholdToggleIsBlack = true;
let thresholdToggleWhiteButton;
let thresholdToggleIsWhite = false;

// For face detection
let detector;

let detectDefaultButton;
let detectGreyButton;
let detectBlurButton;
let detectConvertButton;
let detectPixelButton;
let detectNegativeButton;

let detectDefaultEffect = true; // Ensure 'Effect' variables are copy-pasted to setAllEffectsFalse()
let detectGreyEffect = false;
let detectBlurEffect = false;
let detectConvertEffect = false;
let detectPixelEffect = false;
let detectNegativeEffect = false;

let detectDefaultSlider;
let detectBlurSlider;
let detectPixelSlider;

function preload() {
  incomingImage = loadImage("test0.png");
}

function setup() {
  // ----- General ----- //
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);

  pixelDensity(1);
  capture = createCapture(VIDEO);
  capture.size(setWidth, setHeight);
  capture.hide();

  hoverToggleButton = createButton("Toggle Cursor Hover:<br>On"); // Use "<br>" instead of "\n"
  hoverToggleButton.mousePressed(function () {
    hoverEffectIsOn = !hoverEffectIsOn;
    if (hoverEffectIsOn) hoverToggleButton.html("Toggle Cursor Hover:<br>On");
    else hoverToggleButton.html("Toggle Cursor Hover:<br>Off");
  });

  // ----- For exporting ----- //
  exportButton = createButton("Export Canvas");
  exportButton.mousePressed(function () {
    exportingNow = true;
    let delay = exportDelaySlider.value() * 1000; // 1000 ms = 1 second
    setTimeout(function () {
      saveCanvas("My p5.js Photo Booth", "png");
      exportingNow = false;
    }, delay);
  });

  exportDelaySlider = createSlider(0, 10, 3, 1);
  exportDelaySlider.style("width", capture.width + "px");

  // ----- For (un)freezing frame ----- //
  // Set inputFeed upon startup
  inputFeed = capture;

  // Button
  freezeButton = createButton("Freeze frame");
  unfreezeButton = createButton("Unfreeze frame").hide();
  switchToImageButton = createButton("Switch to<br>Preloaded Image");

  freezeButton.mousePressed(function () {
    let picture = createImage(capture.width, capture.height);
    picture.copy(capture, 0, 0, capture.width, capture.height, 0, 0, capture.width, capture.height);
    inputFeed = picture;
    freezeButton.html("Freeze again!");
    showUnfreezeButton = true;
  });

  unfreezeButton.mousePressed(function () {
    inputFeed = capture;
    freezeButton.html("Freeze frame");
    showUnfreezeButton = false;
  });

  switchToImageButton.mousePressed(function () {
    let incomingImageCopy = createImage(capture.width, capture.height);
    incomingImageCopy.copy(incomingImage, 0, 0, incomingImage.width, incomingImage.height, 0, 0, capture.width, capture.height);
    inputFeed = incomingImageCopy;
    showUnfreezeButton = true;
  });

  // ----- For captures ----- //
  brightSlider = createSlider(0, 300, 120, 1);
  redSlider = createSlider(0, 255, 255, 1);
  greenSlider = createSlider(0, 255, 255, 1);
  blueSlider = createSlider(0, 255, 255, 1);
  redThresholdSlider = createSlider(0, 255, 85, 1); // 85 = (1 / 3) of 255
  greenThresholdSlider = createSlider(0, 255, 85, 1); // 85 = (1 / 3) of 255
  blueThresholdSlider = createSlider(0, 255, 85, 1); // 85 = (1 / 3) of 255
  cyanSlider = createSlider(0, 100, 100, 1);
  magentaSlider = createSlider(0, 100, 100, 1);
  yellowSlider = createSlider(0, 100, 100, 1);
  hueSlider = createSlider(0, 360, 360, 1);
  satSlider = createSlider(0, 100, 100, 1);
  valSlider = createSlider(0, 100, 100, 1);

  let sliders = [];
  sliders.push(brightSlider, redSlider, greenSlider, blueSlider, redThresholdSlider, greenThresholdSlider, blueThresholdSlider, cyanSlider, magentaSlider, yellowSlider, hueSlider, satSlider, valSlider);
  for (let i = 0; i < sliders.length; i++) {
    sliders[i].style("width", capture.width + "px"); // Set slider's width to be capture's width by default
  }

  // ----- For threshold ----- //
  thresholdToggleBlackButton = createButton("Toggle Black:<br>On"); // Use "<br>" instead of "\n"
  thresholdToggleBlackButton.mousePressed(function () {
    thresholdToggleIsBlack = !thresholdToggleIsBlack;
    if (thresholdToggleIsBlack) thresholdToggleBlackButton.html("Toggle Black:<br>On");
    else thresholdToggleBlackButton.html("Toggle Black:<br>Off");
  });

  thresholdToggleWhiteButton = createButton("Toggle White:<br>Off"); // Use "<br>" instead of "\n"
  thresholdToggleWhiteButton.mousePressed(function () {
    thresholdToggleIsWhite = !thresholdToggleIsWhite;
    if (thresholdToggleIsWhite) thresholdToggleWhiteButton.html("Toggle White:<br>On");
    else thresholdToggleWhiteButton.html("Toggle White:<br>Off");
  });

  // ----- For face detection ----- //
  let scaleFactor = 1.2;
  let classifier = objectdetect.frontalface;
  detector = new objectdetect.detector(setWidth, setHeight, scaleFactor, classifier);

  // Button
  detectDefaultButton = createButton("Default"); // Tried using a loop to createButton() to simplify; doesn't work
  detectGreyButton = createButton("Greyscale");
  detectBlurButton = createButton("Blur");
  detectConvertButton = createButton("HSV Mode");
  detectPixelButton = createButton("Pixelate");
  detectNegativeButton = createButton("Negative");

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

  // Slider
  detectDefaultSlider = createSlider(1, 10, 2, 1);
  detectBlurSlider = createSlider(1, 30, 15, 1);
  detectPixelSlider = createSlider(1, 20, 10, 1);

  detectDefaultSlider.style("width", capture.width + "px");
  detectBlurSlider.style("width", capture.width + "px");
  detectPixelSlider.style("width", capture.width + "px");

  // ----- For exporting: update this important array at the end (note that unfreezeButton is not inside) ----- //
  allButtonsAndSliders = [hoverToggleButton, exportButton, exportDelaySlider, freezeButton, unfreezeButton, switchToImageButton, brightSlider, redSlider, greenSlider, blueSlider, redThresholdSlider, greenThresholdSlider, blueThresholdSlider, cyanSlider, magentaSlider, yellowSlider, hueSlider, satSlider, valSlider, thresholdToggleBlackButton, thresholdToggleWhiteButton, detectDefaultButton, detectGreyButton, detectBlurButton, detectConvertButton, detectPixelButton, detectNegativeButton, detectDefaultSlider, detectBlurSlider, detectPixelSlider];
}

function draw() {
  background(backgroundColour);
  fill(255);
  noStroke();

  // ----- Update positions in case of window resizing ----- //
  let rowCount = 5;
  let colCount = 3;
  for (let i = 0; i < rowCount; i++) {
    positions[i] = [];
    for (let j = 0; j < colCount; j++) {
      let totalWidth = colCount * (setWidth + marginWidth) - marginWidth;
      let extraHeight = exportingNow ? 0 : (detectDefaultSlider.height + detectDefaultSlider.height / 8) * 3; // This is the extra height taken up below captureEditFaceDetect()
      let totalHeight = rowCount * (setHeight + marginHeight) - marginHeight + extraHeight;
      let startX = (width - totalWidth) / 2;
      let startY = (height - totalHeight) / 2;
      positions[i][j] = {
        x: startX + j * (setWidth + marginWidth),
        y: startY + i * (setHeight + marginHeight),
      };
    }
  }

  // ----- At empty space in top-right corner of capture grid ----- //
  let buttonMargin = exportButton.height / 2;
  exportButton.position(positions[0][2].x, positions[0][2].y);
  textAndSliderBottomLeft(exportDelaySlider, inputFeed.width * 0.45, exportButton.x, exportButton.y - inputFeed.height + exportButton.height + buttonMargin, "Export delay\n", " sec");
  hoverToggleButton.position(exportButton.x, exportDelaySlider.y + buttonMargin * 3.5);
  switchToImageButton.position(hoverToggleButton.x + hoverToggleButton.width + buttonMargin, hoverToggleButton.y);
  freezeButton.position(exportButton.x, hoverToggleButton.y + hoverToggleButton.height + buttonMargin);
  unfreezeButton.position(exportButton.x + freezeButton.width + buttonMargin, hoverToggleButton.y + hoverToggleButton.height + buttonMargin);

  // When exporting, hide all HTML elements
  for (let i = 0; i < allButtonsAndSliders.length; i++) {
    exportingNow ? allButtonsAndSliders[i].hide() : allButtonsAndSliders[i].show();
  }

  // Must be below 'for' loop above
  showUnfreezeButton && !exportingNow ? unfreezeButton.show() : unfreezeButton.hide();

  // ----- Capture grid itself ----- //
  // Row 1
  image(inputFeed, positions[0][0].x, positions[0][0].y, setWidth, setHeight);
  captureEditGrey(inputFeed, positions[0][1].x, positions[0][1].y, setWidth, setHeight);
  // Row 2
  captureEditR(inputFeed, positions[1][0].x, positions[1][0].y, setWidth, setHeight);
  captureEditG(inputFeed, positions[1][1].x, positions[1][1].y, setWidth, setHeight);
  captureEditB(inputFeed, positions[1][2].x, positions[1][2].y, setWidth, setHeight);
  // Row 3
  captureEditThresholdR(inputFeed, positions[2][0].x, positions[2][0].y, setWidth, setHeight);
  captureEditThresholdG(inputFeed, positions[2][1].x, positions[2][1].y, setWidth, setHeight);
  captureEditThresholdB(inputFeed, positions[2][2].x, positions[2][2].y, setWidth, setHeight);
  // Row 4
  captureEditRepeat(inputFeed, positions[3][0].x, positions[3][0].y, setWidth, setHeight);
  captureEditColourSpace1(inputFeed, positions[3][1].x, positions[3][1].y, setWidth, setHeight);
  captureEditColourSpace2(inputFeed, positions[3][2].x, positions[3][2].y, setWidth, setHeight);
  // Row 5
  captureEditFaceDetect(inputFeed, positions[4][0].x, positions[4][0].y, setWidth, setHeight);
  captureEditColourSpace1Segment(inputFeed, positions[4][1].x, positions[4][1].y, setWidth, setHeight);
  captureEditColourSpace2Segment(inputFeed, positions[4][2].x, positions[4][2].y, setWidth, setHeight);

  // ----- Capture grid's buttons and sliders ----- //
  // Row 1
  textAndSliderBottomCenter(brightSlider, positions[0][1].x, positions[0][1].y, "Brightness: ", "%");
  // Row 2
  textAndSliderBottomCenter(redSlider, positions[1][0].x, positions[1][0].y, "Red Value: ");
  textAndSliderBottomCenter(greenSlider, positions[1][1].x, positions[1][1].y, "Green Value: ");
  textAndSliderBottomCenter(blueSlider, positions[1][2].x, positions[1][2].y, "Blue Value: ");
  // Row 3
  thresholdToggleBlackButton.position(positions[2][0].x - thresholdToggleBlackButton.width - thresholdToggleBlackButton.height / 4, positions[2][0].y);
  thresholdToggleWhiteButton.position(positions[2][0].x - thresholdToggleWhiteButton.width - thresholdToggleWhiteButton.height / 4, positions[2][0].y + thresholdToggleBlackButton.height + buttonMargin);
  textAndSliderBottomCenter(redThresholdSlider, positions[2][0].x, positions[2][0].y, "Threshold to turn Red: ");
  textAndSliderBottomCenter(greenThresholdSlider, positions[2][1].x, positions[2][1].y, "Threshold to turn Green: ");
  textAndSliderBottomCenter(blueThresholdSlider, positions[2][2].x, positions[2][2].y, "Threshold to turn Blue: ");
  // Row 4
  textAndSliderBottomLeft(cyanSlider, inputFeed.width * 0.55, positions[3][1].x, positions[3][1].y, "Cyan: ", "%");
  textAndSliderBottomLeft(magentaSlider, inputFeed.width * 0.55, positions[3][1].x, positions[3][1].y + cyanSlider.height * 1.2, "Magenta: ", "%");
  textAndSliderBottomLeft(yellowSlider, inputFeed.width * 0.55, positions[3][1].x, positions[3][1].y + cyanSlider.height * 1.2 + magentaSlider.height * 1.2, "Yellow: ", "%");
  textAndSliderBottomLeft(hueSlider, inputFeed.width * 0.45, positions[3][2].x, positions[3][2].y, "Hue: ", "°");
  textAndSliderBottomLeft(satSlider, inputFeed.width * 0.45, positions[3][2].x, positions[3][2].y + hueSlider.height * 1.2, "Sat.: ", "%");
  textAndSliderBottomLeft(valSlider, inputFeed.width * 0.45, positions[3][2].x, positions[3][2].y + hueSlider.height * 1.2 + satSlider.height * 1.2, "Value: ", "%");
  // Row 5
  detectDefaultButton.position(positions[4][0].x - detectDefaultButton.width - detectDefaultButton.height / 4, positions[4][0].y);
  detectGreyButton.position(positions[4][0].x - detectGreyButton.width - detectGreyButton.height / 4, detectDefaultButton.y + detectDefaultButton.height * 1.25);
  detectBlurButton.position(positions[4][0].x - detectBlurButton.width - detectBlurButton.height / 4, detectGreyButton.y + detectGreyButton.height * 1.25);
  detectConvertButton.position(positions[4][0].x - detectConvertButton.width - detectConvertButton.height / 4, detectBlurButton.y + detectBlurButton.height * 1.25);
  detectPixelButton.position(positions[4][0].x - detectPixelButton.width - detectPixelButton.height / 4, detectConvertButton.y + detectConvertButton.height * 1.25);
  detectNegativeButton.position(positions[4][0].x - detectNegativeButton.width - detectNegativeButton.height / 4, detectPixelButton.y + detectPixelButton.height * 1.25);
  // Row 5, below capture left
  textAndSliderBottomLeft(detectDefaultSlider, inputFeed.width * 0.7, positions[4][0].x, positions[4][0].y, "Box thickness: ", "px");
  textAndSliderBottomLeft(detectBlurSlider, inputFeed.width * 0.4, positions[4][0].x, positions[4][0].y + detectDefaultSlider.height * 1.2, "Blur: ", "x");
  textAndSliderBottomLeft(detectPixelSlider, inputFeed.width * 0.4, positions[4][0].x, positions[4][0].y + detectDefaultSlider.height * 1.2 + detectBlurSlider.height * 1.2, "Pixel: ", "px");

  // ----- Capture grid hover effect ----- //
  if (hoverEffectIsOn) {
    hoverEffect(positions[0][0].x, positions[0][0].y, capture.width, capture.height, "Webcam\nImage", 1);
    hoverEffect(positions[0][1].x, positions[0][1].y, capture.width, capture.height, "Greyscale\nand\nBrightness at " + brightSlider.value() + "%", 2);
    hoverEffect(positions[1][0].x, positions[1][0].y, capture.width, capture.height, "Red Channel", 0);
    hoverEffect(positions[1][1].x, positions[1][1].y, capture.width, capture.height, "Green Channel", 0);
    hoverEffect(positions[1][2].x, positions[1][2].y, capture.width, capture.height, "Blue Channel", 0);
    hoverEffect(positions[2][0].x, positions[2][0].y, capture.width, capture.height, "Threshold\nImage", 1);
    hoverEffect(positions[2][1].x, positions[2][1].y, capture.width, capture.height, "Threshold\nImage", 1);
    hoverEffect(positions[2][2].x, positions[2][2].y, capture.width, capture.height, "Threshold\nImage", 1);
    hoverEffect(positions[3][0].x, positions[3][0].y, capture.width, capture.height, "Webcam\nImage\n\n(Repeat)", 3);
    hoverEffect(positions[3][1].x, positions[3][1].y, capture.width, capture.height, "Colour Space\n1\n\nConversion:\nRGB to CMY", 4);
    hoverEffect(positions[3][2].x, positions[3][2].y, capture.width, capture.height, "Colour Space\n2\n\nConversion:\nRGB to HSV", 4);
    hoverEffect(positions[4][0].x, positions[4][0].y, capture.width, capture.height, "Face Detection\n\nand\n\nReplaced\nFace Images", 5);
    hoverEffect(positions[4][1].x, positions[4][1].y, capture.width, capture.height, "Threshold\nImage\n\nfrom\nColour Space\n1", 5);
    hoverEffect(positions[4][2].x, positions[4][2].y, capture.width, capture.height, "Threshold\nImage\n\nfrom\nColour Space\n2", 5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// General helper functions
function hoverEffect(x, y, w, h, string, linebreakCount) {
  // Effect
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
  linebreakCount == 0 ? (midY = y + h / 2 + textSize() / 2) : (midY = y + h / 2 - (textSize() * linebreakCount) / 2);
  text(string, midX, midY);
}

function textAndSliderBottomCenter(incomingSlider, inputFeedX, inputFeedY, string, stringSuffix = "") {
  // This is so that it exports without text showing
  exportingNow ? fill(backgroundColour) : fill(255);

  // Text (based on inputFeed's dimensions and incomingSlider's height only)
  text(
    // format
    string + incomingSlider.value() + stringSuffix,
    inputFeedX + inputFeed.width / 2,
    inputFeedY + inputFeed.height + incomingSlider.height
  );

  // Slider (based on inputFeed's dimensions and incomingSlider's height only)
  incomingSlider.position(
    // format
    inputFeedX,
    inputFeedY + inputFeed.height + incomingSlider.height
  );
}

function textAndSliderBottomLeft(incomingSlider, emptySpaceWidth, inputFeedX, inputFeedY, string, stringSuffix = "") {
  // This is so that it exports without text showing
  exportingNow ? fill(backgroundColour) : fill(255);

  // Check if input param has "\n", to shift text/slides positions (mainly for "Export delay" text)
  let hasLineBreak = string.includes("\n");

  // Text (based on inputFeed's dimensions and incomingSlider's height only)
  textAlign(LEFT);
  text(
    // format
    string + incomingSlider.value() + stringSuffix,
    inputFeedX,
    hasLineBreak ? inputFeedY + inputFeed.height + incomingSlider.height - textSize() / 2 : inputFeedY + inputFeed.height + incomingSlider.height
  );
  textAlign(CENTER); // Reset to default

  // Slider (based on inputFeed's dimensions)
  incomingSlider.position(
    // format
    inputFeedX + emptySpaceWidth,
    inputFeedY + inputFeed.height + incomingSlider.height / 8 // "+ incomingSlider.height / 8" to move it down very slightly
  );
  incomingSlider.style("width", inputFeed.width - emptySpaceWidth + "px");
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
'capture' is at position (0, 0)
image(x, y, w, h) "artificially" moves the capture to position (x, y)
thus, have to copy from (0, 0) to (0, 0), then "artificially" move the copy using image()
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
      let chanOutput = constrain(grey * bright, 0, 255); // "5. Prevent pixel intensity from going beyond 255"
      captureCopy.pixels[index + 0] = chanOutput;
      captureCopy.pixels[index + 1] = chanOutput;
      captureCopy.pixels[index + 2] = chanOutput;
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
function captureEditThresholdR(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = captureCopy.pixels[index + 0];
      let chanG = 0;
      let chanB = 0;
      if (chanR > redThresholdSlider.value()) thresholdToggleIsBlack ? (chanR = 0) : (chanR = chanR);
      else {
        chanR = 255;
        if (thresholdToggleIsWhite) {
          chanG = 255;
          chanB = 255;
        }
      }
      captureCopy.pixels[index + 0] = chanR;
      captureCopy.pixels[index + 1] = chanG;
      captureCopy.pixels[index + 2] = chanB;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

function captureEditThresholdG(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = 0;
      let chanG = captureCopy.pixels[index + 1];
      let chanB = 0;
      if (chanG > greenThresholdSlider.value()) thresholdToggleIsBlack ? (chanG = 0) : (chanG = chanG);
      else {
        chanG = 255;
        if (thresholdToggleIsWhite) {
          chanB = 255;
          chanR = 255;
        }
      }
      captureCopy.pixels[index + 0] = chanR;
      captureCopy.pixels[index + 1] = chanG;
      captureCopy.pixels[index + 2] = chanB;
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

function captureEditThresholdB(src, x, y, w, h) {
  let captureCopy = createImage(setWidth, setHeight);
  captureCopy.copy(src, 0, 0, setWidth, setHeight, 0, 0, setWidth, setHeight);
  captureCopy.loadPixels();
  for (let x = 0; x < captureCopy.width; x++) {
    for (let y = 0; y < captureCopy.height; y++) {
      let index = (captureCopy.width * y + x) * 4;
      let chanR = 0;
      let chanG = 0;
      let chanB = captureCopy.pixels[index + 2];
      if (chanB > blueThresholdSlider.value()) thresholdToggleIsBlack ? (chanB = 0) : (chanB = chanB);
      else {
        chanB = 255;
        if (thresholdToggleIsWhite) {
          chanR = 255;
          chanG = 255;
        }
      }
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
      fromRGBtoCMY(true, captureCopy, index, chanR, chanG, chanB);
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
      fromRGBtoHSV(true, captureCopy, index, chanR, chanG, chanB);
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

// Row 4 helper function
function fromRGBtoCMY(slidersArePresent, src, currentIndex, incomingR, incomingG, incomingB) {
  /*
  Useful links
  https://users.ece.utexas.edu/~bevans/talks/hp-dsp-seminar/07_C6xImage2/tsld011.htm
  https://www.youtube.com/watch?v=X8OY-iwK_Kw
  https://colormine.org/convert/rgb-to-cmy
  */

  // ----- Convert from RGB to CMY: note that RGB 255 = CMY 0 ----- //
  // Normalise RGB from 0~255 to 0~1
  incomingR = map(incomingR, 0, 255, 0, 1);
  incomingG = map(incomingG, 0, 255, 0, 1);
  incomingB = map(incomingB, 0, 255, 0, 1);

  // Calculate CMY
  let myCyan = 1 - incomingR;
  let myMagenta = 1 - incomingG;
  let myYellow = 1 - incomingB;

  // Change output and reset range back to 0~255
  if (slidersArePresent) {
    src.pixels[currentIndex + 0] = map(myCyan * (cyanSlider.value() / 100), 0, 1, 255, 0);
    src.pixels[currentIndex + 1] = map(myMagenta * (magentaSlider.value() / 100), 0, 1, 255, 0);
    src.pixels[currentIndex + 2] = map(myYellow * (yellowSlider.value() / 100), 0, 1, 255, 0);
  } else {
    src.pixels[currentIndex + 0] = map(myCyan, 0, 1, 255, 0);
    src.pixels[currentIndex + 1] = map(myMagenta, 0, 1, 255, 0);
    src.pixels[currentIndex + 2] = map(myYellow, 0, 1, 255, 0);
  }
}

function fromRGBtoHSV(slidersArePresent, src, currentIndex, incomingR, incomingG, incomingB) {
  /*
  Useful links
  https://cs.stackexchange.com/questions/64549/convert-hsv-to-rgb-colors
  */

  // ----- Convert from RGB to HSV: note that H = 0~360 / S = 0~1 / V = 0~1 ----- //
  // Value
  let myValueMax = max(incomingR, incomingG, incomingB);
  let myValueMin = min(incomingR, incomingG, incomingB);

  // Saturation
  let mySaturation;
  if (myValueMax == 0 || myValueMin == 0) mySaturation = 0;
  else mySaturation = (myValueMax - myValueMin) / myValueMax;

  // Hue
  let myHue;
  if (myValueMax == incomingR) myHue = 60 * ((0 + (incomingG - incomingB)) / (myValueMax - myValueMin));
  if (myValueMax == incomingG) myHue = 60 * ((2 + (incomingB - incomingR)) / (myValueMax - myValueMin));
  if (myValueMax == incomingB) myHue = 60 * ((4 + (incomingR - incomingG)) / (myValueMax - myValueMin));
  if (myHue < 0) myHue += 360;

  // Change output and reset range back to 0~255
  if (slidersArePresent) {
    src.pixels[currentIndex + 0] = map(myHue * (hueSlider.value() / 360), 0, 360, 0, 255);
    src.pixels[currentIndex + 1] = map(mySaturation * (satSlider.value() / 100), 0, 1, 0, 255);
    src.pixels[currentIndex + 2] = map(myValueMax * (valSlider.value() / 100), 0, 1, 0, 255);
  } else {
    src.pixels[currentIndex + 0] = map(myHue, 0, 360, 0, 255);
    src.pixels[currentIndex + 1] = map(mySaturation, 0, 1, 0, 255);
    src.pixels[currentIndex + 2] = map(myValueMax, 0, 1, 0, 255);
  }
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
      // Create effects
      faceDetectEdit(captureCopy, int(face[0]), int(face[1]), int(face[2]), int(face[3]), x, y);

      // If default effect, then do not draw this as white rect will be drawn BELOW updated image()
      if (!detectDefaultEffect) {
        captureCopy.updatePixels();
        image(captureCopy, x, y, w, h);
      }
    }
  }
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
      fromRGBtoCMY(false, captureCopy, index, chanR, chanG, chanB);
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
      fromRGBtoHSV(false, captureCopy, index, chanR, chanG, chanB);
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

// Row 5 helper functions
function faceDetectEdit(src, faceX, faceY, faceWidth, faceHeight, translateX, translateY) {
  for (let x = faceX; x < faceX + faceWidth; x++) {
    for (let y = faceY; y < faceY + faceHeight; y++) {
      let index = (src.width * y + x) * 4;
      let chanR = src.pixels[index + 0];
      let chanG = src.pixels[index + 1];
      let chanB = src.pixels[index + 2];
      switch (true) {
        default: // this is detectDefaultEffect
          push();
          translate(translateX, translateY);
          // Setup
          noFill();
          stroke(255);
          strokeWeight(detectDefaultSlider.value());
          // Draw box
          rect(faceX, faceY, faceWidth, faceHeight);
          pop();
          // Reset to default
          fill(255);
          noStroke();
          break;
        case detectGreyEffect:
          let grey = (chanR + chanG + chanB) / 3;
          src.pixels[index + 0] = grey;
          src.pixels[index + 1] = grey;
          src.pixels[index + 2] = grey;
          break;
        case detectBlurEffect:
          let myMatrix = createBlurMatrix(detectBlurSlider.value());
          let myConv = convolution(x, y, myMatrix, src);
          src.pixels[index + 0] = myConv[0];
          src.pixels[index + 1] = myConv[1];
          src.pixels[index + 2] = myConv[2];
          break;
        case detectConvertEffect:
          fromRGBtoHSV(false, src, index, chanR, chanG, chanB);
          break;
        case detectPixelEffect:
          createPixelEffect(detectPixelSlider.value(), src, faceX, faceY, faceWidth, faceHeight);
          break;
        case detectNegativeEffect:
          src.pixels[index + 0] = map(chanR, 0, 255, 255, 0);
          src.pixels[index + 1] = map(chanG, 0, 255, 255, 0);
          src.pixels[index + 2] = map(chanB, 0, 255, 255, 0);
          break;
      }
    }
  }
}

function createBlurMatrix(matrixSize) {
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
  let totalR = 0.0;
  let totalG = 0.0;
  let totalB = 0.0;
  let offset = floor(matrixSize / 2);

  for (let i = 0; i < matrixSize; i++) {
    for (let j = 0; j < matrixSize; j++) {
      // Get pixel loc within convolution matrix
      let xLoc = x + i - offset;
      let yLoc = y + j - offset;
      let index = (xLoc + src.width * yLoc) * 4;
      index = constrain(index, 0, src.pixels.length - 1);
      totalR += src.pixels[index + 0] * matrix[i][j];
      totalG += src.pixels[index + 1] * matrix[i][j];
      totalB += src.pixels[index + 2] * matrix[i][j];
    }
  }

  return [totalR, totalG, totalB];
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
