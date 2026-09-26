from pydantic import BaseModel #basemodel which defines the structure of data coming into your api
from fastapi import FastAPI #for creating web server api

from detector import detect_text  #importing detect_text from detector.py


app = FastAPI()   #object of fastapi basically app=backend


class TextRequest(BaseModel):   #json:{  
    text: str                   #        "text"(variable) : "some line in string type"
                                #}

@app.get("/") #decorator @ lets you add extra behaviour to the function 
def home():   
    return {
        "message": "AI Content Detector API is running"
    }
#python -m uvicorn app:app --reload

@app.post("/detect")
def detect(request: TextRequest):

    result = detect_text(request.text)

    return result