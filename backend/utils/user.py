from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from utils import verify_token
from db.database import get_db

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    username = verify_token(token)

    if not username:
        raise HTTPException(status_code=401, detail="Token is invalid or expired")

    db = get_db()
    cur = db.cursor()
    cur.execute(
        "SELECT id, username, email, created_at, updated_at FROM users WHERE username=?",
        (username,)
    )
    row = cur.fetchone()
    db.close()

    if not row:
        raise HTTPException(status_code=401, detail="User not found")

    return {
        "id": row[0],
        "username": row[1],
        "email": row[2],
        "created_at": row[3],
        "updated_at": row[4]
    }