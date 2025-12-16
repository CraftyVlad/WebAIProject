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
    now = datetime.utcnow().isoformat()
    db = get_db()
    cur = db.cursor()

    try:
        cur.execute(
            """
            INSERT INTO users (username, email, password, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user.username, user.email, hash_password(user.password), now, now)
        )
        db.commit()
    except:
        raise HTTPException(status_code=400, detail="User already exists")
    finally:
        db.close()

    return {"success": True}


@router.post("/login", response_model=AuthUser)
def login(user: UserLogin):
    db = get_db()
    cur = db.cursor()

    cur.execute(
        """
        SELECT username, email, password, created_at, updated_at
        FROM users WHERE username=?
        """,
        (user.username,)
    )
    row = cur.fetchone()
    db.close()

    if not row or not verify_password(user.password, row[2]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    jwt_token = create_access_token(row[0])

    return AuthUser(
        user=User(
            username=row[0],
            email=row[1],
            created_at=row[3],
            updated_at=row[4]
        ),
        jwt=jwt_token,
        token_type="bearer",
        expires=datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    )

@router.put("/me")
def update_user(
    data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    cur = db.cursor()

    updates = []
    values = []

    if data.username:
        updates.append("username=?")
        values.append(data.username)

    if data.email:
        updates.append("email=?")
        values.append(data.email)

    if data.password:
        updates.append("password=?")
        values.append(hash_password(data.password))

    if not updates:
        raise HTTPException(status_code=400, detail="No data to update")

    updates.append("updated_at=?")
    values.append(datetime.utcnow().isoformat())

    values.append(current_user["username"])

    cur.execute(
        f"""
        UPDATE users SET {", ".join(updates)}
        WHERE username=?
        """,
        tuple(values)
    )

    db.commit()
    db.close()

    return {"success": True, "message": "User updated"}

@router.delete("/me")
def delete_user(current_user: dict = Depends(get_current_user)):
    db = get_db()
    cur = db.cursor()

    cur.execute(
        "DELETE FROM users WHERE username=?",
        (current_user["username"],)
    )

    db.commit()
    db.close()

    return {"success": True, "message": "User deleted"}

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