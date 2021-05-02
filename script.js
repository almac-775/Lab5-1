// script.js
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');
const img = new Image(); // used to load image from <input> and draw to canvas
const volumeIcon = document.querySelector("img");
const imageInput = document.getElementById('image-input');
const genButton = document.querySelector("[type='submit']");
const clearButton = document.querySelector("[type='reset']");
const volume = document.querySelector("[type='range']");
const voiceOptions = document.getElementById('voice-selection');
const readButton = document.querySelector("[type='button']");
var topSpeech = new SpeechSynthesisUtterance();
var botSpeech = new SpeechSynthesisUtterance();
var voices = speechSynthesis.getVoices();

speechSynthesis.addEventListener("voiceschanged", () => {
  //voiceOptions.value = voices;
  voices = speechSynthesis.getVoices();
  console.log(voices.length);
    for(var i = 0; i < voices.length; i++) {
      console.log(voices[i]);
      var option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      voiceOptions.appendChild(option);
    } 
});

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
    // Clear canvas context
    const dim = getDimmensions(canvas.width, canvas.height, img.width, img.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // toggle buttons
    document.querySelector("[type='submit']").disabled = false;
    document.querySelector("[type='reset']").disabled = true;
    document.querySelector("[type='button']").disabled = true;

    // Fills the canvas with black
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw uploaded image
    ctx.drawImage(img, dim['startX'], dim['startY'], dim['width'], dim['height']);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});



imageInput.addEventListener('change', event => {
    const imageFile = imageInput.files[0];
    console.log(imageFile);
    img.src = URL.createObjectURL(imageFile);
    img.alt = imageFile.alt;
});



genButton.addEventListener('click', event => {
    // Toggle buttons
    document.querySelector("[type='submit']").disabled = true;
    document.querySelector("[type='reset']").disabled = false;
    document.querySelector("[type='button']").disabled = false;
    document.getElementById('voice-selection').disabled = false;
    // Get texts
    const upperText = document.getElementById('text-top');
    const lowerText = document.getElementById('text-bottom');
    // Generate text onto canvas
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.shadowColor="black";
    ctx.shadowBlur=7;
    ctx.lineWidth=5;
    // Upper text
    ctx.fillText(upperText.value, canvas.width/2, 50);
    // Lower text
    ctx.fillText(lowerText.value, canvas.width/2, canvas.height - 30);
});

clearButton.addEventListener('click', event => {
    // clear image and/or text
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // toggle relevant buttons
    document.querySelector("[type='submit']").disabled = true;
    document.querySelector("[type='reset']").disabled = false;
    document.querySelector("[type='button']").disabled = false;
    document.getElementById('voice-selection').disabled = true;
});

readButton.addEventListener('click', event => {
  // Get Texts
  const upperText = document.getElementById('text-top');
  const lowerText = document.getElementById('text-bottom');

  topSpeech = new SpeechSynthesisUtterance(upperText.value);
  botSpeech = new SpeechSynthesisUtterance(lowerText.value);

  topSpeech.volume = (volume.value / 100);
  botSpeech.volume = (volume.value / 100);
  //topSpeech.voice = voiceOptions.Selection;
  //botSpeech.voice = voiceOptions.Selection;

  console.log(voiceOptions.value);
  voices.forEach((voice) => {
    
    let voicename = voice.name + " (" + voice.lang + ")";
    console.log(voicename);
    if (voicename == voiceOptions.value) {
      console.log('selection successful');
      topSpeech.voice = voice;
      botSpeech.voice = voice;
    }
  });

  speechSynthesis.speak(topSpeech);
  speechSynthesis.speak(botSpeech);
});

volume.addEventListener('change', event =>{
  //console.log(volume.value / 100);
  topSpeech.volume = (volume.value / 100);
  botSpeech.volume = (volume.value / 100);
  if (volume.value == 0) {
    volumeIcon.src = "icons/volume-level-0.svg";
  }
  else if (volume.value > 0 && volume.value <= 33) {
    volumeIcon.src = "icons/volume-level-1.svg";
  }
  else if (volume.value > 33 && volume.value <= 66) {
    volumeIcon.src = "icons/volume-level-2.svg";
  }
  else {
    volumeIcon.src = "icons/volume-level-3.svg";
  }
});




/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
