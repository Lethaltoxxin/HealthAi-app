from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load rules and data here if needed
    logger.info("Startup: Loading rules and data...")
    yield
    logger.info("Shutdown: Cleaning up...")

def create_app() -> FastAPI:
    app = FastAPI(
        title="HealthAi API",
        version="1.0.0",
        lifespan=lifespan
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Health Check
    @app.get("/health")
    async def health_check():
        return {"status": "ok", "service": "HealthAi Backend"}

    # Include routers
    from app.routers import events, symptom_check, workout_gen, chat
    app.include_router(events.router)
    app.include_router(symptom_check.router)
    app.include_router(workout_gen.router)
    app.include_router(chat.router)
    
    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
