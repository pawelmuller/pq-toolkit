from app.core.config import settings
import uvicorn

if __name__ == "__main__":
    local_environment = settings.ENVIRONMENT == "local"
    if local_environment:
        print("Uvicorn reloading is enabled.")
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PQ_API_PORT, reload=local_environment)
