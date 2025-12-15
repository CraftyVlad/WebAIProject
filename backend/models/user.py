from pydantic import BaseModel, EmailStr, Field
from typing import Any

class User(BaseModel):
    username: str
    email: EmailStr
    created_at: Any
    updated_at: Any

class AuthUser(BaseModel):
    user: User
    jwt: str
    token_type: str
    expires: Any


class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username: str
    password: str = Field(..., min_length=6)