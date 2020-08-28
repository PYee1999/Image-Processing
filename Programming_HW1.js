let robot = lib220.loadImageFromURL(
'https://people.cs.umass.edu/~joydeepb/robot.jpg');

// Q1: Turn image into a red color by removing blue and green.
function removeBlueAndGreen(pic) {
  let image = pic.copy();
  for (let i = 0; i < image.width; i = i + 1) {
    for (let j = 0; j < image.height; j = j + 1) {
      image.setPixel(i, j, [image.getPixel(i, j)[0], 0.0, 0.0]);
    }
  }
  return image;
}

// Q2: Grayscale the image: Take the average of the 3 colors.
function makeGrayscale(pic) {
  let image = pic.copy();
  for (let i = 0; i < image.width; i = i + 1) {
    for (let j = 0; j < image.height; j = j + 1) {
      let avgColor = (image.getPixel(i, j)[0] + 
                      image.getPixel(i, j)[1] + 
                      image.getPixel(i, j)[2]) / 3;
      image.setPixel(i, j, [avgColor, avgColor, avgColor]);
    }
  }
  return image;
}

// Q3: Make black and white highlighted image.
function highlightEdges(pic) {
  let image = pic.copy();
  for (let i = 0; i < image.width - 1; i = i + 1) {
    for (let j = 0; j < image.height; j = j + 1) {
      let m1 = (image.getPixel(i, j)[0] + 
                image.getPixel(i, j)[1] + 
                image.getPixel(i, j)[2]) / 3;

      let m2 = 0;

      if (!image.getPixel(i+1, j)) {
        m2 = (image.getPixel(0, j)[0] + 
              image.getPixel(0, j)[1] + 
              image.getPixel(0, j)[2]) / 3;
      } else {
        m2 = (image.getPixel(i+1, j)[0] + 
              image.getPixel(i+1, j)[1] + 
              image.getPixel(i+1, j)[2]) / 3;
      }
      let avg = Math.abs(m1-m2);

      image.setPixel(i, j, [avg, avg, avg]);
    }
  }
  return image;
}

// Q4 Helper Method: Get average of the pixel's color value (RGB).
function getBlurredAvgColor(pic, x, y, startingPixel, stoppingPixel) {
  let redSum = 0;
  let greenSum = 0;
  let blueSum = 0;
  let rgbList = [];

  for (let i = startingPixel; i < stoppingPixel; i = i + 1) {
    redSum = redSum + (pic.getPixel(i, y)[0]);
    greenSum = greenSum + (pic.getPixel(i, y)[1]);
    blueSum = blueSum + (pic.getPixel(i, y)[2]);
  }

  let diff = stoppingPixel - startingPixel;
  rgbList.push(redSum / diff);
  rgbList.push(greenSum / diff);
  rgbList.push(blueSum / diff);

  return rgbList;
}

// Q4: Make blurred image.
function blur(pic) {
  let image = pic.copy();
  for (let i = 0; i < image.width; i = i + 1) {
    for (let j = 0; j < image.height; j = j + 1) {
      
      let finalBlurredColor = [];

      if (image.width < 11) { // If the image is very small (< 10 pixels wide)
        finalBlurredColor = getBlurredAvgColor(image, i, j, 0, image.width);
      } else if (i < 5) { // First 5 pixels in a row
        finalBlurredColor = getBlurredAvgColor(image, i, j, 0, 5);
      } else if (i > image.width - 6) { // Last 5 pixels in a row
        finalBlurredColor = getBlurredAvgColor(image, i, j, image.width - 5, image.width);
      } else { // Any pixels other than the outer 5 rows
        finalBlurredColor = getBlurredAvgColor(image, i, j, i - 5, i + 6);
      }

      // Set Pixel color.
      image.setPixel(i, j, [finalBlurredColor[0], 
                            finalBlurredColor[1], 
                            finalBlurredColor[2]]);
    }
  }

  return image;
}

// TESTING
test('removeBlueAndGreen function definition is correct', function() {
  const white = lib220.createImage(10, 10, [1,1,1]);
  removeBlueAndGreen(white).getPixel(0,0);
  // Need to use assert
});

test('No blue or green in removeBlueAndGreen result', function() {
  // Create a test image, of size 10 pixels x 10 pixels, and set it to all white.
  const white = lib220.createImage(10, 10, [1,1,1]);
  // Get the result of the function.
  const shouldBeRed = removeBlueAndGreen(white);
  // Read the center pixel.
  const pixelValue = shouldBeRed.getPixel(5, 5);
  // The red channel should be unchanged.
  assert(pixelValue[0] === 1);
  // The green channel should be 0.
  assert(pixelValue[1] === 0);
  // The blue channel should be 0.
  assert(pixelValue[2] === 0);
});

function pixelEq (p1, p2) {
  const epsilon = 0.002;
  for (let i = 0; i < 3; ++i) {
    if (Math.abs(p1[i] - p2[i]) > epsilon) {
      return false;
    }
  }
  return true;
};

test('Check pixel equality', function() {
  const inputPixel = [0.5, 0.5, 0.5]
  // Create a test image, of size 10 pixels x 10 pixels, 
  // and set it to the inputPixel
  const image = lib220.createImage(10, 10, inputPixel);
  // Process the image.
  const outputImage = removeBlueAndGreen(image);
  // Check the center pixel.
  const centerPixel = outputImage.getPixel(5, 5);
  assert(pixelEq(centerPixel, [0.5, 0, 0]));
  // Check the top-left corner pixel.
  const cornerPixel = outputImage.getPixel(0, 0);
  assert(pixelEq(cornerPixel, [0.5, 0, 0]));
});

// Test Blur Function.
test('blur result', function() {
  // Create a test image, of size 10 pixels x 10 pixels, and set it to all white.
  const image = lib220.createImage(10, 10, [1,1,1]);

  // Set color values to specific pixels in image.
  image.setPixel(0, 0, [0, 0, 0]);
  image.setPixel(1, 0, [0, 0, 0]);
  image.setPixel(2, 0, [0, 0, 0]);
  image.setPixel(3, 0, [0, 0, 0]);
  image.setPixel(4, 0, [0, 0, 0]);
  image.setPixel(5, 0, [0, 0, 0]);
  image.setPixel(6, 0, [0, 0, 0]);
  image.setPixel(7, 0, [0, 0, 0]);
  image.setPixel(8, 0, [0, 0, 0]);
  image.setPixel(9, 0, [0, 0, 0]);

  // Get the result of the function.
  const shouldBeBlurred = blur(image);
  // Read the center pixel.
  const pixelValue = shouldBeBlurred.getPixel(0, 0);
  // The red channel should be unchanged.
  assert(pixelValue[0] === 0);
  // The green channel should be unchanged.
  assert(pixelValue[1] === 0);
  // The blue channel should be unchanged.
  assert(pixelValue[2] === 0);
});
