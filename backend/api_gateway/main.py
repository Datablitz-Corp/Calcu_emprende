from fastapi import FastAPI, HTTPException
import httpx
from fastapi.middleware.cors import CORSMiddleware

# App
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GET / POST / DELET
@app.get("/")
def read_root():
    return {"message": "API Gateway funcionando"}

DJANGO_API_URL = "http://localhost:8000/api"

@app.post("/register/")
async def register_user(user_data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{DJANGO_API_URL}/register/", json=user_data)
        return response.json()

@app.post("/login/")
async def login_user(user_data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{DJANGO_API_URL}/login/", json=user_data)
        return response.json()
