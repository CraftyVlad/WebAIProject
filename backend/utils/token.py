from datetime import datetime, timedelta
from jose import jwt
from constants.keys import SECRET_KEY, ALGORITHM, JWT_EXPIRE_MINUTES

def create_access_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    to_encode = {"email": email, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> str | None:
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded["email"]
    except:
        return None