from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import requests
from app.v1.utils.database import get_db
from app.v1.routes.user_routes import router as user_router
from app.v1.utils.database import Base, engine
from app.v1.schemas.token import Token
from app.v1.schemas.user import User
from app.v1.services.auth_service import get_current_active_user
from app.v1.services.jwt_service import create_access_token
from app.v1.services.password_service import verify_password
from app.v1.services.user_service import get_user_by_email


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user_router)
origins = [
    "http://localhost:3007",
    "http://127.0.0.1:3007",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

origins = [
    "http://localhost:3007",
    "http://127.0.0.1:3007",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)


@app.middleware("http")
async def add_csp_header(request, call_next):
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; script-src 'self' https://maps.googleapis.com https://webcams.windy.com; style-src 'self'"
    )
    return response


app.include_router(user_router, prefix="/api/v1", tags=["Users"])


@app.post(
    "/api/v1/login",
    tags=["users"],
    response_model=Token,
    summary="Login for access token",
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    return get_access_token(db=db, form_data=form_data)


def get_access_token(db: Session, form_data: OAuth2PasswordRequestForm):
    db_user = get_user_by_email(db, form_data.username)
    if not db_user or not verify_password(form_data.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": db_user.email, "role": db_user.role}
    )
    return {"access_token": access_token, "token_type": "bearer", "role": db_user.role}


@app.get("/api/v1/weather")
async def get_weather(
    latitude: float, longitude: float, api_key: str = "a6e0ef954a57bf8464f0d71424777dbc"
):
    """Obtiene la información del clima de OpenWeatherMap."""
    try:
        response = requests.get(
            f"https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={api_key}&units=metric&lang=es"
        )
        response.raise_for_status()  # Lanza una excepción si hay un error
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500, detail=f"Error al obtener datos del clima: {e}"
        )
