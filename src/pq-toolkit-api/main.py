from app.main import app
from app.core.config import settings
import uvicorn

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=settings.PQ_API_PORT)
