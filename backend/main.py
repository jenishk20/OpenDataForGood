from fastapi import FastAPI
import requests
from mangum import Mangum

app = FastAPI()

FHIR_SERVER_URL = "https://r4.smarthealthit.org/Patient?_format=json"

@app.get("/patients")
def get_patients():
    response = requests.get(FHIR_SERVER_URL)
    if response.status_code == 200:
        try:
            return response.json().get("entry", [])
        except ValueError as e:
            return {"error": f"JSON decoding error: {str(e)}"}
    return {"error": "Failed to fetch data"}


handler = Mangum(app)
