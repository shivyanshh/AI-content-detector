from PIL import Image
from transformers import pipeline


MODEL_NAME = "Smogy/SMOGY-Ai-images-detector"


classifier = pipeline(
    "image-classification",
    model=MODEL_NAME
)


def detect_image(image_source):

    image = Image.open(image_source).convert("RGB")

    results = classifier(
        image,
        top_k=2
    )

    best_result = results[0]

    label = best_result["label"].lower()
    confidence = best_result["score"] * 100

    if label == "artificial":
        prediction = "Likely AI-Generated"
    else:
        prediction = "Likely Real"

    return {
        "prediction": prediction,
        "confidence": round(confidence, 2)
    }


# Local test
if __name__ == "__main__":

    result = detect_image("test.jpg")

    print(result)