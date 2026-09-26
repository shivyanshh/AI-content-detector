from transformers import pipeline


MODEL_NAME = "rasbt/ai-text-detector-modernbert"


detector = pipeline(
    "text-classification",
    model=MODEL_NAME
)


def detect_text(text):

    result = detector(text)[0]

    label = result["label"] #AI/HUMAN
    score = result["score"]

    confidence_percentage = round(score * 100, 2) #rounding off the data 0.924237823772483248732848432984=92.42%

    if label == "AI":
        prediction = "Likely AI-Generated"
    else:
        prediction = "Likely Human-Written"

    return {
        "prediction": prediction,
        "confidence": confidence_percentage
    }
if __name__ == "__main__":
    text = """hi i am john and i am here to teach you basics of fundemental of computing"""
    #text = """
    #Artificial intelligence is transforming many industries
    #by automating repetitive tasks and assisting people
    #with complex decision-making.
    #"""
    result = detect_text(text)

    print(result)