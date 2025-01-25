const quizData = [
  {
    question: "What does ISO stand for in photography?",
    answers: ["International Standards Organization", "Image Sensor Optimization", "Instant Shutter Operation"],
    correct: 0, // Correct answer: "International Standards Organization"
  },
  {
    question: "What is the 'rule of thirds'?",
    answers: ["A composition guideline", "A type of camera lens", "A post-processing technique"],
    correct: 0, // Correct answer: "A composition guideline"
  },
  {
    question: "What is the primary purpose of a camera's aperture?",
    answers: ["To control the amount of light entering the lens", "To adjust the focus of the image", "To stabilize the camera"],
    correct: 0, // Correct answer: "To control the amount of light entering the lens"
  },
  {
    question: "Which camera mode gives the photographer the most control over settings?",
    answers: ["Manual mode", "Aperture priority mode", "Program mode"],
    correct: 0, // Correct answer: "Manual mode"
  },
  {
    question: "What is the 'golden hour' in photography?",
    answers: ["The first and last hour of sunlight during the day", "A rare celestial event", "A type of camera filter"],
    correct: 0, // Correct answer: "The first and last hour of sunlight during the day"
  },
  {
    question: "What does DSLR stand for?",
    answers: ["Digital Single-Lens Reflex", "Digital Shutter Light Regulation", "Dynamic Sensor Lens Resolution"],
    correct: 0, // Correct answer: "Digital Single-Lens Reflex"
  },
  {
    question: "What is the purpose of a neutral density (ND) filter?",
    answers: ["To reduce the amount of light entering the lens", "To enhance colors in a photo", "To add a vignette effect"],
    correct: 0, // Correct answer: "To reduce the amount of light entering the lens"
  },
  {
    question: "What is the 'bokeh' effect?",
    answers: ["The aesthetic quality of the out-of-focus areas in an image", "A type of lens flare", "A post-processing filter"],
    correct: 0, // Correct answer: "The aesthetic quality of the out-of-focus areas in an image"
  },
  {
    question: "What is the standard aspect ratio for most DSLR cameras?",
    answers: ["3:2", "4:3", "16:9"],
    correct: 0, // Correct answer: "3:2"
  },
  {
    question: "What is the function of a camera's shutter?",
    answers: ["To control the duration of light exposure", "To adjust the focus", "To stabilize the image"],
    correct: 0, // Correct answer: "To control the duration of light exposure"
  },
  {
    question: "What is the 'exposure triangle' in photography?",
    answers: ["Aperture, Shutter Speed, and ISO", "Focus, Composition, and Lighting", "Lens, Sensor, and Flash"],
    correct: 0, // Correct answer: "Aperture, Shutter Speed, and ISO"
  },
  {
    question: "What is the purpose of a polarizing filter?",
    answers: ["To reduce reflections and enhance colors", "To blur the background", "To increase light sensitivity"],
    correct: 0, // Correct answer: "To reduce reflections and enhance colors"
  },
  {
    question: "What is the 'histogram' in photography?",
    answers: ["A graphical representation of the tonal values in an image", "A type of camera lens", "A post-processing tool"],
    correct: 0, // Correct answer: "A graphical representation of the tonal values in an image"
  },
  {
    question: "What is the 'depth of field' in photography?",
    answers: ["The range of distance that appears acceptably sharp", "The amount of light in a photo", "The resolution of an image"],
    correct: 0, // Correct answer: "The range of distance that appears acceptably sharp"
  },
  {
    question: "What is the 'white balance' in photography?",
    answers: ["The adjustment of colors to make the image look natural", "The brightness of the image", "The contrast of the image"],
    correct: 0, // Correct answer: "The adjustment of colors to make the image look natural"
  },
  {
    question: "What is the 'focal length' of a lens?",
    answers: ["The distance between the lens and the image sensor", "The width of the lens", "The zoom capability of the lens"],
    correct: 0, // Correct answer: "The distance between the lens and the image sensor"
  },
  {
    question: "What is the 'shutter speed' in photography?",
    answers: ["The amount of time the shutter is open", "The speed at which the camera focuses", "The rate at which images are captured"],
    correct: 0, // Correct answer: "The amount of time the shutter is open"
  },
  {
    question: "What is the 'ISO' in photography?",
    answers: ["The sensitivity of the camera's sensor to light", "The resolution of the image", "The type of lens used"],
    correct: 0, // Correct answer: "The sensitivity of the camera's sensor to light"
  },
  {
    question: "What is the 'aperture' in photography?",
    answers: ["The opening in the lens that controls the amount of light", "The part of the camera that captures the image", "The mechanism that stabilizes the camera"],
    correct: 0, // Correct answer: "The opening in the lens that controls the amount of light"
  },
  {
    question: "What is the 'dynamic range' in photography?",
    answers: ["The range of light intensities from the darkest to the brightest", "The speed at which the camera captures images", "The resolution of the image"],
    correct: 0, // Correct answer: "The range of light intensities from the darkest to the brightest"
  },
  {
    question: "What is the 'megapixel' count in a camera?",
    answers: ["The number of pixels in the image sensor", "The size of the camera's lens", "The speed of the camera's processor"],
    correct: 0, // Correct answer: "The number of pixels in the image sensor"
  },
  {
    question: "What is the 'RAW' format in photography?",
    answers: ["An uncompressed image file format", "A type of camera lens", "A post-processing technique"],
    correct: 0, // Correct answer: "An uncompressed image file format"
  },
  {
    question: "What is the 'JPEG' format in photography?",
    answers: ["A compressed image file format", "A type of camera sensor", "A type of lens filter"],
    correct: 0, // Correct answer: "A compressed image file format"
  },
  {
    question: "What is the 'HDR' in photography?",
    answers: ["High Dynamic Range imaging", "High Definition Resolution", "High Density Reflector"],
    correct: 0, // Correct answer: "High Dynamic Range imaging"
  },
  {
    question: "What is the 'panorama' in photography?",
    answers: ["A wide-angle view of a scene", "A type of camera lens", "A post-processing effect"],
    correct: 0, // Correct answer: "A wide-angle view of a scene"
  },
  {
    question: "What is the 'macro' photography?",
    answers: ["Close-up photography of small subjects", "A type of camera sensor", "A post-processing technique"],
    correct: 0, // Correct answer: "Close-up photography of small subjects"
  },
  {
    question: "What is the 'telephoto' lens used for?",
    answers: ["To magnify distant subjects", "To capture wide-angle views", "To reduce camera shake"],
    correct: 0, // Correct answer: "To magnify distant subjects"
  },
  {
    question: "What is the 'wide-angle' lens used for?",
    answers: ["To capture a wider field of view", "To magnify distant subjects", "To reduce light entering the lens"],
    correct: 0, // Correct answer: "To capture a wider field of view"
  },
  {
    question: "What is the 'prime' lens?",
    answers: ["A lens with a fixed focal length", "A lens with a variable focal length", "A lens with a built-in filter"],
    correct: 0, // Correct answer: "A lens with a fixed focal length"
  },
  {
    question: "What is the 'zoom' lens?",
    answers: ["A lens with a variable focal length", "A lens with a fixed focal length", "A lens with a built-in flash"],
    correct: 0, // Correct answer: "A lens with a variable focal length"
  },
  {
    question: "What is the 'tripod' used for in photography?",
    answers: ["To stabilize the camera", "To increase the camera's zoom", "To enhance the camera's sensor"],
    correct: 0, // Correct answer: "To stabilize the camera"
  },
  {
    question: "What is the 'monopod' used for in photography?",
    answers: ["To provide limited stabilization for the camera", "To increase the camera's zoom", "To enhance the camera's sensor"],
    correct: 0, // Correct answer: "To provide limited stabilization for the camera"
  },
  {
    question: "What is the 'flash sync speed' in photography?",
    answers: ["The fastest shutter speed at which the camera can use flash", "The speed at which the camera focuses", "The rate at which images are captured"],
    correct: 0, // Correct answer: "The fastest shutter speed at which the camera can use flash"
  },
  {
    question: "What is the 'red-eye effect' in photography?",
    answers: ["A common effect in flash photography where the subject's eyes appear red", "A type of lens flare", "A post-processing effect"],
    correct: 0, // Correct answer: "A common effect in flash photography where the subject's eyes appear red"
  },
  {
    question: "What is the 'vignetting' effect in photography?",
    answers: ["A reduction of an image's brightness towards the edges", "A type of lens flare", "A post-processing effect"],
    correct: 0, // Correct answer: "A reduction of an image's brightness towards the edges"
  },
  {
    question: "What is the 'chromatic aberration' in photography?",
    answers: ["A color fringing effect caused by the lens", "A type of lens flare", "A post-processing effect"],
    correct: 0, // Correct answer: "A color fringing effect caused by the lens"
  },
  {
    question: "What is the 'noise' in photography?",
    answers: ["Graininess or speckles in an image caused by high ISO", "A type of lens flare", "A post-processing effect"],
    correct: 0, // Correct answer: "Graininess or speckles in an image caused by high ISO"
  },
  {
    question: "What is the 'long exposure' photography?",
    answers: ["A technique where the shutter is open for a long time", "A type of camera lens", "A post-processing technique"],
    correct: 0, // Correct answer: "A technique where the shutter is open for a long time"
  },
  {
    question: "What is the 'time-lapse' photography?",
    answers: ["A technique where frames are captured at intervals and played back quickly", "A type of camera lens", "A post-processing technique"],
    correct: 0, // Correct answer: "A technique where frames are captured at intervals and played back quickly"
  },
  {
    question: "What is the 'bracketing' in photography?",
    answers: ["Taking multiple shots at different exposures", "A type of camera lens", "A post-processing technique"],
    correct: 0, // Correct answer: "Taking multiple shots at different exposures"
  },
  {
    question: "What is the 'focus stacking' in photography?",
    answers: ["A technique to increase depth of field by combining multiple images", "A type of camera lens", "A post-processing technique"],
    correct: 0, // Correct answer: "A technique to increase depth of field by combining multiple images"
  },
  {
    question: "What is the 'hyperfocal distance' in photography?",
    answers: ["The closest distance at which a lens can be focused while keeping objects at infinity acceptably sharp", "The distance between the lens and the subject", "The distance between the lens and the sensor"],
    correct: 0, // Correct answer: "The closest distance at which a lens can be focused while keeping objects at infinity acceptably sharp"
  },
  {
    question: "What is the 'reciprocity law' in photography?",
    answers: ["The relationship between shutter speed and aperture", "The relationship between ISO and aperture", "The relationship between ISO and shutter speed"],
    correct: 0, // Correct answer: "The relationship between shutter speed and aperture"
  },
  {
    question: "What is the 'sunny 16 rule' in photography?",
    answers: ["A guideline for setting exposure on a sunny day", "A type of camera lens", "A post-processing technique"],
    correct: 0, // Correct answer: "A guideline for setting exposure on a sunny day"
  },
  {
    question: "What is the 'leading lines' composition technique?",
    answers: ["Using lines in the image to lead the viewer's eye", "A type of camera lens", "A post-processing technique"],
    correct: 0, // Correct answer: "Using lines in the image to lead the viewer's eye"
  },
  {
    question: "What is the 'framing' composition technique?",
    answers: ["Using elements in the scene to frame the subject", "A type of camera lens", "A post-processing technique"],
    correct: 0, // Correct answer: "Using elements in the scene to frame the subject"
  },
  {
    question: "What is the 'negative space' in photography?",
    answers: ["The empty space around the subject", "A type of camera lens", "A post-processing technique"],
    correct: 0, // Correct answer: "The empty space around the subject"
  },
  {
    question: "What is the 'symmetry' in photography?",
    answers: ["A balanced and mirrored composition", "A type of camera lens", "A post-processing technique"],
    correct: 0, // Correct answer: "A balanced and mirrored composition"
  },
  {
    question: "What is the 'asymmetry' in photography?",
    answers: ["An unbalanced composition", "A type of camera lens", "A post-processing technique"],
    correct: 0, // Correct answer: "An unbalanced composition"
  },
  {
    question: "What is the 'rule of odds' in photography?",
    answers: ["A composition guideline suggesting an odd number of subjects", "A type of camera lens", "A post-processing technique"],
    correct: 0, // Correct answer: "A composition guideline suggesting an odd number of subjects"
  },
];
  // Function to shuffle an array using the Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Randomize the answers and update the correct index
quizData.forEach((question) => {
  const correctAnswer = question.answers[question.correct];
  const shuffledAnswers = shuffleArray([...question.answers]);
  question.answers = shuffledAnswers;
  question.correct = shuffledAnswers.indexOf(correctAnswer);
});

console.log(quizData);