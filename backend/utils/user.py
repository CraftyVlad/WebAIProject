from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from utils import verify_token
from db.database import get_db

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    email = verify_token(token)

    if not email:
        raise HTTPException(status_code=401, detail="Token is invalid or expired")

    db = get_db()
    cur = db.cursor()
    cur.execute(
        """
        SELECT id, email, created_at, updated_at
        FROM users
        WHERE email=?
        """,
        (email,)
    )
    row = cur.fetchone()
    
    cur.execute("SELECT 1 FROM token_blacklist WHERE token=?", (token,))
    if cur.fetchone():
        raise HTTPException(status_code=401, detail="Token revoked")
    
    db.close()

    if not row:
        raise HTTPException(status_code=401, detail="User not found")

    return {
        "id": row[0],
        "email": row[1],
        "created_at": row[2],
        "updated_at": row[3]
    }