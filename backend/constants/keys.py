import os

SECRET_KEY = os.getenv("JWT_SECRET", "dev-secret")
ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60