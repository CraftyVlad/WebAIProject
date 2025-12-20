from fastapi import Depends, HTTPException, APIRouter
from datetime import datetime, timedelta
from fastapi.security import HTTPAuthorizationCredentials

from db.database import get_db
from models.user import UserRegister, UserLogin, User, AuthUser, UserUpdate
from utils.user import get_current_user, security
from utils.password import hash_password, verify_password
from utils.token import create_access_token
from constants.keys import JWT_EXPIRE_MINUTES

router = APIRouter()

@router.post("/register")
def register(user: UserRegister):
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    db = get_db()
    cur = db.cursor()

    cur.execute(
        "SELECT 1 FROM users WHERE email=?",
        (user.email,)
    )
    exists = cur.fetchone()

    if exists:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    now = datetime.utcnow().isoformat()
    cur.execute(
        """
        INSERT INTO users (email, password, created_at, updated_at)
        VALUES (?, ?, ?, ?)
        """,
        (user.email, hash_password(user.password), now, now)
    )

    db.commit()
    db.close()

    return {"success": True}


@router.post("/login", response_model=AuthUser)
def login(user: UserLogin):
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    db = get_db()
    cur = db.cursor()

    cur.execute(
        """
        SELECT email, password, created_at, updated_at
        FROM users WHERE email=?
        """,
        (user.email,)
    )
    row = cur.fetchone()

    if not row or not row[1]:
        db.close()
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, row[1]):
        db.close()
        raise HTTPException(status_code=400, detail="Invalid credentials")

    jwt_token = create_access_token(row[0])
    db.close()

    return AuthUser(
        user=User(
            email=row[0],
            created_at=row[2],
            updated_at=row[3]
        ),
        jwt=jwt_token,
        token_type="bearer",
        expires=datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    )

@router.post("/logout")
def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    db = get_db()
    cur = db.cursor()
    cur.execute(
        "INSERT INTO token_blacklist (token, expires_at) VALUES (?, ?)",
        (token, datetime.utcnow().isoformat())
    )
    db.commit()
    db.close()

    return {"success": True}