from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import database, models
from api import routes

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="0Wat System API")

# Setup CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all. Change in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the 0Wat System API"}
