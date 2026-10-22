// ================================
// ELEMENTS
// ================================

const textModeButton =
    document.getElementById("textModeButton");

const imageModeButton =
    document.getElementById("imageModeButton");

const textMode =
    document.getElementById("textMode");

const imageMode =
    document.getElementById("imageMode");


const textInput =
    document.getElementById("textInput");

const wordCount =
    document.getElementById("wordCount");


const imageInput =
    document.getElementById("imageInput");

const uploadArea =
    document.getElementById("uploadArea");

const uploadPlaceholder =
    document.getElementById("uploadPlaceholder");

const imagePreviewContainer =
    document.getElementById("imagePreviewContainer");

const imagePreview =
    document.getElementById("imagePreview");

const imageFileName =
    document.getElementById("imageFileName");

const removeImageButton =
    document.getElementById("removeImageButton");


const detectButton =
    document.getElementById("detectButton");

const clearButton =
    document.getElementById("clearButton");


const resultCard =
    document.getElementById("resultCard");

const prediction =
    document.getElementById("prediction");

const confidence =
    document.getElementById("confidence");

const confidenceText =
    document.getElementById("confidenceText");

const progressFill =
    document.getElementById("progressFill");

const resultDescription =
    document.getElementById("resultDescription");


const errorMessage =
    document.getElementById("errorMessage");


const loader =
    document.getElementById("loader");

const buttonText =
    document.getElementById("buttonText");



// ================================
// STATE
// ================================

let currentMode = "text";

let selectedImage = null;



// ================================
// MODE SWITCHING
// ================================

textModeButton.addEventListener(
    "click",
    function () {

        currentMode = "text";

        textModeButton.classList.add("active");

        imageModeButton.classList.remove("active");


        textMode.classList.remove("hidden");

        imageMode.classList.add("hidden");


        resetResult();

    }
);



imageModeButton.addEventListener(
    "click",
    function () {

        currentMode = "image";

        imageModeButton.classList.add("active");

        textModeButton.classList.remove("active");


        imageMode.classList.remove("hidden");

        textMode.classList.add("hidden");


        resetResult();

    }
);



// ================================
// WORD COUNT
// ================================

textInput.addEventListener(
    "input",
    function () {

        const text =
            textInput.value.trim();


        const words =
            text === ""
                ? 0
                : text.split(/\s+/).length;


        wordCount.innerText =
            `${words} ${words === 1 ? "word" : "words"}`;

    }
);



// ================================
// IMAGE UPLOAD
// ================================

uploadArea.addEventListener(
    "click",
    function () {

        if (!selectedImage) {

            imageInput.click();
        }

    }
);



imageInput.addEventListener(
    "change",
    function () {

        const file =
            imageInput.files[0];


        if (file) {

            loadImage(file);
        }

    }
);



// ================================
// DRAG AND DROP
// ================================

uploadArea.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        uploadArea.classList.add(
            "dragging"
        );

    }
);



uploadArea.addEventListener(
    "dragleave",
    function () {

        uploadArea.classList.remove(
            "dragging"
        );

    }
);



uploadArea.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();


        uploadArea.classList.remove(
            "dragging"
        );


        const file =
            event.dataTransfer.files[0];


        if (file) {

            loadImage(file);
        }

    }
);



// ================================
// LOAD IMAGE
// ================================

function loadImage(file) {

    if (!file.type.startsWith("image/")) {

        showError(
            "Please upload a valid image file."
        );

        return;
    }


    selectedImage = file;


    imageFileName.innerText =
        file.name;


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            imagePreview.src =
                event.target.result;

        };


    reader.readAsDataURL(file);


    uploadPlaceholder.classList.add(
        "hidden"
    );


    imagePreviewContainer.classList.remove(
        "hidden"
    );


    resetResult();
}



// ================================
// REMOVE IMAGE
// ================================

removeImageButton.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        clearImage();

    }
);



function clearImage() {

    selectedImage = null;

    imageInput.value = "";


    imagePreview.src = "";

    imageFileName.innerText = "";


    imagePreviewContainer.classList.add(
        "hidden"
    );


    uploadPlaceholder.classList.remove(
        "hidden"
    );


    resetResult();
}



// ================================
// CLEAR BUTTON
// ================================

clearButton.addEventListener(
    "click",
    function () {

        if (currentMode === "text") {

            textInput.value = "";

            wordCount.innerText =
                "0 words";
        }

        else {

            clearImage();
        }


        resetResult();

    }
);



// ================================
// ANALYZE BUTTON
// ================================

detectButton.addEventListener(
    "click",
    async function () {

        if (currentMode === "text") {

            await analyzeText();

        }

        else {

            await analyzeImage();

        }

    }
);



// ================================
// TEXT ANALYSIS
// ================================

async function analyzeText() {

    const text =
        textInput.value.trim();


    if (text === "") {

        showError(
            "Please enter some text before analyzing."
        );

        return;
    }


    startLoading();


    try {

        const response =
            await fetch(
                "/api/detect",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            {
                                text: text
                            }
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                "Text detection failed."
            );
        }


        const data =
            await response.json();


        showResult(
            data.prediction,
            data.confidence,
            "text"
        );

    }

    catch (error) {

        console.error(error);


        showError(
            "Unable to analyze the text. Make sure the AI services are running."
        );

    }

    finally {

        stopLoading();
    }
}



// ================================
// IMAGE ANALYSIS
// ================================

async function analyzeImage() {

    if (!selectedImage) {

        showError(
            "Please upload an image before analyzing."
        );

        return;
    }


    startLoading();


    try {

        const formData =
            new FormData();


        formData.append(
            "file",
            selectedImage
        );


        const response =
            await fetch(
                "/api/detect-image",
                {

                    method: "POST",

                    body: formData
                }
            );


        if (!response.ok) {

            throw new Error(
                "Image detection failed."
            );
        }


        const data =
            await response.json();


        showResult(
            data.prediction,
            data.confidence,
            "image"
        );

    }

    catch (error) {

        console.error(error);


        showError(
            "Unable to analyze the image. Make sure the AI services are running."
        );

    }

    finally {

        stopLoading();
    }
}



// ================================
// SHOW RESULT
// ================================

function showResult(
    predictionValue,
    confidenceValue,
    type
) {

    errorMessage.classList.add(
        "hidden"
    );


    resultCard.classList.remove(
        "hidden"
    );


    prediction.innerText =
        predictionValue;


    const numericConfidence =
        Number(confidenceValue);


    confidence.innerText =
        numericConfidence.toFixed(2)
        + "%";


    confidenceText.innerText =
        numericConfidence.toFixed(2)
        + "%";


    progressFill.style.width =
        Math.min(
            numericConfidence,
            100
        )
        + "%";


    const isAI =
        predictionValue
            .toLowerCase()
            .includes("ai");


    if (type === "text") {

        if (isAI) {

            resultDescription.innerText =
                "The model detected writing patterns that are more consistent with AI-generated text.";
        }

        else {

            resultDescription.innerText =
                "The model detected writing patterns that are more consistent with human-written text.";
        }

    }


    else {

        if (isAI) {

            resultDescription.innerText =
                "The image detector found visual patterns that are more consistent with AI-generated imagery.";
        }

        else {

            resultDescription.innerText =
                "The image detector found visual patterns that are more consistent with a real image.";
        }

    }

}



// ================================
// ERRORS
// ================================

function showError(message) {

    resultCard.classList.add(
        "hidden"
    );


    errorMessage.classList.remove(
        "hidden"
    );


    errorMessage.innerText =
        message;
}



// ================================
// RESET RESULT
// ================================

function resetResult() {

    resultCard.classList.add(
        "hidden"
    );


    errorMessage.classList.add(
        "hidden"
    );


    progressFill.style.width =
        "0%";
}



// ================================
// LOADING
// ================================

function startLoading() {

    detectButton.disabled = true;


    buttonText.innerText =
        "Analyzing...";


    loader.classList.remove(
        "hidden"
    );
}



function stopLoading() {

    detectButton.disabled = false;


    buttonText.innerText =
        "Analyze Content";


    loader.classList.add(
        "hidden"
    );
}