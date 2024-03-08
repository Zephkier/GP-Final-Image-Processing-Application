// ----- General and others ----- //
let capture;
let setWidth = 160; // This is the minimum, original = 640
let setHeight = 120; // This is the minimum, original = 480
let marginWidth = 20; // Recommended minimum = 20
let marginHeight = 60; // Recommended minimum = 60 for 1080p screen
let buttonMargin = 0; // Uses HTML element's value
let positions = []; // 'positions' to end up like this: [ [{x,y}, {x,y}, {x,y}], repeat 4 more times ]
let buttons = [];
let sliders = [];
let buttonsAndSliders = [];

// ----- Canvas' top-right corner's empty space ----- //

// For exporting
let backgroundColour;
let exportButton;
let exportDelaySlider;
let exportDelay;
let exportingNow = false;

// Hover effect
let hoverToggleButton;
let hoverEffectIsOn = true;

// For changing inputFeed (between capture, frozen capture, and image)
let inputFeed;
let freezeButton;
let unfreezeButton;
let switchToImageButton;
let myImage;
let showUnfreezeButton = false;

// ----- Capture grid ----- //

// Sliders
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
let cyanThresholdSlider;
let hueThresholdSlider;

// Buttons
let thresholdToggleBlackButton;
let thresholdShowPureBlack = true;
let thresholdToggleWhiteButton;
let thresholdToWhite = false;

// Face detection items
let detector;

let detectDefaultButton;
let detectGreyButton;
let detectBlurButton;
let detectConvertButton;
let detectPixelButton;
let detectNegativeButton;

let detectDefaultSlider;
let detectBlurSlider;
let detectPixelSlider;

// Ensure these are copy-pasted into setAllEffectsFalse()
let detectDefaultEffect = true;
let detectGreyEffect = false;
let detectBlurEffect = false;
let detectConvertEffect = false;
let detectPixelEffect = false;
let detectNegativeEffect = false;

// p5js functions
function preload() {
  myImage = loadImage("test0.png");
}

function setup() {
  // General
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);
  pixelDensity(1);
  capture = createCapture(VIDEO);
  capture.size(setWidth, setHeight);
  capture.hide();

  // Face detection
  let scaleFactor = 1.2;
  let classifier = objectdetect.frontalface;
  detector = new objectdetect.detector(setWidth, setHeight, scaleFactor, classifier);

  // Canvas' top-right corner's empty space
  inputFeed = capture;
  setupTopRightCornerItems();

  // At capture grid
  setupCaptureGridButtons();
  setupCaptureGridSliders();

  // For exporting, to hide all HTML elements (note 'unfreezeButton' is not inside)
  // buttonsAndSliders = [
  //   // Format
  //   hoverToggleButton,
  //   exportButton,
  //   exportDelaySlider,
  //   freezeButton,
  //   unfreezeButton,
  //   switchToImageButton,
  //   brightSlider,
  //   redSlider,
  //   greenSlider,
  //   blueSlider,
  //   redThresholdSlider,
  //   greenThresholdSlider,
  //   blueThresholdSlider,
  //   cyanSlider,
  //   magentaSlider,
  //   yellowSlider,
  //   hueSlider,
  //   satSlider,
  //   valSlider,
  //   cyanThresholdSlider,
  //   hueThresholdSlider,
  //   thresholdToggleBlackButton,
  //   thresholdToggleWhiteButton,
  //   detectDefaultButton,
  //   detectGreyButton,
  //   detectBlurButton,
  //   detectConvertButton,
  //   detectPixelButton,
  //   detectNegativeButton,
  //   detectDefaultSlider,
  //   detectBlurSlider,
  //   detectPixelSlider,
  // ];
}

function draw() {
  backgroundColour = 20;
  background(backgroundColour);
  fill(255);
  noStroke();

  // Update positions in case of window resizing
  getCaptureGridPosition();

  // Canvas' top-right corner's empty space
  buttonMargin = exportButton.height / 2;
  drawTopRightCornerItems();

  // Capture grid stuff
  drawCaptureGrid();
  drawCaptureGridItems();
  drawCaptureGridHoverEffect();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  // Number 1 to 6
  switch (keyCode) {
    default: // Any key
      setAllEffectsFalse();
      detectDefaultEffect = true;
      break;
    case 49:
      setAllEffectsFalse();
      detectDefaultEffect = true;
      break;
    case 50:
      setAllEffectsFalse();
      detectGreyEffect = true;
      break;
    case 51:
      setAllEffectsFalse();
      detectBlurEffect = true;
      break;
    case 52:
      setAllEffectsFalse();
      detectConvertEffect = true;
      break;
    case 53:
      setAllEffectsFalse();
      detectPixelEffect = true;
      break;
    case 54:
      setAllEffectsFalse();
      detectNegativeEffect = true;
      break;
  }
}

// setup() helper functions
function setAllEffectsFalse() {
  detectDefaultEffect = false;
  detectGreyEffect = false;
  detectBlurEffect = false;
  detectConvertEffect = false;
  detectPixelEffect = false;
  detectNegativeEffect = false;
}

function setupTopRightCornerItems() {
  setupExportItems();
  setupHoverToggleButton();
  setupInputFeedItems();
}

function setupExportItems() {
  exportButton = createButton("Export Canvas");
  buttons.push(exportButton);

  exportButton.mousePressed(function () {
    exportDelay = exportDelaySlider.value() * 1000; // 1000 = 1 second
    exportingNow = true;
    setTimeout(function () {
      saveCanvas("My p5.js Photo Booth", "png");
      exportingNow = false;
    }, exportDelay);
  });

  exportDelaySlider = createSlider(0, 10, 3, 1);
  sliders.push(exportDelaySlider);
}

function setupHoverToggleButton() {
  hoverToggleButton = createButton("Toggle Cursor Hover<br>On"); // Use "<br>" instead of "\n"
  buttons.push(hoverToggleButton);

  hoverToggleButton.mousePressed(function () {
    hoverEffectIsOn = !hoverEffectIsOn;
    if (hoverEffectIsOn) hoverToggleButton.html("Toggle Cursor Hover<br>On");
    else hoverToggleButton.html("Toggle Cursor Hover<br>Off");
  });
}

function setupInputFeedItems() {
  freezeButton = createButton("Freeze frame");
  unfreezeButton = createButton("Unfreeze frame").hide();
  switchToImageButton = createButton("Switch to<br>Preloaded Image");
  buttons.push(
    // Format
    freezeButton,
    unfreezeButton, // TEST
    switchToImageButton
  );

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
    let myImageCopy = createImage(capture.width, capture.height);
    myImageCopy.copy(myImage, 0, 0, myImage.width, myImage.height, 0, 0, capture.width, capture.height);
    inputFeed = myImageCopy;
    showUnfreezeButton = true;
  });
}

function setupCaptureGridButtons() {
  // Row 3
  thresholdToggleBlackButton = createButton("See Pure Black<br>On"); // Use "<br>" instead of "\n"
  thresholdToggleBlackButton.mousePressed(function () {
    thresholdShowPureBlack = !thresholdShowPureBlack;
    if (thresholdShowPureBlack) thresholdToggleBlackButton.html("See Pure Black<br>On");
    else thresholdToggleBlackButton.html("See Pure Black<br>Off");
  });

  thresholdToggleWhiteButton = createButton("Threshold to White<br>Off"); // Use "<br>" instead of "\n"
  thresholdToggleWhiteButton.mousePressed(function () {
    thresholdToWhite = !thresholdToWhite;
    if (thresholdToWhite) thresholdToggleWhiteButton.html("Threshold to White<br>On");
    else thresholdToggleWhiteButton.html("Threshold to White<br>Off");
  });

  // Face detection
  detectDefaultButton = createButton("Default");
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

  buttons.push(
    // Format
    thresholdToggleBlackButton,
    thresholdToggleWhiteButton,
    detectDefaultButton,
    detectGreyButton,
    detectBlurButton,
    detectConvertButton,
    detectPixelButton,
    detectNegativeButton
  );
}

function setupCaptureGridSliders() {
  // Non-face detection
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
  cyanThresholdSlider = createSlider(0, 100, 66, 1);
  hueThresholdSlider = createSlider(0, 360, 180, 1);

  // Face detection
  detectDefaultSlider = createSlider(1, 10, 2, 1);
  detectBlurSlider = createSlider(1, 30, 15, 1);
  detectPixelSlider = createSlider(1, 20, 10, 1);

  // Set slider's width to capture's width by default
  sliders.push(
    // Format
    brightSlider,
    redSlider,
    greenSlider,
    blueSlider,
    redThresholdSlider,
    greenThresholdSlider,
    blueThresholdSlider,
    cyanSlider,
    magentaSlider,
    yellowSlider,
    hueSlider,
    satSlider,
    valSlider,
    cyanThresholdSlider,
    hueThresholdSlider,
    detectDefaultSlider,
    detectBlurSlider,
    detectPixelSlider
  );

  for (let i = 0; i < sliders.length; i++) {
    sliders[i].style("width", capture.width + "px");
  }
}

// draw() helper functions
function getCaptureGridPosition() {
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
}

function drawTopRightCornerItems() {
  // Set positions
  exportButton.position(positions[0][2].x, positions[0][2].y);
  textAndSliderBottomLeft(exportDelaySlider, inputFeed.width * 0.45, exportButton.x, exportButton.y - inputFeed.height + exportButton.height + buttonMargin, "Export delay\n", " sec");
  hoverToggleButton.position(exportButton.x, exportDelaySlider.y + buttonMargin * 3.5);
  switchToImageButton.position(hoverToggleButton.x + hoverToggleButton.width + buttonMargin, hoverToggleButton.y);
  freezeButton.position(exportButton.x, hoverToggleButton.y + hoverToggleButton.height + buttonMargin);
  unfreezeButton.position(exportButton.x + freezeButton.width + buttonMargin, hoverToggleButton.y + hoverToggleButton.height + buttonMargin);

  // When exporting, hide all HTML elements
  for (let i = 0; i < buttonsAndSliders.length; i++) {
    exportingNow ? buttonsAndSliders[i].hide() : buttonsAndSliders[i].show();
  }

  // Only 'unfreezeButton' need not show (this line must be after 'for' loop above)
  showUnfreezeButton && !exportingNow ? unfreezeButton.show() : unfreezeButton.hide();
}

function drawCaptureGrid() {
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
  captureEditColourSpace1Threshold(inputFeed, positions[4][1].x, positions[4][1].y, setWidth, setHeight);
  captureEditColourSpace2Threshold(inputFeed, positions[4][2].x, positions[4][2].y, setWidth, setHeight);
}

function drawCaptureGridItems() {
  // ----- Capture grid's buttons and sliders ----- //
  // Row 1
  textAndSliderBottomCenter(brightSlider, positions[0][1].x, positions[0][1].y, "Brightness: ", "%");
  // Row 2
  textAndSliderBottomCenter(redSlider, positions[1][0].x, positions[1][0].y, "Red Value: ");
  textAndSliderBottomCenter(greenSlider, positions[1][1].x, positions[1][1].y, "Green Value: ");
  textAndSliderBottomCenter(blueSlider, positions[1][2].x, positions[1][2].y, "Blue Value: ");
  // Row 3
  thresholdToggleBlackButton.position(positions[2][0].x - thresholdToggleBlackButton.width - buttonMargin, positions[2][0].y);
  thresholdToggleWhiteButton.position(positions[2][0].x - thresholdToggleWhiteButton.width - buttonMargin, positions[2][0].y + thresholdToggleBlackButton.height + buttonMargin);
  textAndSliderBottomCenter(redThresholdSlider, positions[2][0].x, positions[2][0].y, "Red Threshold: ");
  textAndSliderBottomCenter(greenThresholdSlider, positions[2][1].x, positions[2][1].y, "Green Threshold: ");
  textAndSliderBottomCenter(blueThresholdSlider, positions[2][2].x, positions[2][2].y, "Blue Threshold: ");
  // Row 4
  textAndSliderBottomLeft(cyanSlider, inputFeed.width * 0.55, positions[3][1].x, positions[3][1].y, "Cyan: ", "%");
  textAndSliderBottomLeft(magentaSlider, inputFeed.width * 0.55, positions[3][1].x, positions[3][1].y + cyanSlider.height * 1.2, "Magenta: ", "%");
  textAndSliderBottomLeft(yellowSlider, inputFeed.width * 0.55, positions[3][1].x, positions[3][1].y + cyanSlider.height * 1.2 + magentaSlider.height * 1.2, "Yellow: ", "%");
  textAndSliderBottomLeft(hueSlider, inputFeed.width * 0.45, positions[3][2].x, positions[3][2].y, "Hue: ", "°");
  textAndSliderBottomLeft(satSlider, inputFeed.width * 0.45, positions[3][2].x, positions[3][2].y + hueSlider.height * 1.2, "Sat.: ", "%");
  textAndSliderBottomLeft(valSlider, inputFeed.width * 0.45, positions[3][2].x, positions[3][2].y + hueSlider.height * 1.2 + satSlider.height * 1.2, "Value: ", "%");
  // Row 5, left capture's left side
  for (let i = 0; i < 6; i++) {
    text(i + 1, positions[4][0].x - marginWidth, positions[4][0].y + buttonMargin * 1.5 + i * (detectDefaultButton.height + buttonMargin));
  }
  detectDefaultButton.position(positions[4][0].x - detectDefaultButton.width - buttonMargin * 2.5, positions[4][0].y);
  detectGreyButton.position(positions[4][0].x - detectGreyButton.width - buttonMargin * 2.5, detectDefaultButton.y + detectDefaultButton.height + buttonMargin);
  detectBlurButton.position(positions[4][0].x - detectBlurButton.width - buttonMargin * 2.5, detectGreyButton.y + detectGreyButton.height + buttonMargin);
  detectConvertButton.position(positions[4][0].x - detectConvertButton.width - buttonMargin * 2.5, detectBlurButton.y + detectBlurButton.height + buttonMargin);
  detectPixelButton.position(positions[4][0].x - detectPixelButton.width - buttonMargin * 2.5, detectConvertButton.y + detectConvertButton.height + buttonMargin);
  detectNegativeButton.position(positions[4][0].x - detectNegativeButton.width - buttonMargin * 2.5, detectPixelButton.y + detectPixelButton.height + buttonMargin);
  // Row 5, left capture's bottom side
  textAndSliderBottomLeft(detectDefaultSlider, inputFeed.width * 0.7, positions[4][0].x, positions[4][0].y, "Box thickness: ", "px");
  textAndSliderBottomLeft(detectBlurSlider, inputFeed.width * 0.4, positions[4][0].x, positions[4][0].y + detectDefaultSlider.height * 1.2, "Blur: ", "x");
  textAndSliderBottomLeft(detectPixelSlider, inputFeed.width * 0.4, positions[4][0].x, positions[4][0].y + detectDefaultSlider.height * 1.2 + detectBlurSlider.height * 1.2, "Pixel: ", "px");
  // Row 5, middle and right capture
  textAndSliderBottomCenter(cyanThresholdSlider, positions[4][1].x, positions[4][1].y, "C Threshold: ", "%");
  textAndSliderBottomCenter(hueThresholdSlider, positions[4][2].x, positions[4][2].y, "H Threshold: ", "%");
}

function drawCaptureGridHoverEffect() {
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

// ----- Capture grid functions --- //

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
      let chanNew = createThresholdForRGB(redThresholdSlider, chanR, chanG, chanB);
      captureCopy.pixels[index + 0] = chanNew[0];
      captureCopy.pixels[index + 1] = chanNew[1];
      captureCopy.pixels[index + 2] = chanNew[2];
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
      let chanNew = createThresholdForRGB(greenThresholdSlider, chanG, chanB, chanR);
      captureCopy.pixels[index + 0] = chanNew[2];
      captureCopy.pixels[index + 1] = chanNew[0];
      captureCopy.pixels[index + 2] = chanNew[1];
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
      let chanNew = createThresholdForRGB(blueThresholdSlider, chanB, chanR, chanG);
      captureCopy.pixels[index + 0] = chanNew[1];
      captureCopy.pixels[index + 1] = chanNew[2];
      captureCopy.pixels[index + 2] = chanNew[0];
    }
  }
  captureCopy.updatePixels();
  image(captureCopy, x, y, w, h);
}

// Row 3's helper function
function createThresholdForRGB(slider, chanFocused, chanSide1, chanSide2) {
  if (chanFocused > slider.value()) {
    chanFocused = 255;
    if (thresholdToWhite) {
      chanSide1 = 255;
      chanSide2 = 255;
    }
  } else thresholdShowPureBlack ? (chanFocused = 0) : (chanFocused = chanFocused);

  return [chanFocused, chanSide1, chanSide2];
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

// Row 4's (and 5's) helper function
function fromRGBtoCMY(isRow4, src, currentIndex, incomingR, incomingG, incomingB) {
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

  // Change output and reset range back from 0~1 to 255~0
  if (isRow4) {
    src.pixels[currentIndex + 0] = map(myCyan * (cyanSlider.value() / 100), 0, 1, 255, 0);
    src.pixels[currentIndex + 1] = map(myMagenta * (magentaSlider.value() / 100), 0, 1, 255, 0);
    src.pixels[currentIndex + 2] = map(myYellow * (yellowSlider.value() / 100), 0, 1, 255, 0);
  } else {
    myCyan > cyanThresholdSlider.value() / 100 ? (myCyan = 0) : (myCyan = 1);
    src.pixels[currentIndex + 0] = map(myCyan, 0, 1, 255, 0);
    src.pixels[currentIndex + 1] = map(myMagenta, 0, 1, 255, 0);
    src.pixels[currentIndex + 2] = map(myYellow, 0, 1, 255, 0);
  }
}

function fromRGBtoHSV(isRow4, src, currentIndex, incomingR, incomingG, incomingB) {
  /*
  Useful links
  https://cs.stackexchange.com/questions/64549/convert-hsv-to-rgb-colors
  */

  // ----- Convert from RGB to HSV: note that H = 0~360 / S = 0~1 / V = 0~1 ----- //
  // Value
  let myValMax = max(incomingR, incomingG, incomingB);
  let myValMin = min(incomingR, incomingG, incomingB);

  // Saturation
  let mySat;
  if (myValMax == 0 || myValMin == 0) mySat = 0;
  else mySat = (myValMax - myValMin) / myValMax;

  // Hue
  let myHue;
  if (myValMax == incomingR) myHue = 60 * ((0 + (incomingG - incomingB)) / (myValMax - myValMin));
  if (myValMax == incomingG) myHue = 60 * ((2 + (incomingB - incomingR)) / (myValMax - myValMin));
  if (myValMax == incomingB) myHue = 60 * ((4 + (incomingR - incomingG)) / (myValMax - myValMin));
  if (myHue < 0) myHue += 360;

  // Change output and reset range back to 0~255
  if (isRow4) {
    src.pixels[currentIndex + 0] = map(myHue * (hueSlider.value() / 360), 0, 360, 0, 255);
    src.pixels[currentIndex + 1] = map(mySat * (satSlider.value() / 100), 0, 1, 0, 255);
    src.pixels[currentIndex + 2] = map(myValMax * (valSlider.value() / 100), 0, 1, 0, 255);
  } else {
    myHue > hueThresholdSlider.value() ? (myHue = 360) : (myHue = 0);
    src.pixels[currentIndex + 0] = map(myHue, 0, 360, 0, 255);
    src.pixels[currentIndex + 1] = map(mySat, 0, 1, 0, 255);
    src.pixels[currentIndex + 2] = map(myValMax, 0, 1, 0, 255);
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

function captureEditColourSpace1Threshold(src, x, y, w, h) {
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

function captureEditColourSpace2Threshold(src, x, y, w, h) {
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

// Row 5's helper functions
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
