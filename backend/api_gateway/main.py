from fastapi import FastAPI, Request, HTTPException, Depends
import httpx
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

# App
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  # dummy url para extraer token

async def get_user_headers(token: str = Depends(oauth2_scheme)):
    return {"Authorization": f"Bearer {token}"}

# GET / POST / DELET
@app.get("/")
def read_root():
    return {"message": "API Gateway funcionando"}

DJANGO_API_URL = "http://localhost:8000/api"

@app.post("/register/")
async def register_user(user_data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{DJANGO_API_URL}/register/", json=user_data)
        
        if response.status_code == 201:
            return response.json()
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json()
            )

@app.post("/login/")
async def login_user(user_data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{DJANGO_API_URL}/login/", json=user_data)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json()
            )


@app.get("/usuario")
async def get_usuario(headers: dict = Depends(get_user_headers)):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{DJANGO_API_URL}/usuario/", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()

@app.put("/usuario")
async def update_usuario(request: Request, headers: dict = Depends(get_user_headers)):
    data = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{DJANGO_API_URL}/usuario/", headers=headers, json=data)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()


# --------------------- NUEVOS ENDPOINTS PARA NEGOCIOS ----------------------

@app.get("/negocios/")
async def listar_negocios(headers: dict = Depends(get_user_headers)):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{DJANGO_API_URL}/negocios/", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()

@app.post("/negocios/")
async def crear_negocio(negocio_data: dict, headers: dict = Depends(get_user_headers)):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{DJANGO_API_URL}/negocios/", json=negocio_data, headers=headers)
    if response.status_code != 201:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()

@app.get("/negocios/{negocio_id}/")
async def obtener_negocio(negocio_id: int, headers: dict = Depends(get_user_headers)):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{DJANGO_API_URL}/negocios/{negocio_id}/", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()

@app.put("/negocios/{negocio_id}/")
async def actualizar_negocio(negocio_id: int, negocio_data: dict, headers: dict = Depends(get_user_headers)):
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{DJANGO_API_URL}/negocios/{negocio_id}/", json=negocio_data, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()

@app.delete("/negocios/{negocio_id}/")
async def eliminar_negocio(negocio_id: int, headers: dict = Depends(get_user_headers)):
    async with httpx.AsyncClient() as client:
        response = await client.delete(f"{DJANGO_API_URL}/negocios/{negocio_id}/", headers=headers)
    if response.status_code != 204:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return {"detail": "Negocio eliminado"}
