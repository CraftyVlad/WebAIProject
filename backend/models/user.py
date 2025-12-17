from pydantic import BaseModel, EmailStr, Field
from typing import Any
from typing import Optional

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
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6)