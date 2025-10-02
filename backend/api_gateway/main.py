from fastapi import FastAPI, Request, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field, validator
from dotenv import load_dotenv
from jose import jwt, JWTError
import requests
import uvicorn
import httpx
import os


# clave y algoritmo -> Django
SECRET_KEY = "django-insecure-7@went*=n_z7ka&k^e$jl(p074bmd75h+e166*u9kximil-3t#"
ALGORITHM = "HS256"


######## FUNCIONES

# --- Función para extraer el user_id del token ---
def obtener_user_id_desde_token(token: str):
    if not token:
        raise HTTPException(status_code=401, detail="Token no proporcionado")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token inválido: no contiene user_id")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")


# App
app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")  # default opcional

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  # dummy url para extraer token

async def get_user_headers(token: str = Depends(oauth2_scheme)):
    return {"Authorization": f"Bearer {token}"}


#  RUTAS  ###########  GET / POST / DELET 


@app.get("/")
def read_root():
    return {"message": "API Gateway funcionando"}


DJANGO_API_URL = "http://django:8000/"


# Inicio de sesion


@app.post("/register/")
async def register_user(request: Request):
    try:
        # 1. Recibir datos desde React
        data = await request.json()

        # 2. Mandar esos datos al backend Django
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(f"{DJANGO_API_URL}/register/", json=data)

        # 3. Manejar la respuesta de Django
        if response.status_code == 201:
            return {
                "message": "Usuario registrado correctamente",
                "data": response.json()
            }
        else:
            # Retornar error tal cual viene de Django
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json()
            )

    except httpx.RequestError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Error al conectar con Django: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno en gateway: {str(e)}"
        )

@app.post("/login/")
async def login_user(data: dict):
    try:
        response = requests.post("http://django:8000/login/", json=data)
        if response.status_code == 200:
            return response.json()
        else:
            print("Respuesta desde Django (no 200):", response.text)
            raise HTTPException(status_code=response.status_code, detail="Error al autenticar")
    except requests.exceptions.RequestException as e:
        print("Error de conexión con Django:", str(e))
        raise HTTPException(status_code=500, detail="No se pudo conectar al backend Django")




# ---------------------  Recuperacion Contraseña ----------------------


@app.post("/password-reset/request/")
async def proxy_request_reset(request: Request):
    data = await request.json()
    async with httpx.AsyncClient() as client:
        r = await client.post(f"{DJANGO_URL}/password-reset/request/", json=data)
    return r.json()

@app.post("/password-reset/confirm/")
async def proxy_reset_confirm(request: Request):
    data = await request.json()
    async with httpx.AsyncClient() as client:
        r = await client.post(f"{DJANGO_URL}/password-reset/confirm/", json=data)
    return r.json()

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

# ---- lista negocios ----
@app.get("/negocios/")
async def listar_negocios(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Formato de token inválido")

    token = authorization.replace("Bearer ", "")
    user_id = obtener_user_id_desde_token(token)

    if not user_id:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{DJANGO_API_URL}/negocio/lista/{user_id}/",
                headers={"Authorization": authorization}
            )

        print("📌 Respuesta Django:", response.status_code, response.text)

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json()
            )

        return response.json()

    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión con Django API: {str(e)}")

# Crear negocio
@app.post("/negocios/")
async def crear_negocio(negocio_data: dict, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = obtener_user_id_desde_token(token)

    if not user_id:
        raise HTTPException(status_code=401, detail="Token inválido")

    negocio_data["ID_usuario"] = user_id

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{DJANGO_API_URL}/negocio/nuevo/",
            json=negocio_data,
            headers={"Authorization": authorization}
        )
    if response.status_code != 201:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()


# Eliminar Negocio
@app.delete("/eliminar-negocio/{negocio_id}")
async def eliminar_negocio(negocio_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.delete(f"{DJANGO_API_URL}/eliminar-negocio/{negocio_id}/")
        if response.status_code == 200:
            return response.json()
        raise HTTPException(status_code=response.status_code, detail=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# actualizar negocio
@app.put("/negocio/{negocio_id}/actualizar")
async def actualizar_negocio(negocio_id: int, request: Request, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = obtener_user_id_desde_token(token)

    if not user_id:
        raise HTTPException(status_code=401, detail="Token inválido")

    payload = await request.json()
    payload["ID_usuario"] = user_id  

    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{DJANGO_API_URL}/negocio/{negocio_id}/actualizar",
            json=payload,
            headers={"Authorization": authorization}
        )
    
    return JSONResponse(status_code=response.status_code, content=response.json())


# Detalle de 1 Negocio 
@app.get("/detalle-negocio/{negocio_id}")
async def get_negocio_detalle(negocio_id: int, headers: dict = Depends(get_user_headers)):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{DJANGO_API_URL}/detalle-negocio/{negocio_id}/", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()


@app.get("/debug/token/")
def debug_token(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = obtener_user_id_desde_token(token)
    return {"user_id": user_id}



if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=9000, reload=True)

