from fastapi import FastAPI, Request, HTTPException, Depends, Header
import httpx
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError


# Reemplaza esto por la misma clave y algoritmo que usas en Django
SECRET_KEY = "django-insecure-7@went*=n_z7ka&k^e$jl(p074bmd75h+e166*u9kximil-3t#"
ALGORITHM = "HS256"


def obtener_user_id_desde_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("PAYLOAD DECODIFICADO:", payload)
        return payload.get("user_id")  # esto debe existir en el payload
    except JWTError as e:
        print("❌ ERROR al decodificar token:", e)
        return None


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



# ---------------------  Usuario ----------------------

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


# ---------------------  NEGOCIOS ----------------------

@app.get("/negocios/")
async def listar_negocios(authorization: str = Header(...)):
    #print("HEADER Authorization recibido:", authorization) 

    token = authorization.replace("Bearer ", "")
    user_id = obtener_user_id_desde_token(token)

    if not user_id:
        raise HTTPException(status_code=401, detail="Token inválido")

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{DJANGO_API_URL}/negocio/lista/{user_id}/",
            headers={"Authorization": authorization}
        )
    return response.json()


@app.post("/negocios/")
async def crear_negocio(negocio_data: dict, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = obtener_user_id_desde_token(token)

    if not user_id:
        raise HTTPException(status_code=401, detail="Token inválido")

    negocio_data["ID_usuario"] = user_id

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{DJANGO_API_URL}/negocio/crear/",
            json=negocio_data,
            headers={"Authorization": authorization}
        )
    if response.status_code != 201:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()


@app.delete("/negocios/{negocio_id}/")
async def eliminar_negocio(negocio_id: int, headers: dict = Depends(get_user_headers)):
    async with httpx.AsyncClient() as client:
        response = await client.delete(f"{DJANGO_API_URL}/negocio/eliminar/{negocio_id}/", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return {"detail": "Negocio eliminado"}


@app.get("/debug/token/")
def debug_token(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = obtener_user_id_desde_token(token)
    return {"user_id": user_id}
