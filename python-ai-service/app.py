from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel

from io import BytesIO
from PIL import UnidentifiedImageError

from detector import detect_text
from image_detector import detect_image as detect_ai_image


app = FastAPI()


class TextRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return {
        "message": "AI Content Detector API is running"
    }


# -------------------------
# TEXT DETECTION
# -------------------------

@app.post("/detect")
def detect(request: TextRequest):

    result = detect_text(request.text)

    return result


# -------------------------
# IMAGE DETECTION
# -------------------------

@app.post("/detect-image")
async def detect_image(file: UploadFile = File(...)):

    try:

        contents = await file.read()

        image_file = BytesIO(contents)

        result = detect_ai_image(image_file)

        return result

    except UnidentifiedImageError:

        raise HTTPException(
            status_code=400,
            detail="Uploaded file is not a valid image."
        )