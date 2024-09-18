from fastapi import FastAPI
from med import predict_disease_and_recommend_medication
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI()

@app.get("/med/")
async def opt_med(symptoms: str): 
    symptoms_list = [symptom.strip() for symptom in symptoms.split(',')]
    desc = predict_disease_and_recommend_medication(symptoms_list)
    return {"description": desc}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
